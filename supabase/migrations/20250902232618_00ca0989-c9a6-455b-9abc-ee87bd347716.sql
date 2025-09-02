-- Fix the organization setup for users
-- First, create a default organization if none exists for the user's company
INSERT INTO organizations (id, name, domain, created_at, updated_at)
SELECT 
  gen_random_uuid(),
  COALESCE(p.company_name, 'My Restaurant'),
  LOWER(REPLACE(COALESCE(p.company_name, 'My Restaurant'), ' ', '-')),
  now(),
  now()
FROM profiles p 
WHERE p.id = 'd9c01862-16fe-4009-a615-9c00c127c399'
AND NOT EXISTS (
  SELECT 1 FROM organization_members om 
  WHERE om.user_id = 'd9c01862-16fe-4009-a615-9c00c127c399'
);

-- Add the user as owner of their organization
INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
SELECT 
  gen_random_uuid(),
  o.id,
  'd9c01862-16fe-4009-a615-9c00c127c399',
  'owner',
  now()
FROM organizations o
WHERE o.name = (
  SELECT COALESCE(p.company_name, 'My Restaurant')
  FROM profiles p 
  WHERE p.id = 'd9c01862-16fe-4009-a615-9c00c127c399'
)
AND NOT EXISTS (
  SELECT 1 FROM organization_members om 
  WHERE om.user_id = 'd9c01862-16fe-4009-a615-9c00c127c399'
);

-- Create a function to auto-create organization membership for new users
CREATE OR REPLACE FUNCTION create_user_organization()
RETURNS TRIGGER AS $$
DECLARE
  org_id uuid;
  org_name text;
BEGIN
  -- Get company name or use default
  SELECT COALESCE(company_name, 'My Restaurant') INTO org_name
  FROM profiles WHERE id = NEW.id;
  
  -- Create organization if it doesn't exist
  INSERT INTO organizations (id, name, domain, created_at, updated_at)
  VALUES (gen_random_uuid(), org_name, LOWER(REPLACE(org_name, ' ', '-')), now(), now())
  ON CONFLICT (name) DO NOTHING
  RETURNING id INTO org_id;
  
  -- Get the organization ID if it already existed
  IF org_id IS NULL THEN
    SELECT id INTO org_id FROM organizations WHERE name = org_name;
  END IF;
  
  -- Add user as owner of their organization
  INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
  VALUES (gen_random_uuid(), org_id, NEW.id, 'owner', now())
  ON CONFLICT DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to auto-create organization membership when profile is created
DROP TRIGGER IF EXISTS create_organization_on_profile_insert ON profiles;
CREATE TRIGGER create_organization_on_profile_insert
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_organization();