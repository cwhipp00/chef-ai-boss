-- Fix infinite recursion in organization_members RLS policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can manage organization members" ON organization_members;
DROP POLICY IF EXISTS "Users can view organization members" ON organization_members;

-- Create new policies that don't self-reference
CREATE POLICY "Users can view organization members" 
ON organization_members FOR SELECT 
USING (user_id = auth.uid() OR organization_id IN (
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = auth.uid()
));

CREATE POLICY "Owners can manage organization members" 
ON organization_members FOR ALL 
USING (organization_id IN (
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = auth.uid() AND om.role = 'owner'
));

-- Add missing column for AI-generated forms
ALTER TABLE dynamic_forms 
ADD COLUMN IF NOT EXISTS ai_generated BOOLEAN DEFAULT false;

-- Update dynamic_forms RLS policies to allow updates and deletes
CREATE POLICY "Users can update organization forms" 
ON dynamic_forms FOR UPDATE 
USING (organization_id IN (
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = auth.uid()
));

CREATE POLICY "Users can delete organization forms" 
ON dynamic_forms FOR DELETE 
USING (organization_id IN (
  SELECT om.organization_id 
  FROM organization_members om 
  WHERE om.user_id = auth.uid()
) AND created_by = auth.uid());