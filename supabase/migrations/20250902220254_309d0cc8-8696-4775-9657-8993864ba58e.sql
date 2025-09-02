-- Create organizations table for multi-tenancy
CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT UNIQUE,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create organization members table
CREATE TABLE public.organization_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(organization_id, user_id)
);

-- Create document templates table
CREATE TABLE public.document_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'checklist', 'recipe', 'inventory', 'training', etc.
  template_fields JSONB NOT NULL DEFAULT '[]',
  ai_extraction_prompt TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create parsed documents table
CREATE TABLE public.parsed_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  original_document_id UUID REFERENCES public.documents(id),
  template_id UUID REFERENCES public.document_templates(id),
  parsed_data JSONB NOT NULL DEFAULT '{}',
  confidence_score DECIMAL(3,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  target_category TEXT NOT NULL, -- which tab/section this belongs to
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dynamic forms table
CREATE TABLE public.dynamic_forms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  form_schema JSONB NOT NULL, -- JSON schema for the form
  generated_from_document UUID REFERENCES public.parsed_documents(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create form submissions table
CREATE TABLE public.form_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES public.dynamic_forms(id) ON DELETE CASCADE,
  submitted_data JSONB NOT NULL,
  submitted_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parsed_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Organizations
CREATE POLICY "Users can view organizations they belong to" ON public.organizations
  FOR SELECT USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Organization owners can update their organization" ON public.organizations
  FOR UPDATE USING (
    id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role = 'owner'
    )
  );

-- RLS Policies for Organization Members
CREATE POLICY "Users can view organization members" ON public.organization_members
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage organization members" ON public.organization_members
  FOR ALL USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- RLS Policies for Document Templates
CREATE POLICY "Users can view organization templates" ON public.document_templates
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create templates for their organization" ON public.document_templates
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    ) AND created_by = auth.uid()
  );

-- RLS Policies for Parsed Documents
CREATE POLICY "Users can view organization parsed documents" ON public.parsed_documents
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create parsed documents for their organization" ON public.parsed_documents
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    ) AND created_by = auth.uid()
  );

-- RLS Policies for Dynamic Forms
CREATE POLICY "Users can view organization forms" ON public.dynamic_forms
  FOR SELECT USING (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create forms for their organization" ON public.dynamic_forms
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT organization_id FROM public.organization_members 
      WHERE user_id = auth.uid()
    ) AND created_by = auth.uid()
  );

-- RLS Policies for Form Submissions
CREATE POLICY "Users can view organization form submissions" ON public.form_submissions
  FOR SELECT USING (
    form_id IN (
      SELECT id FROM public.dynamic_forms df
      WHERE df.organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can submit forms" ON public.form_submissions
  FOR INSERT WITH CHECK (
    form_id IN (
      SELECT id FROM public.dynamic_forms df
      WHERE df.organization_id IN (
        SELECT organization_id FROM public.organization_members 
        WHERE user_id = auth.uid()
      )
    ) AND submitted_by = auth.uid()
  );

-- Create triggers for updated_at
CREATE TRIGGER update_organizations_updated_at
  BEFORE UPDATE ON public.organizations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_document_templates_updated_at
  BEFORE UPDATE ON public.document_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_parsed_documents_updated_at
  BEFORE UPDATE ON public.parsed_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_dynamic_forms_updated_at
  BEFORE UPDATE ON public.dynamic_forms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for real-time collaboration
ALTER PUBLICATION supabase_realtime ADD TABLE public.parsed_documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.form_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.organization_members;