-- Fix profiles table security - restrict access to profile owners only
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create secure policy: users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

-- Keep existing policies for updates and inserts
-- Users can update their own profile (should already exist)
-- Users can insert their own profile (should already exist)