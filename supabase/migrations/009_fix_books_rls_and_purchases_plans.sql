-- ========================================================
-- Migration 009: Fix Books Row Level Security & Expand Purchase/Entitlement Plan Constraints
-- ========================================================

-- 1. Enable RLS on public.books
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 2. Clean up existing policies on public.books
DROP POLICY IF EXISTS "books_select" ON public.books;
DROP POLICY IF EXISTS "books_insert" ON public.books;
DROP POLICY IF EXISTS "books_update" ON public.books;
DROP POLICY IF EXISTS "books_delete" ON public.books;
DROP POLICY IF EXISTS "own books only" ON public.books;
DROP POLICY IF EXISTS "books_select_own" ON public.books;
DROP POLICY IF EXISTS "books_insert_own" ON public.books;
DROP POLICY IF EXISTS "books_update_own" ON public.books;
DROP POLICY IF EXISTS "books_delete_own" ON public.books;

-- 3. Strict RLS policies for authenticated users on public.books
CREATE POLICY "books_select_own" ON public.books
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "books_insert_own" ON public.books
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "books_update_own" ON public.books
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "books_delete_own" ON public.books
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- 4. Purchases table: expand constraint to cover all active plans and digital products
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS purchases_plan_id_check;
ALTER TABLE public.purchases ADD CONSTRAINT purchases_plan_id_check
  CHECK (plan_id in ('pro', 'creator', 'single', 'one_time', 'book', 'book_plus', 'blueprint', 'starter', 'glow-up'));

-- 5. Profiles table: allow all current tiers
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_tier_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_tier_check 
  CHECK (tier in ('free', 'single', 'one_time', 'book', 'book_plus', 'creator', 'pro'));

-- 6. Entitlements table: allow all current plans
ALTER TABLE public.entitlements DROP CONSTRAINT IF EXISTS entitlements_plan_id_check;
ALTER TABLE public.entitlements ADD CONSTRAINT entitlements_plan_id_check
  CHECK (plan_id in ('free', 'single', 'one_time', 'book', 'book_plus', 'creator', 'pro'));
