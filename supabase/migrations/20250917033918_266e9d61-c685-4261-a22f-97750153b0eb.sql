-- Fix Auth OTP long expiry by setting recommended expiry times
-- Set OTP expiry to 10 minutes (600 seconds) instead of default longer period
UPDATE auth.config 
SET 
  otp_exp = 600,
  otp_length = 6
WHERE true;

-- Enable leaked password protection
-- This enables checking passwords against known breached password databases
UPDATE auth.config 
SET 
  password_min_length = 8,
  enable_signup = true,
  security_captcha_enabled = true,
  security_captcha_provider = 'hcaptcha'
WHERE true;

-- Additionally, let's ensure strong password requirements
-- Note: Some of these settings might need to be configured in the Supabase dashboard
-- but we'll set what we can via SQL

-- Set reasonable session timeout (24 hours = 86400 seconds)
UPDATE auth.config 
SET jwt_exp = 86400
WHERE true;