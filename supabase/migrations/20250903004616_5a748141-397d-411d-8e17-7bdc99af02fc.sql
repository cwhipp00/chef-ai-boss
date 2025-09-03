-- Drop the self-referencing policies completely
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Owners can manage organization members" ON organization_members;

-- Create simple, non-recursive policies
-- Users can only see their own membership record
CREATE POLICY "Users can view their own membership" 
ON organization_members FOR SELECT 
USING (user_id = auth.uid());

-- Users can only modify their own membership record (for updates)
CREATE POLICY "Users can update their own membership" 
ON organization_members FOR UPDATE 
USING (user_id = auth.uid());

-- Allow service role to insert organization memberships (for registration)
CREATE POLICY "Service can insert memberships" 
ON organization_members FOR INSERT 
WITH CHECK (true);

-- Now update the dynamic_forms policies to use a simpler approach
DROP POLICY IF EXISTS "Users can view organization forms" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can create forms for their organization" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can update organization forms" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can delete organization forms" ON dynamic_forms;

-- Create simpler dynamic_forms policies using the security definer function
CREATE POLICY "Users can view organization forms" 
ON dynamic_forms FOR SELECT 
USING (organization_id IN (SELECT organization_id FROM public.get_user_organizations()));

CREATE POLICY "Users can create forms for their organization" 
ON dynamic_forms FOR INSERT 
WITH CHECK (organization_id IN (SELECT organization_id FROM public.get_user_organizations()) AND created_by = auth.uid());

CREATE POLICY "Users can update organization forms" 
ON dynamic_forms FOR UPDATE 
USING (organization_id IN (SELECT organization_id FROM public.get_user_organizations()));

CREATE POLICY "Users can delete organization forms" 
ON dynamic_forms FOR DELETE 
USING (organization_id IN (SELECT organization_id FROM public.get_user_organizations()) AND created_by = auth.uid());