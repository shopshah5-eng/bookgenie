-- ========================================================
-- BookGenie Security Migration 002: Revoke Anon Write Privileges
-- Ensures anonymous role has zero table-level write permissions.
-- All writes must originate from authenticated sessions governed by RLS.
-- ========================================================

-- 1. Revoke write operations from anon
REVOKE INSERT, UPDATE, DELETE ON public.books FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.book_pages FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.book_versions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.book_assets FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.generation_jobs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.source_uploads FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.usage_records FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;

-- 2. Confirm authenticated role privileges
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generation_jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.source_uploads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_records TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
