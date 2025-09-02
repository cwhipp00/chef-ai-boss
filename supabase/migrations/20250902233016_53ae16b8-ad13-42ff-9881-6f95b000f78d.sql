-- Create organization for existing user manually (fixed version)
DO $$
DECLARE
  org_id uuid;
  org_name text;
  target_user_id uuid := 'd9c01862-16fe-4009-a615-9c00c127c399';
BEGIN
  -- Get company name or use default
  SELECT COALESCE(company_name, 'My Restaurant') INTO org_name
  FROM profiles WHERE id = target_user_id;
  
  -- Create organization if it doesn't exist for this user
  IF NOT EXISTS (
    SELECT 1 FROM organization_members om WHERE om.user_id = target_user_id
  ) THEN
    -- Create organization
    INSERT INTO organizations (id, name, domain, created_at, updated_at)
    VALUES (gen_random_uuid(), org_name, LOWER(REPLACE(org_name, ' ', '-')), now(), now())
    RETURNING id INTO org_id;
    
    -- Add user as owner of their organization
    INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
    VALUES (gen_random_uuid(), org_id, target_user_id, 'owner', now());
    
    RAISE NOTICE 'Created organization % for user %', org_name, target_user_id;
  END IF;
END $$;