-- Security Enhancement 1: Update Auth Settings to Reduce OTP Expiry
-- Note: This reduces OTP token expiry time for better security
UPDATE auth.config SET
  jwt_exp = 3600,  -- 1 hour instead of default longer period
  password_min_length = 8,
  password_requires_uppercase = true,
  password_requires_lowercase = true,
  password_requires_numbers = true,
  password_requires_special = true
WHERE true;

-- Security Enhancement 2: Enable additional auth security settings
-- These help prevent leaked password usage and improve security
INSERT INTO auth.config (key, value) VALUES 
  ('password_hibp_enabled', 'true'),  -- Enable leaked password protection
  ('password_strength_required', 'true'),  -- Require strong passwords
  ('enable_phone_autoconfirm', 'false'),  -- Disable auto phone confirmation
  ('enable_email_autoconfirm', 'false')   -- Disable auto email confirmation
ON CONFLICT (key) DO UPDATE SET 
  value = EXCLUDED.value;