import raw from './decoration-inspiration.json';
import { CatalogItem } from '../types/catalog';
import { DecorationPhoto } from '../types/decoration-inspiration';

const ALL_PHOTOS: DecorationPhoto[] = raw.photos;

/** Cart item ids for a decoration photo are namespaced with this prefix so a
 * cart line can be traced back to the photo it came from. */
export const DECORATION_CART_ID_PREFIX = 'decoration-photo-';

export function decorationCartItemId(photoId: string): string {
  return `${DECORATION_CART_ID_PREFIX}${photoId}`;
}

export function decorationPhotoIdFromCartItemId(cartItemId: string): string | null {
  return cartItemId.startsWith(DECORATION_CART_ID_PREFIX)
    ? cartItemId.slice(DECORATION_CART_ID_PREFIX.length)
    : null;
}

/** The numeric suffix on a photo id (e.g. "bridal-entry-3" -> "3") - used to
 * give the customer's pick a specific, identifiable name ("Bridal Entry
 * Ideas - Design #3") rather than just the category, so a selection records
 * exactly which design was chosen, not only which category it came from. */
function photoDesignNumber(photoId: string): string {
  const match = photoId.match(/(\d+)$/);
  return match ? match[1] : photoId;
}

/** Turns a selected inspiration photo into a cart-compatible CatalogItem.
 * There's no real catalog group/pricing behind these - decoration selection
 * here is purely "this is the look I want", so price is 0 (pricing isn't
 * shown anywhere on the site) and groupId is a fixed local id rather than a
 * real Supabase catalog_groups row. The name embeds both the category and
 * the specific design number so "Your Selections" and the final owner
 * enquiry both show exactly which decoration/image was picked, not just
 * which category. */
export function decorationPhotoToCartItem(photo: DecorationPhoto): CatalogItem {
  return {
    id: decorationCartItemId(photo.id),
    supportedEventTypes: [],
    categoryKey: 'decoration',
    groupId: 'decoration-inspiration',
    name: `${photo.categoryLabel} - Design #${photoDesignNumber(photo.id)}`,
    description: 'Selected from our decoration photo gallery.',
    imageUrl: photo.src,
    images: [photo.src],
    packageLevel: 'normal',
    price: 0,
    unit: 'event',
    quantityMode: 'single',
    maxQuantity: 1,
    maxSelectionsOverride: null,
    metadata: { photoId: photo.id, decorationCategory: photo.categoryLabel },
    active: true,
    displayOrder: 0,
  };
}

/** Display order + labels for the category filter chips. */
export const DECORATION_CATEGORIES: { slug: string; label: string }[] = [
  { slug: 'stage-decoration', label: 'Stage Decoration' },
  { slug: 'mantap-decoration', label: 'Manthapa Decoration' },
  { slug: 'chapra-with-flowers', label: 'Chapra With Flowers' },
  { slug: 'garlands', label: 'Garlands' },
  { slug: 'passage-decoration', label: 'Passage Decoration' },
  { slug: 'door-decoration', label: 'Door & Entrance Decoration' },
  { slug: 'bridal-entry', label: 'Bridal Entry Ideas' },
  { slug: 'saptapadi', label: 'Saptapadi Setup' },
  { slug: 'cold-fire-entry', label: 'Cold Fire Entry' },
];

/** Which event types each decoration category is relevant to. Wedding itself
 * doesn't use this photo gallery any more (it has its own checklist), so this
 * only matters for every other event type.
 *
 * Engagement, Reception, Haldi Function, Traditional Home Function,
 * Housewarming, Shrimantha Karya and Half-Saree Function follow the client's
 * exact category list per event (see the Decoration section spec) - every
 * other event type (Birthday, Anniversary, Get Together, Bachelor Party,
 * Corporate Event, Other Events) keeps the broader, unspecified mapping.
 * Saptapadi is never included for any of these - it's a strictly wedding
 * ritual (rule: Saptapadi must not appear under any non-Wedding event). */
const CATEGORY_EVENT_TYPES: Record<string, string[]> = {
  'stage-decoration': ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'corporate_event', 'haldi_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'mantap-decoration': ['engagement', 'traditional_home_function', 'housewarming', 'shrimantha_karya'],
  'chapra-with-flowers': ['engagement', 'reception', 'haldi_function', 'traditional_home_function', 'housewarming', 'shrimantha_karya', 'half_saree_function'],
  garlands: ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'passage-decoration': ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'door-decoration': ['reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'bridal-entry': ['engagement', 'reception', 'haldi_function', 'half_saree_function'],
  saptapadi: [], // strictly a wedding ritual - not relevant to any other event type
  'cold-fire-entry': ['engagement', 'reception', 'birthday', 'anniversary', 'half_saree_function'],
};

/** Category filter chips scoped to a given (non-wedding) event type, in the
 * same order as DECORATION_CATEGORIES. Wedding isn't looked up here - it uses
 * its own decoration checklist instead of this photo gallery. */
export function getDecorationCategoriesForEventType(eventTypeId: string): { slug: string; label: string }[] {
  return DECORATION_CATEGORIES.filter((c) => (CATEGORY_EVENT_TYPES[c.slug] || []).includes(eventTypeId));
}

export function getAllDecorationPhotos(): DecorationPhoto[] {
  return ALL_PHOTOS;
}

export function getDecorationPhotosByCategory(category: string | 'all'): DecorationPhoto[] {
  if (category === 'all') return ALL_PHOTOS;
  return ALL_PHOTOS.filter((p) => p.category === category);
}

export function getDecorationPhotoById(id: string): DecorationPhoto | undefined {
  return ALL_PHOTOS.find((p) => p.id === id);
}

/** Every decoration photo has a pre-generated, permanently-watermarked
 * counterpart under /decotion-watermarked (same relative path/extension,
 * built once via a one-off sharp script - see the "Add Client Logo to Every
 * Decoration Photo" change) with the client's logo composited into the
 * bottom-right corner of the actual image bytes. The gallery always displays
 * this version, never the raw /decotion/ original, so the branding survives
 * even if someone saves/copies the displayed photo - and since it's a static
 * pre-built file, there's no runtime image-processing cost per view. */
export function getWatermarkedDecorationSrc(src: string): string {
  return src.startsWith('/decotion/') ? `/decotion-watermarked/${src.slice('/decotion/'.length)}` : src;
}

/**
 * Returns the related photos for any decoration checklist option/item.
 * Maps the item's id or name to its curated photo collection from decoration-inspiration.
 */
export function getDecorationPhotosForItem(item: CatalogItem | { id: string; name?: string; groupId?: string | null }): DecorationPhoto[] {
  const id = item.id.toLowerCase();
  const name = (item.name || '').toLowerCase();
  const groupId = (item.groupId || '').toLowerCase();

  // Stage Decoration
  if (id.includes('stage') || name.includes('stage')) {
    return getDecorationPhotosByCategory('stage-decoration');
  }
  // Muhurtha Manthapa
  if (id.includes('mantap') || name.includes('mantap') || name.includes('manthapa')) {
    return getDecorationPhotosByCategory('mantap-decoration');
  }
  // Chappara / Flowers
  if (id.includes('chappara') || name.includes('chappara') || id.includes('chapra') || name.includes('chapra')) {
    return getDecorationPhotosByCategory('chapra-with-flowers');
  }
  // Door / Entrance
  if (id.includes('door') || name.includes('door') || id.includes('gate') || name.includes('name plate')) {
    return getDecorationPhotosByCategory('door-decoration');
  }
  // Passage
  if (id.includes('passage') || name.includes('passage') || name.includes('walkway')) {
    return getDecorationPhotosByCategory('passage-decoration');
  }
  // Garlands
  if (id.includes('garland') || name.includes('garland')) {
    return getDecorationPhotosByCategory('garlands');
  }
  // Saptapadi
  if (id.includes('saptapadi') || name.includes('saptapadi')) {
    return getDecorationPhotosByCategory('saptapadi');
  }
  // Cold fire / pyros / fireworks
  if (id.includes('cold') || id.includes('pyro') || id.includes('smoke') || id.includes('firework') || name.includes('pyro') || name.includes('sparkler') || name.includes('smoke') || name.includes('firework')) {
    return getDecorationPhotosByCategory('cold-fire-entry');
  }
  // Couple Entry Concept / Bridal entry / Vintage car / Carriage
  if (groupId.includes('entry') || id.includes('entry') || name.includes('entry') || id.includes('vintage') || id.includes('carriage') || id.includes('canopy') || id.includes('cloud') || name.includes('cloud') || name.includes('canopy')) {
    const bridal = getDecorationPhotosByCategory('bridal-entry');
    const cold = getDecorationPhotosByCategory('cold-fire-entry');
    return [...bridal, ...cold];
  }
  // Bouncers & Security
  if (groupId.includes('security') || id.includes('security') || name.includes('security') || name.includes('bouncer')) {
    return [
      { id: 'security-1', src: '/sid-party28.jpeg', category: 'security', categoryLabel: 'Bouncers & Security' },
      { id: 'security-2', src: '/sid-party35.jpeg', category: 'security', categoryLabel: 'Bouncers & Security' },
    ];
  }
  // Photo Booth / Haldi / Mehndi
  if (id.includes('photo-booth') || name.includes('photo booth')) {
    return [
      { id: 'booth-1', src: '/sid-party25.jpeg', category: 'photo-booth', categoryLabel: 'Photo Booth' },
      { id: 'booth-2', src: '/sid-party22.jpeg', category: 'photo-booth', categoryLabel: 'Photo Booth' },
    ];
  }
  // Fallback to item images if present or stage photos
  if ('images' in item && item.images && item.images.length > 0) {
    return item.images.map((src, idx) => ({
      id: `${item.id}-${idx + 1}`,
      src,
      category: 'custom',
      categoryLabel: item.name || 'Decoration Option',
    }));
  }

  return getDecorationPhotosByCategory('stage-decoration').slice(0, 4);
}
