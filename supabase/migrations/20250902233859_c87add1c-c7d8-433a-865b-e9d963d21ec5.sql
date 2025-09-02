-- Temporarily disable the trigger, insert data, then re-enable
DROP TRIGGER IF EXISTS create_organization_on_profile_insert ON profiles;

-- Insert the profile
INSERT INTO profiles (id, display_name, company_name, created_at, updated_at)
VALUES ('d9c01862-16fe-4009-a615-9c00c127c399', 'User', 'My Restaurant', now(), now());

-- Insert the organization
INSERT INTO organizations (id, name, domain, created_at, updated_at)
VALUES (gen_random_uuid(), 'My Restaurant', 'my-restaurant', now(), now());

-- Insert the organization membership
INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
SELECT 
  gen_random_uuid(), 
  o.id, 
  'd9c01862-16fe-4009-a615-9c00c127c399', 
  'owner', 
  now()
FROM organizations o 
WHERE o.name = 'My Restaurant';

-- Recreate the trigger
CREATE TRIGGER create_organization_on_profile_insert
  AFTER INSERT ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION create_user_organization();