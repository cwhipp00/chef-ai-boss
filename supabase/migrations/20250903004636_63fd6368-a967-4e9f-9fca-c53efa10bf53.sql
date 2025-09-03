-- First, drop the problematic policies
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;
DROP POLICY IF EXISTS "Owners can manage organization members" ON organization_members;

-- Create simple, non-recursive policies that don't reference organization_members table
CREATE POLICY "Users can view their own membership" 
ON organization_members FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own membership" 
ON organization_members FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Service can insert memberships" 
ON organization_members FOR INSERT 
WITH CHECK (true);

-- Fix dynamic_forms policies to be simpler and not use complex joins
DROP POLICY IF EXISTS "Users can view organization forms" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can create forms for their organization" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can update organization forms" ON dynamic_forms;
DROP POLICY IF EXISTS "Users can delete organization forms" ON dynamic_forms;

CREATE POLICY "Users can view organization forms" 
ON dynamic_forms FOR SELECT 
USING (created_by = auth.uid());

CREATE POLICY "Users can create their own forms" 
ON dynamic_forms FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own forms" 
ON dynamic_forms FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own forms" 
ON dynamic_forms FOR DELETE 
USING (created_by = auth.uid());