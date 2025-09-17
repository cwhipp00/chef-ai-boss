-- Enable RLS on staff_reservations table
ALTER TABLE public.staff_reservations ENABLE ROW LEVEL SECURITY;

-- Policy for managers and owners to have full access to reservations
CREATE POLICY "Managers can view all reservations" 
ON public.staff_reservations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid() 
    AND organization_members.role IN ('owner', 'manager')
  )
);

CREATE POLICY "Managers can insert reservations" 
ON public.staff_reservations 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid() 
    AND organization_members.role IN ('owner', 'manager')
  )
  AND created_by = auth.uid()
);

CREATE POLICY "Managers can update reservations" 
ON public.staff_reservations 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid() 
    AND organization_members.role IN ('owner', 'manager')
  )
);

-- Policy for staff members to have limited access (view only, no sensitive customer data)
CREATE POLICY "Staff can view basic reservation info" 
ON public.staff_reservations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid() 
    AND organization_members.role = 'member'
  )
);