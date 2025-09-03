-- Fix the infinite recursion issue completely
-- Drop the problematic policies again
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Owners can manage organization members" ON organization_members;

-- Create a security definer function to avoid self-reference
CREATE OR REPLACE FUNCTION public.get_user_organizations()
RETURNS TABLE(organization_id UUID) 
LANGUAGE SQL 
SECURITY DEFINER 
STABLE
SET search_path = public
AS $$
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = auth.uid();
$$;

-- Create simple, non-recursive policies
CREATE POLICY "Users can view organization members" 
ON organization_members FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Owners can manage organization members" 
ON organization_members FOR ALL 
USING (user_id = auth.uid() OR organization_id IN (SELECT organization_id FROM public.get_user_organizations()));

-- Fix missing data issues - ensure user has required records
-- First check if user has subscriber record, if not create one
INSERT INTO subscribers (user_id, email, subscription_tier)
SELECT auth.uid(), 
       (SELECT email FROM auth.users WHERE id = auth.uid()),
       'free'::subscription_tier
WHERE auth.uid() IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM subscribers WHERE user_id = auth.uid());

-- Ensure user has usage tracking record
INSERT INTO user_usage (user_id)
SELECT auth.uid()
WHERE auth.uid() IS NOT NULL 
AND NOT EXISTS (SELECT 1 FROM user_usage WHERE user_id = auth.uid());

-- Ensure user has an organization membership
DO $$
DECLARE
    user_org_id UUID;
    user_email TEXT;
BEGIN
    -- Get user email
    SELECT email INTO user_email FROM auth.users WHERE id = auth.uid();
    
    -- Check if user has organization membership
    IF NOT EXISTS (SELECT 1 FROM organization_members WHERE user_id = auth.uid()) THEN
        -- Create organization if user doesn't have one
        INSERT INTO organizations (id, name, domain)
        VALUES (gen_random_uuid(), 'My Restaurant', 'my-restaurant')
        RETURNING id INTO user_org_id;
        
        -- Add user as owner
        INSERT INTO organization_members (organization_id, user_id, role)
        VALUES (user_org_id, auth.uid(), 'owner');
    END IF;
END $$;