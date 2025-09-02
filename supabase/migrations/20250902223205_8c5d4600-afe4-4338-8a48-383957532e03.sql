-- Update user_usage table to track more premium features
ALTER TABLE public.user_usage ADD COLUMN calendar_events INTEGER DEFAULT 0;
ALTER TABLE public.user_usage ADD COLUMN document_uploads INTEGER DEFAULT 0;
ALTER TABLE public.user_usage ADD COLUMN video_call_minutes INTEGER DEFAULT 0;
ALTER TABLE public.user_usage ADD COLUMN forms_created INTEGER DEFAULT 0;
ALTER TABLE public.user_usage ADD COLUMN team_members INTEGER DEFAULT 0;

-- Create function to check feature usage limits
CREATE OR REPLACE FUNCTION public.check_usage_limit(
  p_user_id UUID,
  p_feature_type TEXT,
  p_limit INTEGER
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_usage INTEGER := 0;
  user_tier TEXT;
BEGIN
  -- Get user's subscription tier
  SELECT subscription_tier INTO user_tier
  FROM public.subscribers
  WHERE user_id = p_user_id;
  
  -- Premium users have unlimited access
  IF user_tier = 'premium' THEN
    RETURN TRUE;
  END IF;
  
  -- Get current usage for the feature
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
  
  -- Return true if under limit, false if at/over limit
  RETURN COALESCE(current_usage, 0) < p_limit;
END;
$$;

-- Create function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(
  p_user_id UUID,
  p_feature_type TEXT,
  p_amount INTEGER DEFAULT 1
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  success BOOLEAN := FALSE;
BEGIN
  -- Update usage based on feature type
  CASE p_feature_type
    WHEN 'ai_requests' THEN
      UPDATE public.user_usage 
      SET ai_requests = COALESCE(ai_requests, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'calendar_events' THEN
      UPDATE public.user_usage 
      SET calendar_events = COALESCE(calendar_events, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'document_uploads' THEN
      UPDATE public.user_usage 
      SET document_uploads = COALESCE(document_uploads, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'video_call_minutes' THEN
      UPDATE public.user_usage 
      SET video_call_minutes = COALESCE(video_call_minutes, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'forms_created' THEN
      UPDATE public.user_usage 
      SET forms_created = COALESCE(forms_created, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
    WHEN 'team_members' THEN
      UPDATE public.user_usage 
      SET team_members = COALESCE(team_members, 0) + p_amount,
          updated_at = NOW()
      WHERE user_id = p_user_id;
  END CASE;
  
  GET DIAGNOSTICS success = ROW_COUNT;
  RETURN success > 0;
END;
$$;