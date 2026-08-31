import raw from './decoration-inspiration.json';
import { CatalogItem } from '../types/catalog';
import { DecorationPhoto } from '../types/decoration-inspiration';
import { toAssetUrl } from '../asset-url';

// Every other /public asset source in this app goes through toAssetUrl() so
// it can be served from Supabase Storage instead of the local filesystem
// once NEXT_PUBLIC_USE_SUPABASE_ASSETS is on - this ~1500-photo array never
// did, meaning every decoration inspiration photo always loaded from local
// /public regardless of that flag. Mapped once here at module load so every
// consumer (getAllDecorationPhotos, getDecorationPhotosByCategory,
// getDecorationPhotosForItem, decorationPhotoToCartItem, etc.) is covered.
const ALL_PHOTOS: DecorationPhoto[] = raw.photos.map((p) => ({ ...p, src: toAssetUrl(p.src) }));

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

/** Turns a selected inspiration photo into a cart-compatible CatalogItem. */
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
  { slug: 'door-decoration', label: 'Door & Entrance Decoration' },
  { slug: 'entrance-gatename-decoration', label: 'Gate Name Plate' },
  { slug: 'haldi-decoration', label: 'Haldi & Mehndi Decoration' },
  { slug: 'garlands', label: 'Garlands' },
  { slug: 'passage-decoration', label: 'Passage Decoration' },
  { slug: 'saptapadi', label: 'Saptapadi & Deepa Alankara' },
  { slug: 'magina-jadi', label: 'Mogina Jade' },
  { slug: 'harani-basing', label: 'Harini Bashinge' },
  { slug: 'photo-booth', label: 'Photo Booth' },
  { slug: 'bridal-entry', label: 'Bridal Entry Ideas' },
  { slug: 'couple-entry', label: 'Couple Entry Concept' },
  { slug: 'cold-fire-entry', label: 'Cold Fire Entry' },
  { slug: 'welcome-bouquet', label: 'Welcome Bouquet' },
  { slug: 'welcome-girls', label: 'Welcome Girls' },
  { slug: 'house-lighting', label: 'House Lighting' },
  { slug: 'birthday-decoration', label: 'Birthday Decoration' },
  { slug: 'balloon-decoration', label: 'Balloon Decoration' },
  { slug: 'anniversary-decoration', label: 'Anniversary Decoration' },
  { slug: 'housewarming-decoration', label: 'Housewarming Decoration' },
  { slug: 'naming-ceremony', label: 'Naming Ceremony' },
  { slug: 'corporate-events', label: 'Corporate Events' },
];

/** Which event types each decoration category is relevant to. */
const CATEGORY_EVENT_TYPES: Record<string, string[]> = {
  'stage-decoration': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'corporate_event', 'haldi_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'mantap-decoration': ['wedding', 'engagement', 'traditional_home_function', 'housewarming', 'shrimantha_karya'],
  'chapra-with-flowers': ['wedding', 'engagement', 'reception', 'haldi_function', 'traditional_home_function', 'housewarming', 'shrimantha_karya', 'half_saree_function'],
  'door-decoration': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'entrance-gatename-decoration': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary'],
  'haldi-decoration': ['wedding', 'haldi_function', 'half_saree_function'],
  garlands: ['wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  'passage-decoration': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'],
  saptapadi: ['wedding'],
  'magina-jadi': ['wedding', 'half_saree_function'],
  'harani-basing': ['wedding'],
  'photo-booth': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary'],
  'bridal-entry': ['wedding', 'engagement', 'reception', 'haldi_function', 'half_saree_function'],
  'couple-entry': ['wedding', 'engagement', 'reception'],
  'cold-fire-entry': ['wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'half_saree_function'],
  'welcome-bouquet': ['wedding', 'engagement', 'reception', 'birthday'],
  'welcome-girls': ['wedding'],
  'house-lighting': ['wedding', 'housewarming', 'traditional_home_function'],
  'birthday-decoration': ['birthday'],
  'balloon-decoration': ['birthday', 'get_together', 'anniversary'],
  'anniversary-decoration': ['anniversary'],
  'housewarming-decoration': ['housewarming'],
  'naming-ceremony': ['traditional_home_function'],
  'corporate-events': ['corporate_event'],
};

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

/** Returns the image source for rendering. All updated photos are served directly from /decotion/. */
export function getWatermarkedDecorationSrc(src: string): string {
  return src;
}

/**
 * Checks whether an item should have NO photo dropdown.
 * Explicit rule: No dropdown for Music Arrangement, Choreography, Punjabi Dole / Dhol,
 * Kashi Yatra, Normal Garlands, Homa Gunda, Nadaswara, Dancers, Crackers, Security.
 */
export function isNoDropdownDecorationItem(item: { id?: string; name?: string; groupId?: string | null }): boolean {
  const id = (item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  const groupId = (item.groupId || '').toLowerCase();

  // Nadaswara / Nadaswaram
  if (id.includes('nadaswara') || name.includes('nadaswara') || id.includes('nadaswaram') || name.includes('nadaswaram')) return true;

  // Normal garlands (note: Special Garlands has a dropdown; Normal Garlands does NOT)
  if ((id.includes('normal-garland') || name.includes('normal garland') || name.includes('normal garlands')) && !name.includes('special')) return true;

  // Music arrangement / Music system
  if (id.includes('music') || name.includes('music')) return true;

  // Choreography
  if (id.includes('choreography') || name.includes('choreography')) return true;

  // Punjabi dole / Punjabi dhol
  if (id.includes('punjabi') || id.includes('dhol') || id.includes('dole') || name.includes('punjabi') || name.includes('dhol') || name.includes('dole')) return true;

  // Kashi yatra / Kashi yatri
  if (id.includes('kashi') || name.includes('kashi')) return true;

  // Homa gunda
  if (id.includes('homa') || id.includes('gunda') || name.includes('homa gunda')) return true;

  // Dancers & Crackers
  if (id.includes('dancer') || name.includes('dancer') || id.includes('cracker') || name.includes('cracker')) return true;

  // Body guards and security
  if (
    groupId.includes('security') ||
    id.includes('security') ||
    id.includes('bouncer') ||
    id.includes('guard') ||
    name.includes('security') ||
    name.includes('bouncer') ||
    name.includes('body guard') ||
    name.includes('bodyguard') ||
    name.includes('guard')
  ) {
    return true;
  }

  return false;
}

/**
 * Returns the maximum number of designs a customer can select for a decoration item.
 * Explicit rule: In Stage Decoration, there should be 2 selectables from the dropdown.
 * All other items allow 1 selectable.
 */
export function getMaxDecorationSelections(item: { id?: string; name?: string }): number {
  const id = (item.id || '').toLowerCase();
  const name = (item.name || '').toLowerCase();
  if (id.includes('stage') || name.includes('stage')) {
    return 2;
  }
  return 1;
}

/**
 * Returns the related photos for any decoration checklist option/item.
 * Maps each service directly to its designated folder in /decotion/ without collisions.
 */
export function getDecorationPhotosForItem(item: CatalogItem | { id: string; name?: string; groupId?: string | null }): DecorationPhoto[] {
  // If this item is designated to have no dropdown, return empty array
  if (isNoDropdownDecorationItem(item)) {
    return [];
  }

  const id = item.id.toLowerCase();
  const name = (item.name || '').toLowerCase();
  const groupId = (item.groupId || '').toLowerCase();

  // 1. Special Garlands -> /decotion/Garlands/
  if (id.includes('special-garland') || name.includes('special garland') || name.includes('special garlands')) {
    return getDecorationPhotosByCategory('garlands');
  }

  // 2. Mogina Jade -> /decotion/MAGINA JADI/
  if (id.includes('mogina') || id.includes('jade') || id.includes('magina') || name.includes('mogina') || name.includes('jade') || name.includes('magina')) {
    return getDecorationPhotosByCategory('magina-jadi');
  }

  // 3. Harini Bashinge / Harani Bashige -> /decotion/harani basing/
  if (id.includes('harani') || id.includes('harini') || id.includes('bashinge') || id.includes('bashige') || id.includes('basing') || name.includes('harani') || name.includes('harini') || name.includes('bashinge') || name.includes('bashige') || name.includes('basing')) {
    return getDecorationPhotosByCategory('harani-basing');
  }

  // 4. Muhurtha Manthapa Decoration -> /decotion/muhurtha mantapa decortion/ & /decotion/mantap decotion/
  if (id.includes('muhurtha') || name.includes('muhurtha') || id.includes('mantap') || name.includes('mantap') || name.includes('manthapa')) {
    return getDecorationPhotosByCategory('mantap-decoration');
  }

  // 5. Stage Decoration -> /decotion/stage decortion/ (Allows up to 2 selectables)
  if (id.includes('stage') || name.includes('stage')) {
    return getDecorationPhotosByCategory('stage-decoration');
  }

  // 6. Chapra Decoration / Chapra With Flowers -> /decotion/chapra with flower/
  if (id.includes('chappara') || name.includes('chappara') || id.includes('chapra') || name.includes('chapra')) {
    return getDecorationPhotosByCategory('chapra-with-flowers');
  }

  // 7. House Lighting / LED Par Light -> /decotion/house-lighting/
  if (id.includes('lighting') || name.includes('lighting') || id.includes('par-light') || name.includes('par light')) {
    return getDecorationPhotosByCategory('house-lighting');
  }

  // 8. Entrance Gate Name Plate Decoration / Entrance Name Board -> /decotion/entersed gate name decortion/
  if (id.includes('name-plate') || name.includes('name plate') || id.includes('name-board') || name.includes('name board') || id.includes('gate') || name.includes('gate name')) {
    return getDecorationPhotosByCategory('entrance-gatename-decoration');
  }

  // 9. Front Door Decoration / Pooja Door / Venue Entrance Door -> /decotion/entersnce door decortion/ & /decotion/door decation/
  if (id.includes('door') || name.includes('door') || id.includes('pooja') || name.includes('pooja')) {
    return getDecorationPhotosByCategory('door-decoration');
  }

  // 10. Entrance Passage Decoration / Pathway / Walkway / Staircase & Railings -> /decotion/pasage/
  if (id.includes('passage') || name.includes('passage') || id.includes('pathway') || name.includes('pathway') || name.includes('walkway') || id.includes('staircase') || name.includes('staircase') || name.includes('railing')) {
    return getDecorationPhotosByCategory('passage-decoration');
  }

  // 11. Haldi Decoration / Mehndi Decoration / Yellow Decoration -> /decotion/haldi decortion/
  if (id.includes('mehndi') || name.includes('mehndi') || id.includes('mehendi') || name.includes('mehendi') || id.includes('haldi') || name.includes('haldi') || id.includes('yellow') || name.includes('yellow')) {
    return getDecorationPhotosByCategory('haldi-decoration');
  }

  // 12. Photo Booth / Phonebooth -> /decotion/photo both/
  if (id.includes('photo-booth') || name.includes('photo booth') || id.includes('photobooth') || name.includes('photobooth') || id.includes('phonebooth') || name.includes('phonebooth')) {
    return getDecorationPhotosByCategory('photo-booth');
  }

  // 13. Saptapadi / Sapthapadi & Deepa Alankara -> /decotion/sapthathi/ & /decotion/saptapadi/
  if (id.includes('saptapadi') || name.includes('saptapadi') || id.includes('sapthapadi') || name.includes('sapthapadi') || id.includes('deepa') || name.includes('deepa')) {
    return getDecorationPhotosByCategory('saptapadi');
  }

  // 14. Welcome Bouquet -> /decotion/welcome bouquet/
  if (id.includes('bouquet') || name.includes('bouquet')) {
    return getDecorationPhotosByCategory('welcome-bouquet');
  }

  // 15. Welcome Girls -> /decotion/welcome girls/
  if (id.includes('welcome-girls') || name.includes('welcome girls')) {
    return getDecorationPhotosByCategory('welcome-girls');
  }

  // 16. Cold Fair / Cold Pyros / Sparklers -> /decotion/cold fire/
  if (id.includes('cold') || id.includes('pyro') || name.includes('pyro') || name.includes('sparkler') || id.includes('cold-fair')) {
    return getDecorationPhotosByCategory('cold-fire-entry');
  }

  // 17. Couple Entry Concepts (Cloud Fog, Fireworks, Smoke Bombs, Vintage Car, Carriage, Floral Canopy) -> /decotion/couple-entry/ & /decotion/bridal entry idea/
  if (
    groupId.includes('entry') ||
    id.includes('entry') ||
    name.includes('entry') ||
    id.includes('vintage') ||
    id.includes('carriage') ||
    id.includes('canopy') ||
    id.includes('cloud') ||
    id.includes('smoke') ||
    id.includes('firework') ||
    id.includes('fog') ||
    name.includes('cloud') ||
    name.includes('canopy') ||
    name.includes('smoke') ||
    name.includes('firework') ||
    name.includes('carriage') ||
    name.includes('vintage') ||
    name.includes('fog')
  ) {
    const bridal = getDecorationPhotosByCategory('bridal-entry');
    const couple = getDecorationPhotosByCategory('couple-entry');
    const cold = getDecorationPhotosByCategory('cold-fire-entry');
    return [...bridal, ...couple, ...cold];
  }

  // Fallback to item images if present on catalog item
  if ('images' in item && item.images && item.images.length > 0) {
    return item.images.map((src, idx) => ({
      id: `${item.id}-${idx + 1}`,
      src,
      category: 'custom',
      categoryLabel: item.name || 'Decoration Option',
    }));
  }

  return [];
}
