const SITE_ASSETS_BUCKET = 'site-assets';

/** Maps a local /public path (e.g. "/decotion/haldi decortion/Haldi decortion  (9).jpg")
 * to its Supabase Storage URL, once the asset has been uploaded there by
 * scripts/upload-site-assets.mjs. Returns the local path unchanged when:
 *  - Supabase isn't configured (local dev without env vars), or
 *  - the input isn't a local path at all (already an absolute URL, or empty), or
 *  - NEXT_PUBLIC_USE_SUPABASE_ASSETS isn't explicitly "true".
 *
 * That last check is deliberately opt-in (not just "Supabase is configured")
 * because the site's asset paths are only valid once every referenced file
 * has actually been uploaded to the `site-assets` bucket - flip it on only
 * after running scripts/upload-site-assets.mjs successfully and confirming
 * its summary shows 0 failures, otherwise every image site-wide 404s. */
export function toAssetUrl(localPath: string): string {
  if (!localPath || !localPath.startsWith('/')) return localPath;
  if (process.env.NEXT_PUBLIC_USE_SUPABASE_ASSETS !== 'true') return localPath;
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return localPath;
  return `${base}/storage/v1/object/public/${SITE_ASSETS_BUCKET}${localPath}`;
}
