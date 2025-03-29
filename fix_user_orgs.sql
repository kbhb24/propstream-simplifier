-- Simplified query to create organizations for users
DO $$
DECLARE
  user_record RECORD;
  new_org_id UUID;
BEGIN
  -- Get all users
  FOR user_record IN SELECT * FROM auth.users
  LOOP
    -- Check if user already has an organization
    IF NOT EXISTS (
      SELECT 1 FROM user_organizations WHERE user_id = user_record.id
    ) THEN
      -- Create organization
      INSERT INTO organizations (name, plan, max_users)
      VALUES (
        COALESCE(user_record.email, 'User') || '''s Organization', 
        'basic'::subscription_plan, 
        5
      )
      RETURNING id INTO new_org_id;
      
      -- Add user to organization as owner
      INSERT INTO user_organizations (user_id, organization_id, role, invitation_accepted_at)
      VALUES (user_record.id, new_org_id, 'owner', NOW());
      
      RAISE NOTICE 'Created organization % for user %', new_org_id, user_record.id;
    END IF;
  END LOOP;
  
  -- Update records without organization
  UPDATE records
  SET organization_id = (
    SELECT organization_id FROM user_organizations 
    WHERE user_id = records.user_id 
    LIMIT 1
  )
  WHERE organization_id IS NULL;
END$$; 