-- Manually trigger organization creation for existing user
SELECT create_user_organization() FROM profiles WHERE id = 'd9c01862-16fe-4009-a615-9c00c127c399';