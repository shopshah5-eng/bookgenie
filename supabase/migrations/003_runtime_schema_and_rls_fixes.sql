-- Runtime compatibility and security fixes.
-- Migration 001 predates fields used by the current API and allowed any
-- anonymous/authenticated reader to enumerate every shared book.

ALTER TABLE public.books ADD COLUMN IF NOT EXISTS cover_url text;
ALTER TABLE public.books ADD COLUMN IF NOT EXISTS cover_image_url text;

-- Public sharing is implemented by the server API using an opaque share_token.
-- Do not expose all shared rows through the normal authenticated client query.
DROP POLICY IF EXISTS "books_select" ON public.books;
CREATE POLICY "books_select" ON public.books
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "assets_select" ON public.assets;
CREATE POLICY "assets_select" ON public.assets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.books
      WHERE books.id = assets.book_id AND books.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "book_pages_select" ON public.book_pages;
CREATE POLICY "book_pages_select" ON public.book_pages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.books
      WHERE books.id = book_pages.book_id AND books.user_id = auth.uid()
    )
  );

-- The contact and affiliate forms are written only by the server-role client.
-- RLS is enabled without public insert policies so an exposed anon key cannot
-- write arbitrary rows directly.
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  category text DEFAULT 'support',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.affiliate_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text NOT NULL,
  website text NOT NULL,
  audience_size text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

-- These tables are intentionally not granted to anon/authenticated. The
-- service-role server client bypasses RLS for inserts.
REVOKE ALL ON public.contact_submissions FROM anon, authenticated;
REVOKE ALL ON public.affiliate_applications FROM anon, authenticated;
