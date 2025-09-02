-- Fix the search path security issue
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;