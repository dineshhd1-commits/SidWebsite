import { supabase, isSupabaseConfigured } from '../supabase';
import { GalleryItem } from '../types/wedding';
import { MOCK_GALLERY } from '../mock-data';
import { toAssetUrl } from '../asset-url';

function mapRow(row: any): GalleryItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    mediaType: row.media_type || 'image',
    url: toAssetUrl(row.url),
    thumbnailUrl: row.thumbnail_url ? toAssetUrl(row.thumbnail_url) : undefined,
    images: row.images ? row.images.map(toAssetUrl) : undefined,
    rotate: row.rotate || undefined,
  };
}

// Session-lived cache - avoids re-fetching every time the gallery page is
// revisited in the same session.
let galleryCache: Promise<GalleryItem[]> | null = null;

/** Reads gallery items from Supabase; falls back to the bundled mock gallery
 * only when Supabase is unconfigured or genuinely returns no rows, so the
 * portfolio page never renders empty while admin content is still being added. */
export function getGalleryItems(): Promise<GalleryItem[]> {
  if (!galleryCache) galleryCache = getGalleryItemsUncached();
  return galleryCache;
}

async function getGalleryItemsUncached(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return MOCK_GALLERY;
  try {
    const { data, error } = await supabase
      .from('gallery_items')
      .select('*')
      .eq('active', true)
      .order('display_order', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) return MOCK_GALLERY;
    return data.map(mapRow);
  } catch (e) {
    console.warn('getGalleryItems failed, falling back to mock gallery:', e);
    return MOCK_GALLERY;
  }
}
