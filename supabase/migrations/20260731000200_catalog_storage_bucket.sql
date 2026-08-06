-- Storage bucket for admin-uploaded catalog/portfolio/testimonial images.
-- Public read; writes restricted to the service role (used only by server-side
-- admin API routes, never the anon key shipped to the browser).

INSERT INTO storage.buckets (id, name, public)
VALUES ('catalog-images', 'catalog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read catalog images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'catalog-images');

CREATE POLICY "Service role write catalog images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'catalog-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role update catalog images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'catalog-images' AND auth.role() = 'service_role');

CREATE POLICY "Service role delete catalog images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'catalog-images' AND auth.role() = 'service_role');
