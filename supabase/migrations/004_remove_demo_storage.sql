-- Remove the old bundled/demo storage surface. Generated assets belong in the
-- private assets bucket and are addressed only by signed URLs.
DROP POLICY IF EXISTS "Demo: public read" ON storage.objects;
