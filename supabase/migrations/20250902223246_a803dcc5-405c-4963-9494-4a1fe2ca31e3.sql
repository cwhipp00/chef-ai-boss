-- Create subscription tiers enum
CREATE TYPE public.subscription_tier AS ENUM ('free', 'premium');

-- Create subscribers table
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  email TEXT NOT NULL UNIQUE,
  subscription_tier subscription_tier NOT NULL DEFAULT 'free',
  subscription_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_usage table with all premium feature tracking
CREATE TABLE public.user_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  ai_requests INTEGER DEFAULT 0,
  calendar_events INTEGER DEFAULT 0,
  document_uploads INTEGER DEFAULT 0,
  video_call_minutes INTEGER DEFAULT 0,
  forms_created INTEGER DEFAULT 0,
  team_members INTEGER DEFAULT 0,
  reset_date TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_usage ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscribers
CREATE POLICY "Users can view their own subscription" 
ON public.subscribers FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" 
ON public.subscribers FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Service can insert subscriptions" 
ON public.subscribers FOR INSERT 
WITH CHECK (true);

-- RLS policies for user_usage
CREATE POLICY "Users can view their own usage" 
ON public.user_usage FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own usage" 
ON public.user_usage FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Service can insert usage" 
ON public.user_usage FOR INSERT 
WITH CHECK (true);

-- Function to initialize free trial for new users
CREATE OR REPLACE FUNCTION public.initialize_free_trial()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create subscriber record
  INSERT INTO public.subscribers (user_id, email, subscription_tier)
  VALUES (NEW.id, NEW.email, 'free');
  
  -- Create usage tracking record
  INSERT INTO public.user_usage (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$;

-- Trigger to initialize trial on user signup
CREATE TRIGGER on_auth_user_created_trial
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_free_trial();

-- Function to check usage limits (free limits)
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_feature_type TEXT,
  p_limit INTEGER DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage INTEGER := 0;
  user_tier subscription_tier;
  free_limit INTEGER;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.subscribers
  WHERE user_id = p_user_id;
  
  -- Premium users have unlimited access
  IF user_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- Set free limits if not provided
  IF p_limit IS NULL THEN
    CASE p_feature_type
      WHEN 'ai_requests' THEN free_limit := 10;        -- 10 AI requests per month
      WHEN 'calendar_events' THEN free_limit := 25;    -- 25 calendar events per month
      WHEN 'document_uploads' THEN free_limit := 10;   -- 10 document uploads per month
      WHEN 'video_call_minutes' THEN free_limit := 60; -- 60 minutes per month
      WHEN 'forms_created' THEN free_limit := 3;       -- 3 forms per month
      WHEN 'team_members' THEN free_limit := 2;        -- 2 team members max
      ELSE free_limit := 0;
    END CASE;
  ELSE
    free_limit := p_limit;
  END IF;
  
  -- Get current usage
  CASE p_feature_type
    WHEN 'ai_requests' THEN
      SELECT ai_requests INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
    WHEN 'calendar_events' THEN
      SELECT calendar_events INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
    WHEN 'document_uploads' THEN
      SELECT document_uploads INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
    WHEN 'video_call_minutes' THEN
      SELECT video_call_minutes INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
    WHEN 'forms_created' THEN
      SELECT forms_created INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
    WHEN 'team_members' THEN
      SELECT team_members INTO current_usage FROM public.user_usage WHERE user_id = p_user_id;
  END CASE;
  
  -- Return true if under limit
  RETURN COALESCE(current_usage, 0) < free_limit;
END;
$$;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_amount INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  CASE p_feature_type
    WHEN 'ai_requests' THEN
      UPDATE public.user_usage 
      SET ai_requests = COALESCE(ai_requests, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'calendar_events' THEN
      UPDATE public.user_usage 
      SET calendar_events = COALESCE(calendar_events, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'document_uploads' THEN
      UPDATE public.user_usage 
      SET document_uploads = COALESCE(document_uploads, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'video_call_minutes' THEN
      UPDATE public.user_usage 
      SET video_call_minutes = COALESCE(video_call_minutes, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'forms_created' THEN
      UPDATE public.user_usage 
      SET forms_created = COALESCE(forms_created, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'team_members' THEN
      UPDATE public.user_usage 
      SET team_members = COALESCE(team_members, 0) + p_amount, updated_at = NOW()
      WHERE user_id = p_user_id;
  END CASE;
  
  RETURN FOUND;
END;
$$;