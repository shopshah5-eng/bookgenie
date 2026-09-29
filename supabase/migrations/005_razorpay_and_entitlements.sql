-- ========================================================
-- Migration 005: Razorpay Purchases, Subscriptions, Entitlements,
--                Idempotency, and Distributed Atomic Leases
-- ========================================================

-- 1. Update profiles table to support canonical tiers
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_tier_check 
  CHECK (tier in ('free', 'book', 'book_plus', 'creator', 'pro'));

-- 2. Extend books table with canonical plan metadata
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS plan_id text DEFAULT 'free';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS has_watermark boolean DEFAULT true;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS commercial_use boolean DEFAULT false;

-- 3. Purchases table (One-time Book / Book Plus orders and captured payments)
CREATE TABLE IF NOT EXISTS public.purchases (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id text NOT NULL CHECK (plan_id in ('book', 'book_plus', 'creator')),
  razorpay_order_id text UNIQUE NOT NULL,
  razorpay_payment_id text UNIQUE,
  razorpay_signature text,
  amount integer NOT NULL, -- in paise (e.g. 19900 = ₹199)
  currency text DEFAULT 'INR',
  status text DEFAULT 'created' CHECK (status in ('created', 'captured', 'failed', 'refunded')),
  notes jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_purchases_updated_at ON public.purchases;
CREATE TRIGGER tr_purchases_updated_at
  BEFORE UPDATE ON public.purchases
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 4. Subscriptions table (Creator monthly plan)
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id text DEFAULT 'creator' CHECK (plan_id in ('creator')),
  razorpay_subscription_id text UNIQUE NOT NULL,
  razorpay_customer_id text,
  status text DEFAULT 'active' CHECK (status in ('active', 'paused', 'cancelled', 'completed', 'past_due')),
  current_period_start timestamptz DEFAULT now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

DROP TRIGGER IF EXISTS tr_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 5. Entitlements table (Explicit book generation credits)
CREATE TABLE IF NOT EXISTS public.entitlements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  plan_id text NOT NULL CHECK (plan_id in ('free', 'book', 'book_plus', 'creator')),
  source_purchase_id uuid REFERENCES public.purchases(id) ON DELETE SET NULL,
  source_subscription_id uuid REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  max_pages integer NOT NULL,
  allowed_formats text[] DEFAULT ARRAY['pdf'],
  has_watermark boolean DEFAULT false,
  commercial_rights boolean DEFAULT true,
  can_regenerate boolean DEFAULT false,
  books_remaining integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);

-- 6. Razorpay Webhook Events Idempotency Table
CREATE TABLE IF NOT EXISTS public.razorpay_events (
  event_id text PRIMARY KEY,
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  processed_at timestamptz DEFAULT now()
);

-- 7. Distributed Atomic Job Claim / Lease Function
CREATE OR REPLACE FUNCTION public.claim_generation_job(
  p_job_id uuid,
  p_worker_id text,
  p_lease_seconds integer DEFAULT 180
)
RETURNS boolean AS $$
DECLARE
  v_claimed boolean := false;
BEGIN
  UPDATE public.jobs
  SET 
    claimed_at = now(),
    started_at = COALESCE(started_at, now()),
    attempt_count = attempt_count + 1,
    status = 'processing'
  WHERE id = p_job_id
    AND (
      status = 'queued'
      OR (status = 'processing' AND claimed_at < now() - (p_lease_seconds || ' seconds')::interval)
    );
  
  IF FOUND THEN
    v_claimed := true;
  END IF;
  
  RETURN v_claimed;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Row-Level Security (RLS)
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.razorpay_events ENABLE ROW LEVEL SECURITY;

-- Purchases RLS: Authenticated users can view their own purchases
DROP POLICY IF EXISTS "purchases_select_own" ON public.purchases;
CREATE POLICY "purchases_select_own" ON public.purchases
  FOR SELECT USING (auth.uid() = user_id);

-- Subscriptions RLS: Authenticated users can view their own subscriptions
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Entitlements RLS: Authenticated users can view their own credits
DROP POLICY IF EXISTS "entitlements_select_own" ON public.entitlements;
CREATE POLICY "entitlements_select_own" ON public.entitlements
  FOR SELECT USING (auth.uid() = user_id);

-- Disallow direct inserts/updates/deletes by authenticated/anon clients on payment records
REVOKE INSERT, UPDATE, DELETE ON public.purchases FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.subscriptions FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.entitlements FROM anon, authenticated;
REVOKE ALL ON public.razorpay_events FROM anon, authenticated;
