Create script for user organizations

-- SQL to create organizations for all existing users

-- Create organizations for existing users who don't have one
DO $$
DECLARE
  user_record RECORD;
  new_org_id UUID;
BEGIN
  -- Get all users from auth.users who don't have an organization
  FOR user_record IN 
    SELECT id, email FROM auth.users WHERE id NOT IN (
      SELECT user_id FROM user_organizations
    )
  LOOP
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
    
    -- Update user's records to use this organization
    UPDATE records 
    SET organization_id = new_org_id
    WHERE user_id = user_record.id AND organization_id IS NULL;
    
    RAISE NOTICE 'Created organization % for user %', new_org_id, user_record.id;
  END LOOP;
END$$;

-- Add your SQL statements here