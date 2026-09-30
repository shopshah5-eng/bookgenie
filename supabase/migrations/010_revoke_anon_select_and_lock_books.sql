-- ========================================================
-- Migration 010: Lock down public.books with strict RLS & revoke anon select
-- ========================================================

-- 1. Revoke any anonymous read/write permissions
REVOKE ALL ON public.books FROM anon;

-- 2. Force and enable RLS
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books FORCE ROW LEVEL SECURITY;

-- 3. Drop every existing policy on public.books dynamically
DO $$
DECLARE
    pol record;
BEGIN
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'books' AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.books', pol.policyname);
    END LOOP;
END $$;

-- 4. Create single authoritative set of RLS policies for authenticated users
CREATE POLICY "books_select_authenticated" ON public.books
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "books_insert_authenticated" ON public.books
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "books_update_authenticated" ON public.books
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "books_delete_authenticated" ON public.books
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
