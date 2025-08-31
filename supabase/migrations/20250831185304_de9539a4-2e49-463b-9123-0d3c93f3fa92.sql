-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create storage buckets for training content
INSERT INTO storage.buckets (id, name, public) VALUES ('training-content', 'training-content', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-assignments', 'user-assignments', false);

-- Storage policies for training content (public read)
CREATE POLICY "Training content is publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'training-content');

-- Storage policies for user assignments (private)
CREATE POLICY "Users can view their own assignments" ON storage.objects FOR SELECT USING (bucket_id = 'user-assignments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can upload their own assignments" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'user-assignments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own assignments" ON storage.objects FOR UPDATE USING (bucket_id = 'user-assignments' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own assignments" ON storage.objects FOR DELETE USING (bucket_id = 'user-assignments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create courses table for university structure
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor_name TEXT,
  difficulty_level TEXT CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  duration_hours INTEGER,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[],
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lessons table
CREATE TABLE public.lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB, -- Stores lesson content (videos, text, quizzes, etc.)
  order_index INTEGER NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user course enrollments
CREATE TABLE public.user_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_percent INTEGER DEFAULT 0,
  UNIQUE(user_id, course_id)
);

-- Create lesson progress tracking
CREATE TABLE public.lesson_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed_at TIMESTAMP WITH TIME ZONE,
  score INTEGER,
  time_spent_minutes INTEGER,
  UNIQUE(user_id, lesson_id)
);

-- Enable RLS on all tables
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Courses are viewable by everyone
CREATE POLICY "Courses are viewable by everyone" ON public.courses FOR SELECT USING (true);

-- Lessons are viewable by everyone
CREATE POLICY "Lessons are viewable by everyone" ON public.lessons FOR SELECT USING (true);

-- Users can view their own enrollments
CREATE POLICY "Users can view their own enrollments" ON public.user_enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own enrollments" ON public.user_enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own enrollments" ON public.user_enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Users can view and manage their own lesson progress
CREATE POLICY "Users can view their own progress" ON public.lesson_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own progress" ON public.lesson_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own progress" ON public.lesson_progress FOR UPDATE USING (auth.uid() = user_id);

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  RETURN new;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample courses data
INSERT INTO public.courses (title, description, instructor_name, difficulty_level, duration_hours, category, tags, is_featured) VALUES
('Culinary Fundamentals', 'Master the essential cooking techniques every chef should know', 'Chef Marcus Williams', 'beginner', 20, 'fundamentals', ARRAY['cooking basics', 'knife skills', 'techniques'], true),
('Advanced Pastry Arts', 'Create stunning desserts and pastries like a professional', 'Chef Isabella Rodriguez', 'advanced', 35, 'pastry', ARRAY['desserts', 'baking', 'decoration'], true),
('Wine Pairing Mastery', 'Learn the art of perfect wine and food combinations', 'Sommelier James Chen', 'intermediate', 15, 'beverages', ARRAY['wine', 'pairing', 'tasting'], false),
('Restaurant Management', 'Essential skills for running a successful kitchen operation', 'Chef David Thompson', 'intermediate', 25, 'management', ARRAY['leadership', 'operations', 'business'], true),
('International Cuisines', 'Explore authentic dishes from around the world', 'Chef Maria Gonzalez', 'intermediate', 40, 'international', ARRAY['cultural', 'techniques', 'flavors'], false),
('Food Safety & Hygiene', 'Critical food safety practices for professional kitchens', 'Dr. Sarah Johnson', 'beginner', 8, 'safety', ARRAY['hygiene', 'certification', 'standards'], true);