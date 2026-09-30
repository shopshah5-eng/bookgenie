-- ========================================================
-- Migration 008: Dedicated eBook Orders & Guest Purchases
-- ========================================================

-- 1. Allow guest purchases without a logged-in Supabase user_id
ALTER TABLE public.purchases ALTER COLUMN user_id DROP NOT NULL;

-- 2. Relax purchases plan_id check to include direct eBook products
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_plan_id_check;
ALTER TABLE public.purchases ADD CONSTRAINT purchases_plan_id_check 
  CHECK (plan_id IN ('free', 'book', 'book_plus', 'creator', 'blueprint', 'glow-up', 'starter-kit'));

-- 3. Dedicated eBook Orders Table for instant downloads & re-downloads
CREATE TABLE IF NOT EXISTS public.ebook_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code text UNIQUE NOT NULL,
  razorpay_order_id text UNIQUE NOT NULL,
  razorpay_payment_id text UNIQUE NOT NULL,
  slug text NOT NULL,
  book_title text NOT NULL,
  amount integer NOT NULL, -- in INR
  customer_email text,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_ebook_orders_code ON public.ebook_orders (order_code);
CREATE INDEX IF NOT EXISTS idx_ebook_orders_payment_id ON public.ebook_orders (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_ebook_orders_order_id ON public.ebook_orders (razorpay_order_id);

-- Enable RLS
ALTER TABLE public.ebook_orders ENABLE ROW LEVEL SECURITY;

-- Allow select for order verification
DROP POLICY IF EXISTS "ebook_orders_select_all" ON public.ebook_orders;
CREATE POLICY "ebook_orders_select_all" ON public.ebook_orders
  FOR SELECT USING (true);

-- Disallow anon direct modifications; service_role manages inserts
REVOKE INSERT, UPDATE, DELETE ON public.ebook_orders FROM anon, authenticated;
