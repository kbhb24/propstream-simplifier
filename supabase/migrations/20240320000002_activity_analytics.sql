-- Create function to get activity analytics
CREATE OR REPLACE FUNCTION get_activity_analytics(
  p_organization_id UUID,
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
) RETURNS TABLE (
  total_activities BIGINT,
  activities_by_type JSONB,
  activities_by_user JSONB,
  activities_by_day JSONB,
  top_actions JSONB,
  top_entities JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH activity_stats AS (
    SELECT
      COUNT(*) as total_activities,
      jsonb_object_agg(
        entity_type,
        COUNT(*)
      ) as activities_by_type,
      jsonb_object_agg(
        user_id,
        COUNT(*)
      ) as activities_by_user,
      jsonb_object_agg(
        DATE(created_at),
        COUNT(*)
      ) as activities_by_day,
      jsonb_object_agg(
        action,
        COUNT(*)
      ) as top_actions,
      jsonb_object_agg(
        entity_type,
        COUNT(*)
      ) as top_entities
    FROM activity_logs
    WHERE organization_id = p_organization_id
      AND created_at BETWEEN p_start_date AND p_end_date
    GROUP BY organization_id
  )
  SELECT
    total_activities,
    activities_by_type,
    activities_by_user,
    activities_by_day,
    top_actions,
    top_entities
  FROM activity_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get user activity metrics
CREATE OR REPLACE FUNCTION get_user_activity_metrics(
  p_user_id UUID,
  p_days INTEGER DEFAULT 30
) RETURNS TABLE (
  total_activities BIGINT,
  average_daily_activities FLOAT,
  most_active_hour INTEGER,
  most_active_day TEXT,
  activity_trend JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH daily_stats AS (
    SELECT
      DATE(created_at) as activity_date,
      COUNT(*) as daily_count,
      EXTRACT(HOUR FROM created_at) as activity_hour,
      EXTRACT(DOW FROM created_at) as day_of_week
    FROM activity_logs
    WHERE user_id = p_user_id
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at), EXTRACT(HOUR FROM created_at), EXTRACT(DOW FROM created_at)
  ),
  activity_trend AS (
    SELECT jsonb_object_agg(
      activity_date,
      daily_count
    ) as trend_data
    FROM daily_stats
  )
  SELECT
    SUM(daily_count) as total_activities,
    AVG(daily_count) as average_daily_activities,
    MODE() WITHIN GROUP (ORDER BY activity_hour)::INTEGER as most_active_hour,
    CASE MODE() WITHIN GROUP (ORDER BY day_of_week)::INTEGER
      WHEN 0 THEN 'Sunday'
      WHEN 1 THEN 'Monday'
      WHEN 2 THEN 'Tuesday'
      WHEN 3 THEN 'Wednesday'
      WHEN 4 THEN 'Thursday'
      WHEN 5 THEN 'Friday'
      WHEN 6 THEN 'Saturday'
    END as most_active_day,
    (SELECT trend_data FROM activity_trend) as activity_trend
  FROM daily_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get entity activity metrics
CREATE OR REPLACE FUNCTION get_entity_activity_metrics(
  p_organization_id UUID,
  p_entity_type TEXT,
  p_days INTEGER DEFAULT 30
) RETURNS TABLE (
  total_activities BIGINT,
  activities_by_action JSONB,
  activities_by_user JSONB,
  activity_trend JSONB
) AS $$
BEGIN
  RETURN QUERY
  WITH entity_stats AS (
    SELECT
      DATE(created_at) as activity_date,
      action,
      user_id,
      COUNT(*) as daily_count
    FROM activity_logs
    WHERE organization_id = p_organization_id
      AND entity_type = p_entity_type
      AND created_at >= NOW() - (p_days || ' days')::INTERVAL
    GROUP BY DATE(created_at), action, user_id
  ),
  activity_trend AS (
    SELECT jsonb_object_agg(
      activity_date,
      daily_count
    ) as trend_data
    FROM entity_stats
  )
  SELECT
    SUM(daily_count) as total_activities,
    jsonb_object_agg(
      action,
      COUNT(*)
    ) as activities_by_action,
    jsonb_object_agg(
      user_id,
      COUNT(*)
    ) as activities_by_user,
    (SELECT trend_data FROM activity_trend) as activity_trend
  FROM entity_stats
  GROUP BY organization_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 