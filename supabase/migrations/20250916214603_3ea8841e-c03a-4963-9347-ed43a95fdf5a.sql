-- Create vendors table for supplier management
CREATE TABLE public.vendors (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  name text NOT NULL,
  category text NOT NULL,
  email text,
  phone text,
  address text,
  rating numeric(2,1) DEFAULT 5.0,
  is_active boolean DEFAULT true,
  payment_terms text,
  delivery_schedule text,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for vendors
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create orders table for purchase orders
CREATE TABLE public.orders (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  vendor_id uuid NOT NULL REFERENCES public.vendors(id),
  order_number text NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  order_date timestamp with time zone NOT NULL DEFAULT now(),
  expected_delivery timestamp with time zone,
  actual_delivery timestamp with time zone,
  order_type text NOT NULL DEFAULT 'standard',
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create reservations table for table bookings
CREATE TABLE public.reservations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_email text,
  customer_phone text,
  party_size integer NOT NULL DEFAULT 1,
  reservation_date date NOT NULL,
  reservation_time time NOT NULL,
  table_number integer,
  status text NOT NULL DEFAULT 'pending',
  special_requests text,
  notes text,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for reservations
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- Create automation_rules table for workflow automation
CREATE TABLE public.automation_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  category text NOT NULL,
  trigger_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  action_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  is_active boolean DEFAULT false,
  execution_count integer DEFAULT 0,
  last_execution timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for automation_rules
ALTER TABLE public.automation_rules ENABLE ROW LEVEL SECURITY;

-- Create automation_logs table for execution tracking
CREATE TABLE public.automation_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id uuid NOT NULL REFERENCES public.automation_rules(id) ON DELETE CASCADE,
  execution_status text NOT NULL DEFAULT 'running',
  execution_result jsonb,
  error_message text,
  execution_time integer, -- in milliseconds
  triggered_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS for automation_logs
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for vendors
CREATE POLICY "Users can view organization vendors" 
ON public.vendors 
FOR SELECT 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

CREATE POLICY "Users can create vendors for their organization" 
ON public.vendors 
FOR INSERT 
WITH CHECK (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

CREATE POLICY "Users can update organization vendors" 
ON public.vendors 
FOR UPDATE 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

-- Create RLS policies for orders
CREATE POLICY "Users can view organization orders" 
ON public.orders 
FOR SELECT 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

CREATE POLICY "Users can create orders for their organization" 
ON public.orders 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
  ) AND created_by = auth.uid()
);

CREATE POLICY "Users can update organization orders" 
ON public.orders 
FOR UPDATE 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

-- Create RLS policies for reservations
CREATE POLICY "Users can view organization reservations" 
ON public.reservations 
FOR SELECT 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

CREATE POLICY "Users can create reservations for their organization" 
ON public.reservations 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
  ) AND created_by = auth.uid()
);

CREATE POLICY "Users can update organization reservations" 
ON public.reservations 
FOR UPDATE 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

-- Create RLS policies for automation_rules
CREATE POLICY "Users can view organization automation rules" 
ON public.automation_rules 
FOR SELECT 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

CREATE POLICY "Users can create automation rules for their organization" 
ON public.automation_rules 
FOR INSERT 
WITH CHECK (
  organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
  ) AND created_by = auth.uid()
);

CREATE POLICY "Users can update organization automation rules" 
ON public.automation_rules 
FOR UPDATE 
USING (organization_id IN (
  SELECT organization_members.organization_id
  FROM organization_members
  WHERE organization_members.user_id = auth.uid()
));

-- Create RLS policies for automation_logs
CREATE POLICY "Users can view automation logs for their organization" 
ON public.automation_logs 
FOR SELECT 
USING (rule_id IN (
  SELECT automation_rules.id
  FROM automation_rules
  WHERE automation_rules.organization_id IN (
    SELECT organization_members.organization_id
    FROM organization_members
    WHERE organization_members.user_id = auth.uid()
  )
));

-- Create updated_at triggers for all tables
CREATE TRIGGER update_vendors_updated_at
BEFORE UPDATE ON public.vendors
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at
BEFORE UPDATE ON public.reservations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_automation_rules_updated_at
BEFORE UPDATE ON public.automation_rules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();