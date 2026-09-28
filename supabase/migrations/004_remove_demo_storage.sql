-- Remove the old bundled/demo storage surface. Generated assets belong in the
-- private assets bucket and are addressed only by signed URLs.
DROP POLICY IF EXISTS "Demo: public read" ON storage.objects;
DELETE FROM storage.objects WHERE bucket_id = 'demo';
DELETE FROM storage.buckets WHERE id = 'demo';
