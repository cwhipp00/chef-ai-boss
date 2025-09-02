-- Create profile and organization for existing user
DO $$
DECLARE
  org_id uuid;
  org_name text := 'My Restaurant';
  target_user_id uuid := 'd9c01862-16fe-4009-a615-9c00c127c399';
BEGIN
  -- Create profile if it doesn't exist
  INSERT INTO profiles (id, display_name, company_name, created_at, updated_at)
  VALUES (target_user_id, 'User', org_name, now(), now())
  ON CONFLICT (id) DO UPDATE SET 
    company_name = COALESCE(profiles.company_name, org_name),
    display_name = COALESCE(profiles.display_name, 'User');
  
  -- Create organization if user doesn't have one
  IF NOT EXISTS (
    SELECT 1 FROM organization_members om WHERE om.user_id = target_user_id
  ) THEN
    -- Create organization
    INSERT INTO organizations (id, name, domain, created_at, updated_at)
    VALUES (gen_random_uuid(), org_name, 'my-restaurant', now(), now())
    RETURNING id INTO org_id;
    
    -- Add user as owner of their organization
    INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
    VALUES (gen_random_uuid(), org_id, target_user_id, 'owner', now());
    
    RAISE NOTICE 'Created organization % for user %', org_name, target_user_id;
  END IF;
END $$;