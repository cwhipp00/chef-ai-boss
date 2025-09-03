-- Update subscription_tier enum to include new tiers
ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'basic';
ALTER TYPE subscription_tier ADD VALUE IF NOT EXISTS 'premium';

-- Update subscribers table to include Stripe customer ID
ALTER TABLE public.subscribers 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_customer_id ON public.subscribers(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_stripe_subscription_id ON public.subscribers(stripe_subscription_id);