-- Create training_content table for organized course content
CREATE TABLE IF NOT EXISTS public.training_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('video', 'document', 'quiz', 'assignment', 'resource', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  file_url TEXT,
  file_type TEXT,
  file_size INTEGER,
  duration_seconds INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.training_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Training content is viewable by everyone"
ON public.training_content
FOR SELECT
USING (true);

CREATE POLICY "Instructors can create training content"
ON public.training_content
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Instructors can update training content"
ON public.training_content
FOR UPDATE
USING (auth.uid() IS NOT NULL);

-- Create documents table for file management
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('forms', 'training', 'policies', 'certificates', 'menus', 'invoices', 'reports', 'images', 'other')),
  tags TEXT[] DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create policies for documents
CREATE POLICY "Users can view their own documents"
ON public.documents
FOR SELECT
USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create their own documents"
ON public.documents
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents"
ON public.documents
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents"
ON public.documents
FOR DELETE
USING (auth.uid() = user_id);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_training_content_course_id ON public.training_content(course_id);
CREATE INDEX IF NOT EXISTS idx_training_content_lesson_id ON public.training_content(lesson_id);
CREATE INDEX IF NOT EXISTS idx_training_content_type ON public.training_content(content_type);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_category ON public.documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_tags ON public.documents USING gin(tags);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_training_content_updated_at
  BEFORE UPDATE ON public.training_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();