-- BookGenie Security Migration 002: Revoke anonymous writes
-- The original draft referenced legacy table names (book_assets,
-- generation_jobs, source_uploads) that do not exist in migration 001.
-- Keep this migration aligned with the actual schema.

REVOKE INSERT, UPDATE, DELETE ON public.books FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.assets FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.book_pages FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.book_versions FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.jobs FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.uploads FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.generation_usage FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.usage_records FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.profiles FROM anon;

-- Application writes are performed by the authenticated server boundary or by
-- the server-role worker. RLS still applies to normal authenticated clients.
GRANT SELECT, INSERT, UPDATE, DELETE ON public.books TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.assets TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_pages TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.book_versions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.uploads TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.generation_usage TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.usage_records TO authenticated;
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
