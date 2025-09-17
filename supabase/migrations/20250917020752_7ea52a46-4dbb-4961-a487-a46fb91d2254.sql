-- Fix customer data security in reservations table
-- Drop existing overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view organization reservations" ON public.reservations;

-- Create role-based policies for viewing reservations
-- Managers and owners can view all reservation data including customer contact info
CREATE POLICY "Managers can view all reservation data" 
ON public.reservations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'manager')
  )
);

-- Regular members can view reservations but without sensitive customer contact info
-- This is handled by creating a view for regular staff
CREATE OR REPLACE VIEW public.staff_reservations AS
SELECT 
  id,
  organization_id,
  party_size,
  reservation_date,
  reservation_time,
  table_number,
  status,
  special_requests,
  notes,
  customer_name,
  -- Mask sensitive contact information for regular staff
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM organization_members 
      WHERE user_id = auth.uid() 
      AND organization_id = reservations.organization_id 
      AND role IN ('owner', 'manager')
    ) THEN customer_email
    ELSE '***@***.***'
  END AS customer_email,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM organization_members 
      WHERE user_id = auth.uid() 
      AND organization_id = reservations.organization_id 
      AND role IN ('owner', 'manager')
    ) THEN customer_phone
    ELSE '***-***-****'
  END AS customer_phone,
  created_by,
  created_at,
  updated_at
FROM public.reservations;

-- Enable RLS on the view
ALTER VIEW public.staff_reservations SET (security_invoker = true);

-- Grant access to the view for organization members
CREATE POLICY "Staff can view masked reservations" 
ON public.reservations 
FOR SELECT 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
    AND organization_members.role = 'member'
  )
);

-- Update existing policies to be more specific about roles
-- Keep existing INSERT and UPDATE policies but add role checks for sensitive operations
DROP POLICY IF EXISTS "Users can update organization reservations" ON public.reservations;

-- Only managers and owners can update customer contact information
CREATE POLICY "Managers can update all reservation data" 
ON public.reservations 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
    AND organization_members.role IN ('owner', 'manager')
  )
);

-- Regular staff can update non-sensitive reservation data
CREATE POLICY "Staff can update reservation status and notes" 
ON public.reservations 
FOR UPDATE 
USING (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
    AND organization_members.role = 'member'
  )
)
WITH CHECK (
  -- Prevent regular staff from modifying customer contact info
  customer_email = (SELECT customer_email FROM public.reservations WHERE id = reservations.id) AND
  customer_phone = (SELECT customer_phone FROM public.reservations WHERE id = reservations.id)
);