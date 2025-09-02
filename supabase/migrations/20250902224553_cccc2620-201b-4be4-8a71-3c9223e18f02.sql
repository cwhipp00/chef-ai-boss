-- Add company_name to profiles table
ALTER TABLE profiles ADD COLUMN company_name TEXT;

-- Create index for company_name lookups
CREATE INDEX idx_profiles_company_name ON profiles(company_name);

-- Update RLS policies to ensure users can only see/update their own company name
-- The existing policies already cover this, so no changes needed