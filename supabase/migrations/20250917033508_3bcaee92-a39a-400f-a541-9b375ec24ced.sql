-- Remove the problematic policy that allows viewing all profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a new policy that allows users to view profiles within their organization
CREATE POLICY "Users can view organization member profiles" 
ON public.profiles 
FOR SELECT 
USING (
  id = auth.uid() OR 
  id IN (
    SELECT om2.user_id 
    FROM organization_members om1
    JOIN organization_members om2 ON om1.organization_id = om2.organization_id
    WHERE om1.user_id = auth.uid()
  )
);