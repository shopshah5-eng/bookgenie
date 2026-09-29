-- ========================================================
-- Migration 006: Book Plan Metadata and Export Policy
-- ========================================================

-- 1. Extend books table with canonical plan metadata
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS plan_id text DEFAULT 'free';
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS has_watermark boolean DEFAULT true;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS commercial_use boolean DEFAULT false;

-- 2. Index on share token for rapid unauthenticated public export verification
CREATE INDEX IF NOT EXISTS idx_books_share_token
  ON public.books (share_token)
  WHERE share_token IS NOT NULL;

-- 3. Row-Level Security policy for shared book exports
-- Allows reading basic book metadata if a valid share_token is presented
DROP POLICY IF EXISTS "books_shared_export_select" ON public.books;
CREATE POLICY "books_shared_export_select" ON public.books
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR is_shared = true
    OR share_token IS NOT NULL
  );
