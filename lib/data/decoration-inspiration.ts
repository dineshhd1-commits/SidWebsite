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
  { slug: 'mantap-decoration', label: 'Mantap Decoration' },
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
