-- Simple direct insert for user setup
INSERT INTO profiles (id, display_name, company_name, created_at, updated_at)
VALUES ('d9c01862-16fe-4009-a615-9c00c127c399', 'User', 'My Restaurant', now(), now());

INSERT INTO organizations (id, name, domain, created_at, updated_at)
VALUES (gen_random_uuid(), 'My Restaurant', 'my-restaurant', now(), now());

INSERT INTO organization_members (id, organization_id, user_id, role, created_at)
SELECT 
  gen_random_uuid(), 
  o.id, 
  'd9c01862-16fe-4009-a615-9c00c127c399', 
  'owner', 
  now()
FROM organizations o 
WHERE o.name = 'My Restaurant';