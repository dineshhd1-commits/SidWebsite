-- Storage bucket for the site's own static marketing/portfolio assets that
-- used to be served exclusively from web/public (gallery photos, hero
-- images, etc). Public read (these are the same images the public site
-- already serves to every visitor, no PII); writes restricted to the
-- service role via the upload script (scripts/upload-site-assets.mjs),
-- never the anon key shipped to the browser. Mirrors the existing
-- catalog-images bucket policy shape from
-- supabase/migrations/20260731000200_catalog_storage_bucket.sql.

INSERT INTO storage.buckets (id, name, public)
VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site assets"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site-assets');

CREATE POLICY "Service role write site assets"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role update site assets"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'site-assets' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete site assets"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'site-assets' AND auth.role() = 'service_role');
