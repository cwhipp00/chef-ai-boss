-- Create missing user data more carefully
-- Insert subscriber record if missing
INSERT INTO subscribers (user_id, email, subscription_tier)
SELECT 
    u.id,
    u.email,
    'free'::subscription_tier
FROM auth.users u
WHERE u.id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM subscribers s WHERE s.user_id = u.id);

-- Insert user usage record if missing
INSERT INTO user_usage (user_id)
SELECT u.id
FROM auth.users u
WHERE u.id IS NOT NULL
AND NOT EXISTS (SELECT 1 FROM user_usage uu WHERE uu.user_id = u.id);

-- Ensure users have organization membership
-- First, get or create organization for users without membership
WITH user_orgs AS (
    SELECT 
        u.id as user_id,
        u.email,
        COALESCE(p.company_name, 'My Restaurant') as org_name,
        LOWER(REPLACE(COALESCE(p.company_name, 'My Restaurant'), ' ', '-')) || '-' || SUBSTRING(u.id::text, 1, 8) as unique_domain
    FROM auth.users u
    LEFT JOIN profiles p ON p.id = u.id
    WHERE NOT EXISTS (SELECT 1 FROM organization_members om WHERE om.user_id = u.id)
),
created_orgs AS (
    INSERT INTO organizations (id, name, domain)
    SELECT 
        gen_random_uuid(),
        org_name,
        unique_domain
    FROM user_orgs
    RETURNING id, domain
)
INSERT INTO organization_members (organization_id, user_id, role)
SELECT 
    co.id,
    uo.user_id,
    'owner'
FROM user_orgs uo
JOIN created_orgs co ON co.domain = uo.unique_domain;