-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create activity_log_entries table for detailed activity tracking
CREATE TABLE IF NOT EXISTS activity_log_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_log_id UUID NOT NULL REFERENCES activity_logs(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create function to log activity
CREATE OR REPLACE FUNCTION log_activity(
  p_user_id UUID,
  p_organization_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
  v_activity_log_id UUID;
BEGIN
  INSERT INTO activity_logs (
    user_id,
    organization_id,
    action,
    entity_type,
    entity_id,
    details,
    ip_address,
    user_agent
  )
  VALUES (
    p_user_id,
    p_organization_id,
    p_action,
    p_entity_type,
    p_entity_id,
    p_details,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_activity_log_id;

  RETURN v_activity_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to log field changes
CREATE OR REPLACE FUNCTION log_field_changes(
  p_activity_log_id UUID,
  p_field_name TEXT,
  p_old_value JSONB,
  p_new_value JSONB
) RETURNS UUID AS $$
DECLARE
  v_entry_id UUID;
BEGIN
  INSERT INTO activity_log_entries (
    activity_log_id,
    field_name,
    old_value,
    new_value
  )
  VALUES (
    p_activity_log_id,
    p_field_name,
    p_old_value,
    p_new_value
  )
  RETURNING id INTO v_entry_id;

  RETURN v_entry_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create RLS policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log_entries ENABLE ROW LEVEL SECURITY;

-- Activity logs policies
CREATE POLICY "Users can view their own activity logs" ON activity_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view activity logs for their organization" ON activity_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organizations
      WHERE id = activity_logs.organization_id
      AND created_by = auth.uid()
    )
  );

-- Activity log entries policies
CREATE POLICY "Users can view their own activity log entries" ON activity_log_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activity_logs
      WHERE id = activity_log_entries.activity_log_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view activity log entries for their organization" ON activity_log_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM activity_logs al
      JOIN organizations o ON o.id = al.organization_id
      WHERE al.id = activity_log_entries.activity_log_id
      AND o.created_by = auth.uid()
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_organization_id ON activity_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_activity_log_entries_activity_log_id ON activity_log_entries(activity_log_id);

-- Create view for activity log details
CREATE OR REPLACE VIEW activity_log_details AS
SELECT
  al.id,
  al.user_id,
  al.organization_id,
  al.action,
  al.entity_type,
  al.entity_id,
  al.details,
  al.ip_address,
  al.user_agent,
  al.created_at,
  json_agg(
    json_build_object(
      'field_name', ale.field_name,
      'old_value', ale.old_value,
      'new_value', ale.new_value
    )
  ) FILTER (WHERE ale.id IS NOT NULL) as changes
FROM activity_logs al
LEFT JOIN activity_log_entries ale ON ale.activity_log_id = al.id
GROUP BY al.id;

-- Create function to get user activity summary
CREATE OR REPLACE FUNCTION get_user_activity_summary(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
) RETURNS TABLE (
  action TEXT,
  count BIGINT,
  last_occurrence TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.action,
    COUNT(*) as count,
    MAX(al.created_at) as last_occurrence
  FROM activity_logs al
  WHERE al.user_id = p_user_id
    AND al.created_at >= NOW() - (p_days || ' days')::INTERVAL
  GROUP BY al.action
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 