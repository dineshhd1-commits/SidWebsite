/**
 * Local fallback data for the Event Builder catalog - lets the whole builder flow
 * (event selection, decoration limits, replace/upgrade modals, catering approval,
 * venue, cart) be reviewed in the browser before the Supabase migrations/seed are
 * run. Mirrors supabase/seed_event_builder.sql exactly - once the real tables have
 * rows, the data-access functions in this folder prefer Supabase and only fall back
 * to this file when a table is missing or genuinely empty.
 *
 * All 14 event types are catalog-ready with real Indian event-planning categories
 * (Griha Pravesh, Haldi, Seemantham/Naming ceremony, Nadaswara, Purohit services,
 * etc.), researched against how Indian event planners actually structure these
 * services. Universal services (Photography, DJ/Music, Catering, Return Gifts,
 * Entrance Decoration) are shared across the event types they genuinely apply to
 * instead of being duplicated per event.
 *
 * Image URLs are intentionally blank across the board except the one verified
 * accurate photo (sid-party29.jpeg, a real wedding stage/mandap setup) - none of
 * the other stock photos bundled in public/ reliably depict the catalog item
 * they'd be attached to, so the UI shows a "Photo coming soon" placeholder instead.
 */
import {
  CatalogGroup,
  CatalogItem,
  EventType,
  MealPeriod,
  PackageDefinition,
  PackageGroupLimit,
  PackageIncludedItem,
  PackageLevel,
} from '../types/catalog';

export const MOCK_EVENT_TYPES: EventType[] = [
  { id: 'wedding', name: 'Wedding', shortDescription: 'Complete traditional South Indian wedding planning, decor to catering.', imageUrl: '/sid-party29.jpeg', isCatalogReady: true, displayOrder: 1, active: true },
  { id: 'engagement', name: 'Engagement', shortDescription: 'Ring ceremony décor, stage design and catering for your engagement.', imageUrl: '/packages/engagement.jpg', isCatalogReady: true, displayOrder: 2, active: true },
  { id: 'reception', name: 'Reception', shortDescription: 'Elegant reception stage, catering and entertainment.', imageUrl: '/packages/reception.jpg', isCatalogReady: true, displayOrder: 3, active: true },
  { id: 'birthday', name: 'Birthday', shortDescription: 'Themed birthday celebrations for every age and milestone.', imageUrl: '/packages/birthday.jpg', isCatalogReady: true, displayOrder: 4, active: true },
  { id: 'anniversary', name: 'Anniversary', shortDescription: 'Elegant anniversary celebrations, big or intimate.', imageUrl: '/packages/anniversary.jpg', isCatalogReady: true, displayOrder: 5, active: true },
  { id: 'get_together', name: 'Get Together', shortDescription: 'Casual and semi-formal family or friends get-togethers.', imageUrl: '/packages/get-together.jpg', isCatalogReady: true, displayOrder: 6, active: true },
  { id: 'bachelor_party', name: 'Bachelor Party', shortDescription: 'Fun, high-energy bachelor party planning and coordination.', imageUrl: '/packages/bachelor-party.jpg', isCatalogReady: true, displayOrder: 7, active: true },
  { id: 'housewarming', name: 'Housewarming', shortDescription: 'Griha Pravesh ceremonies handled from rituals to hospitality.', imageUrl: '/packages/housewarming.jpg', isCatalogReady: true, displayOrder: 8, active: true },
  { id: 'haldi_function', name: 'Haldi Function', shortDescription: 'Vibrant Haldi decor, seating and catering setup.', imageUrl: '/packages/haldi-function.jpg', isCatalogReady: true, displayOrder: 9, active: true },
  { id: 'corporate_event', name: 'Corporate Event', shortDescription: 'Conferences, product launches and corporate celebrations.', imageUrl: '/packages/corporate-event.jpg', isCatalogReady: true, displayOrder: 10, active: true },
  { id: 'traditional_home_function', name: 'Traditional Home Function', shortDescription: 'Naming ceremonies, seemantham and other home rituals.', imageUrl: '/packages/traditional-home-function.jpg', isCatalogReady: true, displayOrder: 11, active: true },
  { id: 'shrimantha_karya', name: 'Shrimantha Karya', shortDescription: 'Traditional baby shower ceremony with decor, rituals and catering.', imageUrl: '/packages/shrimantha-karya.jpg', isCatalogReady: true, displayOrder: 12, active: true },
  { id: 'half_saree_function', name: 'Half-Saree Function', shortDescription: 'Langa voni coming-of-age celebration, decor to catering.', imageUrl: '/packages/half-saree-function.jpg', isCatalogReady: true, displayOrder: 13, active: true },
  { id: 'other_events', name: 'Other Events', shortDescription: 'Reunions, custom celebrations and everything in between.', imageUrl: '/packages/other-events.jpg', isCatalogReady: true, displayOrder: 14, active: true },
];

export const MOCK_PACKAGE_LEVELS: PackageLevel[] = [
  { id: 'normal', name: 'Normal', rank: 0, displayOrder: 1, active: true },
  { id: 'standard', name: 'Standard', rank: 1, displayOrder: 2, active: true },
  { id: 'silver', name: 'Silver', rank: 2, displayOrder: 3, active: true },
  { id: 'gold', name: 'Gold', rank: 3, displayOrder: 4, active: true },
  { id: 'premium', name: 'Premium', rank: 4, displayOrder: 5, active: true },
  { id: 'luxury', name: 'Luxury', rank: 5, displayOrder: 6, active: true },
  { id: 'platinum', name: 'Platinum', rank: 6, displayOrder: 7, active: true },
];

const ALL_EVENT_TYPES = [
  'wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together',
  'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event',
  'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events',
];

function group(
  id: string,
  supportedEventTypes: string[],
  categoryKey: CatalogGroup['categoryKey'],
  name: string,
  defaultMaxSelections: number | null,
  freeIncludedCount: number,
  requiresApprovalAfterLimit: boolean,
  approvalMessage: string | null,
  displayOrder: number,
  meals?: MealPeriod[]
): CatalogGroup {
  return { id, supportedEventTypes, categoryKey, name, defaultMaxSelections, freeIncludedCount, requiresApprovalAfterLimit, approvalMessage, displayOrder, active: true, meals };
}

/** Event types with a dedicated Breakfast menu - now offered for every event type. */
export const BREAKFAST_EVENT_TYPES = ALL_EVENT_TYPES;

/** Wedding photography is split into its own two groups (Deverakarya and
 * Wedding Hall) below, so the shared Photography & Videography group covers
 * every event type except Wedding. */
export const PHOTOGRAPHY_EVENT_TYPES = ALL_EVENT_TYPES.filter((t) => t !== 'wedding');

export const MOCK_CATALOG_GROUPS: CatalogGroup[] = [
  // Decoration is a single choice of one of three tiers - Silver, Gold or Platinum -
  // offered the same way across every event type.
  group('dec-package', ALL_EVENT_TYPES, 'decoration', 'Decoration Package', 1, 1, false, null, 1),

  // Wedding-only decoration add-on services, organised by where they apply:
  // the home ceremony setup, the venue itself, and the couple's entry moment.
  // Each is a free-pick checklist (no cap) alongside the photo-based decoration
  // style picker above.
  group('dec-home', ['wedding'], 'decoration', 'Home Decoration', null, 0, false, null, 2),
  group('dec-venue', ['wedding'], 'decoration', 'Venue Decoration', null, 0, false, null, 3),
  group('dec-couple-entry', ['wedding'], 'decoration', 'Couple Entry Concept', null, 0, false, null, 4),
  group('dec-welcome-girls', ['wedding'], 'decoration', 'Welcome Girls', null, 0, false, null, 5),

  // Engagement, Reception, Birthday and Anniversary each get their own
  // Venue Decoration (and, except Anniversary, Entry Concept) checklist -
  // separate group ids per event type (not shared with Wedding's or each
  // other's) so a selection always stays tied to the event it was actually
  // picked under, the same way Wedding's groups already work.
  group('dec-venue-engagement', ['engagement'], 'decoration', 'Venue Decoration', null, 0, false, null, 6),
  group('dec-entry-engagement', ['engagement'], 'decoration', 'Couple Entry Concept', null, 0, false, null, 7),
  group('dec-venue-reception', ['reception'], 'decoration', 'Venue Decoration', null, 0, false, null, 8),
  group('dec-entry-reception', ['reception'], 'decoration', 'Couple Entry Concept', null, 0, false, null, 9),
  group('dec-venue-birthday', ['birthday'], 'decoration', 'Venue Decoration', null, 0, false, null, 10),
  group('dec-entry-birthday', ['birthday'], 'decoration', 'Entry Concept', null, 0, false, null, 11),
  group('dec-venue-anniversary', ['anniversary'], 'decoration', 'Venue Decoration', null, 0, false, null, 12),

  group('cat-welcome-drinks', ['wedding'], 'catering', 'Welcome Drinks', 1, 1, true, 'Additional Welcome Drinks require vendor approval.', 1, ['lunch', 'dinner']),
  group('cat-starters', ['wedding'], 'catering', 'Starters', 2, 2, true, 'You have reached the allowed number of starters for your package.', 2, ['lunch', 'dinner']),
  group('cat-main-course', ['wedding'], 'catering', 'Main Course', null, 0, false, null, 3, ['lunch', 'dinner']),
  group('cat-rice', ['wedding'], 'catering', 'Rice Items', null, 0, false, null, 4, ['lunch', 'dinner']),
  group('cat-breads', ['wedding'], 'catering', 'Indian Breads', null, 0, false, null, 5, ['lunch', 'dinner']),
  group('cat-curries', ['wedding'], 'catering', 'Curries', null, 0, false, null, 6, ['lunch', 'dinner']),
  group('cat-live-counters', ['wedding'], 'catering', 'Live Counters', 2, 1, false, null, 7, ['lunch', 'dinner']),
  group('cat-desserts', ['wedding'], 'catering', 'Desserts', null, 0, false, null, 8, ['lunch', 'dinner']),
  group('cat-ice-cream', ['wedding'], 'catering', 'Ice Cream', 1, 1, false, null, 9, ['lunch', 'dinner']),
  group('cat-beverages', ['wedding'], 'catering', 'Beverages', null, 0, false, null, 10, ['lunch', 'dinner']),
  group('cat-special-items', ['wedding'], 'catering', 'Special Items', null, 0, false, null, 11, ['lunch', 'dinner']),
  group('cat-general', ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'], 'catering', 'Catering', 1, 1, false, null, 12, ['lunch', 'dinner']),
  group('cat-breakfast', BREAKFAST_EVENT_TYPES, 'catering', 'Breakfast', null, 0, false, null, 13, ['breakfast']),

  // Wedding photography is organised by where the coverage happens: Deverakarya
  // (the home/ritual ceremony) and Wedding Hall. Every other event type uses the
  // single shared group instead - see PHOTOGRAPHY_EVENT_TYPES above.
  group('photo-deverakarya', ['wedding'], 'photography', 'Deverakarya', null, 0, false, null, 1),
  group('photo-wedding-hall', ['wedding'], 'photography', 'Wedding Hall', null, 0, false, null, 2),
  // Pre-Wedding Shoot is its own section, split into a duration pick (1 Day /
  // 2 Days - max 1) and the service checklist that unlocks once a duration is
  // chosen. Two groups so the duration cap is enforced the same generic way
  // every other "choose one" group in this catalog already is.
  group('photo-prewedding-duration', ['wedding'], 'photography', 'Pre-Wedding Shoot Duration', 1, 0, false, null, 3),
  group('photo-prewedding-services', ['wedding'], 'photography', 'Pre-Wedding Shoot', null, 0, false, null, 4),
  group('photo-services', PHOTOGRAPHY_EVENT_TYPES, 'photography', 'Photography & Videography', null, 0, false, null, 5),
  group('addon-services', ALL_EVENT_TYPES, 'additional_services', 'Additional Services', null, 0, false, null, 1),
];

function item(partial: Partial<CatalogItem> & Pick<CatalogItem, 'id' | 'supportedEventTypes' | 'categoryKey' | 'groupId' | 'name' | 'description' | 'imageUrl' | 'packageLevel' | 'price' | 'unit' | 'displayOrder'>): CatalogItem {
  return {
    quantityMode: 'single',
    maxQuantity: null,
    maxSelectionsOverride: null,
    metadata: {},
    active: true,
    images: partial.imageUrl ? [partial.imageUrl] : [],
    ...partial,
  };
}

export const MOCK_CATALOG_ITEMS: CatalogItem[] = [
  // Decoration - exactly three tiers, offered identically across every event type.
  item({ id: 'dec-silver', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'decoration', groupId: 'dec-package', name: 'Silver Decoration', description: 'Elegant stage, entrance and seating decor with fresh florals and classic drapery.', imageUrl: '', packageLevel: 'silver', price: 45000, unit: 'package', displayOrder: 1 }),
  item({ id: 'dec-gold', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'decoration', groupId: 'dec-package', name: 'Gold Decoration', description: 'Premium themed decor with layered floral arrangements, upgraded lighting and richer drapery.', imageUrl: '', packageLevel: 'gold', price: 85000, unit: 'package', displayOrder: 2 }),
  item({ id: 'dec-platinum', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'decoration', groupId: 'dec-package', name: 'Platinum Decoration', description: 'Our most opulent decor - imported florals, crystal and brass accents, and a fully bespoke design consultation.', imageUrl: '', packageLevel: 'platinum', price: 150000, unit: 'package', displayOrder: 3 }),

  // Wedding decoration - House Decoration (setup at the couple's home for the ceremony)
  item({ id: 'dec-home-house-lighting', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'House Lighting', description: "Decorative lighting arrangement for the client's home.", imageUrl: '', packageLevel: 'normal', price: 8000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-home-entrance-chappara', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Entrance Chappara', description: 'Decorative chappara setup for the entrance.', imageUrl: '', packageLevel: 'gold', price: 12000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-home-entrance-door', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Entrance Door Decoration', description: 'Floral and festive decoration for the main entrance of the house.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-home-pooja-room', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Pooja Room Decoration', description: 'Decoration for the pooja room with flowers and toran.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-home-staircase-railings', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Staircase & Railings Decoration', description: 'Decorative styling for staircases and railings.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-home-mehndi', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Mehndi Decoration', description: 'Decor setup for the Mehndi ceremony seating and backdrop.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-home-haldi', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Haldi Decoration', description: 'Decor setup for the Haldi ceremony.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 7 }),
  item({ id: 'dec-home-music-arrangement', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Music Arrangement', description: 'Sound and music arrangement for the home function.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'dec-home-choreography', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-home', name: 'Choreography', description: 'Dance choreography arrangement for family performances.', imageUrl: '', packageLevel: 'normal', price: 7000, unit: 'per event', displayOrder: 9 }),

  // Wedding decoration - Venue Decoration (the wedding hall / mantapa itself)
  item({ id: 'dec-venue-plate', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Plate Decoration', description: 'Decorated dining plate setup for guests.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-venue-entrance-passage', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Entrance Passage Decoration', description: 'Decorated walkway leading up to the venue.', imageUrl: '', packageLevel: 'normal', price: 8000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-venue-entrance-door', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Venue Entrance Door Decoration', description: 'Decoration for the main venue entrance door.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-venue-photo-booth', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Photo Booth', description: 'Decorated photo booth setup for guests and memorable pictures.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-venue-stage', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Stage Decoration', description: 'Customized stage setup for the main event.', imageUrl: '', packageLevel: 'gold', price: 30000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-venue-muhurtha-mantapa', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Muhurtha Mantapa Decoration', description: 'Traditional decoration of the muhurtha mantapa for the ceremony.', imageUrl: '', packageLevel: 'gold', price: 25000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-venue-saptapadi', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Saptapadi', description: 'Traditional setup for the Saptapadi ceremony.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 7 }),
  item({ id: 'dec-venue-homa-gunda', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Homa Gunda', description: 'Decorated setup for the Homa Gunda ritual.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'dec-venue-kashi-yatri', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Kashi Yatri', description: 'Traditional setup for the Kashi Yatra ritual.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 9 }),
  item({ id: 'dec-venue-deepa-alankara', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Deepa Alankara', description: 'Decorative lamp (deepa) arrangement for the venue.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 10 }),
  item({ id: 'dec-venue-special-garlands', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Special Garlands', description: 'Premium special garlands for the ceremony.', imageUrl: '', packageLevel: 'gold', price: 6000, unit: 'per event', displayOrder: 11 }),
  item({ id: 'dec-venue-normal-garlands', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Normal Garlands', description: 'Fresh flower garlands for the ceremony.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 12 }),
  item({ id: 'dec-venue-mogina-jade', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Mogina Jade', description: 'Traditional mogina jade (floral string) decoration.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 13 }),
  item({ id: 'dec-venue-harini-bashinge', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Harini Bashinge', description: 'Traditional Harini Bashinge setup for the ceremony.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 14 }),
  item({ id: 'dec-venue-nadaswaram', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Nadaswaram', description: 'Live Nadaswaram musicians for the ceremony.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 15 }),
  item({ id: 'dec-venue-punjabi-dhol', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-venue', name: 'Punjabi Dhol / Dole', description: 'Punjabi dhol or dole entertainment for the venue.', imageUrl: '', packageLevel: 'gold', price: 8000, unit: 'per event', displayOrder: 16 }),

  // Wedding decoration - Couple Entry Concept (effects and setup for the couple's grand entry)
  item({ id: 'dec-couple-cloud-fog', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Dancing on a Cloud (Heavy Fog)', description: 'Heavy fog effect for a dramatic cloud-walk entry.', imageUrl: '', packageLevel: 'gold', price: 9000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-couple-cold-pyros-sparklers', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Fog, Cold Pyros & Sparklers', description: 'Fog with cold pyro and sparkler effects for the entry.', imageUrl: '', packageLevel: 'gold', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-couple-smoke-bombs', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Smoke Bombs', description: 'Coloured smoke bomb effect for the couple entry.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-couple-fireworks-tunnel', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Fireworks & Sparkler Tunnels', description: 'Fireworks and sparkler tunnel for a grand entry.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-couple-staircase-descent', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Grand Staircase Descent', description: 'Staged staircase descent entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 8000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-couple-vintage-car', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Vintage Car', description: 'Vintage car arrival for the couple entry.', imageUrl: '', packageLevel: 'gold', price: 15000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-couple-carriage', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Carriage', description: 'Traditional carriage entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'per event', displayOrder: 7 }),
  item({ id: 'dec-couple-floral-canopy', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Floral Canopy Walk', description: 'Walk-through floral canopy entry setup.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'dec-couple-welcome-bouquet', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-couple-entry', name: 'Welcome Bouquet', description: 'Fresh flower bouquet to welcome the couple.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 9 }),

  // Wedding decoration - Welcome Girls (own section, right after Couple Entry Concept)
  item({ id: 'dec-welcome-girls-service', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-welcome-girls', name: 'Welcome Girls', description: 'Welcome girls to greet and escort guests with flowers and aarti.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 1 }),

  // Engagement decoration - Venue Decoration
  item({ id: 'dec-engagement-venue-name-plate', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Entrance Gate Name Plate Decoration', description: 'Personalised name plate decoration at the entrance gate.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-engagement-venue-entrance-passage', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Entrance Passage Decoration', description: 'Decorated walkway leading up to the venue.', imageUrl: '', packageLevel: 'normal', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-engagement-venue-entrance-door', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Venue Entrance Door Decoration', description: 'Decoration for the main venue entrance door.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-engagement-venue-photo-booth', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Photo Booth', description: 'Decorated photo booth setup for guests and memorable pictures.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-engagement-venue-stage', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Stage Decoration', description: 'Customized stage setup for the engagement ceremony.', imageUrl: '', packageLevel: 'gold', price: 25000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-engagement-venue-special-garlands', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Special Garlands', description: 'Premium special garlands for the ceremony.', imageUrl: '', packageLevel: 'gold', price: 6000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-engagement-venue-normal-garlands', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-venue-engagement', name: 'Normal Garlands', description: 'Fresh flower garlands for the ceremony.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 7 }),

  // Engagement decoration - Couple Entry Concept
  item({ id: 'dec-engagement-entry-cloud-fog', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Dancing on a Cloud (Heavy Fog)', description: 'Heavy fog effect for a dramatic cloud-walk entry.', imageUrl: '', packageLevel: 'gold', price: 9000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-engagement-entry-cold-pyros-sparklers', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Fog, Cold Pyros & Sparklers', description: 'Fog with cold pyro and sparkler effects for the entry.', imageUrl: '', packageLevel: 'gold', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-engagement-entry-smoke-bombs', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Smoke Bombs', description: 'Coloured smoke bomb effect for the couple entry.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-engagement-entry-fireworks-tunnel', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Fireworks & Sparkler Tunnels', description: 'Fireworks and sparkler tunnel for a grand entry.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-engagement-entry-staircase-descent', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Grand Staircase Descent', description: 'Staged staircase descent entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 8000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-engagement-entry-vintage-car', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Vintage Car', description: 'Vintage car arrival for the couple entry.', imageUrl: '', packageLevel: 'gold', price: 15000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-engagement-entry-carriage', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Carriage', description: 'Traditional carriage entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'per event', displayOrder: 7 }),
  item({ id: 'dec-engagement-entry-floral-canopy', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Floral Canopy Walk', description: 'Walk-through floral canopy entry setup.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'dec-engagement-entry-welcome-bouquet', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-entry-engagement', name: 'Welcome Bouquet', description: 'Fresh flower bouquet to welcome the couple.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 9 }),

  // Reception decoration - Venue Decoration
  item({ id: 'dec-reception-venue-name-plate', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Entrance Gate Name Plate Decoration', description: 'Personalised name plate decoration at the entrance gate.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-reception-venue-entrance-passage', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Entrance Passage Decoration', description: 'Decorated walkway leading up to the venue.', imageUrl: '', packageLevel: 'normal', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-reception-venue-entrance-door', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Venue Entrance Door Decoration', description: 'Decoration for the main venue entrance door.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-reception-venue-photo-booth', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Photo Booth', description: 'Decorated photo booth setup for guests and memorable pictures.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-reception-venue-stage', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Stage Decoration', description: 'Customized stage setup for the reception.', imageUrl: '', packageLevel: 'gold', price: 28000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-reception-venue-special-garlands', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Special Garlands', description: 'Premium special garlands for the ceremony.', imageUrl: '', packageLevel: 'gold', price: 6000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-reception-venue-normal-garlands', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-venue-reception', name: 'Normal Garlands', description: 'Fresh flower garlands for the ceremony.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 7 }),

  // Reception decoration - Couple Entry Concept
  item({ id: 'dec-reception-entry-cloud-fog', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Dancing on a Cloud (Heavy Fog)', description: 'Heavy fog effect for a dramatic cloud-walk entry.', imageUrl: '', packageLevel: 'gold', price: 9000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-reception-entry-cold-pyros-sparklers', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Fog, Cold Pyros & Sparklers', description: 'Fog with cold pyro and sparkler effects for the entry.', imageUrl: '', packageLevel: 'gold', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-reception-entry-smoke-bombs', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Smoke Bombs', description: 'Coloured smoke bomb effect for the couple entry.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-reception-entry-fireworks-tunnel', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Fireworks & Sparkler Tunnels', description: 'Fireworks and sparkler tunnel for a grand entry.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-reception-entry-staircase-descent', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Grand Staircase Descent', description: 'Staged staircase descent entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 8000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-reception-entry-vintage-car', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Vintage Car', description: 'Vintage car arrival for the couple entry.', imageUrl: '', packageLevel: 'gold', price: 15000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-reception-entry-carriage', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Carriage', description: 'Traditional carriage entry for the couple.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'per event', displayOrder: 7 }),
  item({ id: 'dec-reception-entry-floral-canopy', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Floral Canopy Walk', description: 'Walk-through floral canopy entry setup.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'dec-reception-entry-welcome-bouquet', supportedEventTypes: ['reception'], categoryKey: 'decoration', groupId: 'dec-entry-reception', name: 'Welcome Bouquet', description: 'Fresh flower bouquet to welcome the couple.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 9 }),

  // Birthday decoration - Venue Decoration
  item({ id: 'dec-birthday-venue-name-plate', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-venue-birthday', name: 'Entrance Gate Name Plate Decoration', description: 'Personalised name plate decoration at the entrance gate.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-birthday-venue-entrance-passage', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-venue-birthday', name: 'Entrance Passage Decoration', description: 'Decorated walkway leading up to the venue.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-birthday-venue-entrance-door', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-venue-birthday', name: 'Venue Entrance Door Decoration', description: 'Decoration for the main venue entrance door.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-birthday-venue-photo-booth', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-venue-birthday', name: 'Photo Booth', description: 'Decorated photo booth setup for guests and memorable pictures.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-birthday-venue-stage', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-venue-birthday', name: 'Stage Decoration', description: 'Customized stage setup for the birthday celebration.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'per event', displayOrder: 5 }),

  // Birthday decoration - Entry Concept (same applicable entry-concept
  // options used elsewhere in the project - nothing invented for Birthday).
  item({ id: 'dec-birthday-entry-cloud-fog', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Dancing on a Cloud (Heavy Fog)', description: 'Heavy fog effect for a dramatic cloud-walk entry.', imageUrl: '', packageLevel: 'gold', price: 9000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-birthday-entry-cold-pyros-sparklers', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Fog, Cold Pyros & Sparklers', description: 'Fog with cold pyro and sparkler effects for the entry.', imageUrl: '', packageLevel: 'gold', price: 7000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-birthday-entry-smoke-bombs', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Smoke Bombs', description: 'Coloured smoke bomb effect for the entry.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-birthday-entry-fireworks-tunnel', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Fireworks & Sparkler Tunnels', description: 'Fireworks and sparkler tunnel for a grand entry.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-birthday-entry-staircase-descent', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Grand Staircase Descent', description: 'Staged staircase descent entry.', imageUrl: '', packageLevel: 'gold', price: 8000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'dec-birthday-entry-floral-canopy', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Floral Canopy Walk', description: 'Walk-through floral canopy entry setup.', imageUrl: '', packageLevel: 'gold', price: 10000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'dec-birthday-entry-welcome-bouquet', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-entry-birthday', name: 'Welcome Bouquet', description: 'Fresh flower bouquet to welcome the celebrant.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 7 }),

  // Anniversary decoration - Venue Decoration (no Entry Concept for Anniversary)
  item({ id: 'dec-anniversary-venue-name-plate', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-venue-anniversary', name: 'Entrance Gate Name Plate Decoration', description: 'Personalised name plate decoration at the entrance gate.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-anniversary-venue-entrance-passage', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-venue-anniversary', name: 'Entrance Passage Decoration', description: 'Decorated walkway leading up to the venue.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'dec-anniversary-venue-entrance-door', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-venue-anniversary', name: 'Venue Entrance Door Decoration', description: 'Decoration for the main venue entrance door.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'per event', displayOrder: 3 }),
  item({ id: 'dec-anniversary-venue-photo-booth', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-venue-anniversary', name: 'Photo Booth', description: 'Decorated photo booth setup for guests and memorable pictures.', imageUrl: '', packageLevel: 'normal', price: 5000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'dec-anniversary-venue-stage', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-venue-anniversary', name: 'Stage Decoration', description: 'Customized stage setup for the anniversary celebration.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'per event', displayOrder: 5 }),

  // Wedding photography - Deverakarya (home / ritual ceremony coverage)
  item({ id: 'photo-traditional-photo', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-deverakarya', name: 'Traditional Photography', description: 'Classic posed traditional photography for the Deverakarya rituals.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 1 }),
  item({ id: 'photo-candid-photo', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-deverakarya', name: 'Candid Photography', description: 'Storytelling candid photography coverage of the Deverakarya.', imageUrl: '', packageLevel: 'gold', price: 35000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 2 }),
  item({ id: 'photo-traditional-video', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-deverakarya', name: 'Traditional Videography', description: 'Classic full-ceremony traditional videography of the Deverakarya.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 3 }),
  item({ id: 'photo-candid-video', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-deverakarya', name: 'Candid Videography', description: 'Cinematic candid videography coverage of the Deverakarya.', imageUrl: '', packageLevel: 'gold', price: 40000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 4 }),
  item({ id: 'photo-deverakarya-drone', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-deverakarya', name: 'Drone Photography', description: '4K aerial drone coverage of the Deverakarya ceremony.', imageUrl: '', packageLevel: 'gold', price: 20000, unit: 'per event', displayOrder: 5 }),

  // Wedding photography - Wedding Hall (venue coverage and screens)
  item({ id: 'photo-drone', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Drone', description: '4K aerial drone coverage of the venue and celebrations.', imageUrl: '', packageLevel: 'gold', price: 20000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'photo-led-wall', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'LED Wall', description: 'Live LED screen stage backdrop display.', imageUrl: '', packageLevel: 'premium', price: 30000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'photo-hall-traditional-photo', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Traditional Photography', description: 'Classic posed traditional photography for the wedding hall reception.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 4 }),
  item({ id: 'photo-hall-candid-photo', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Candid Photography', description: 'Storytelling candid photography coverage of the wedding hall reception.', imageUrl: '', packageLevel: 'gold', price: 35000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 5 }),
  item({ id: 'photo-hall-traditional-video', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Traditional Videography', description: 'Classic full-event traditional videography of the wedding hall reception.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 6 }),
  item({ id: 'photo-hall-candid-video', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Candid Videography', description: 'Cinematic candid videography coverage of the wedding hall reception.', imageUrl: '', packageLevel: 'gold', price: 40000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 7 }),
  item({ id: 'photo-wedding-live-streaming', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-wedding-hall', name: 'Live Streaming', description: 'Live stream the wedding for guests who cannot attend.', imageUrl: '', packageLevel: 'premium', price: 15000, unit: 'per event', displayOrder: 3 }),

  // Pre-Wedding Shoot - duration is picked first (max 1 of these two), which
  // unlocks the service checklist below it.
  item({ id: 'photo-prewedding-1-day', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-prewedding-duration', name: '1 Day', description: 'Pre-wedding shoot scheduled across a single day.', imageUrl: '', packageLevel: 'normal', price: 0, unit: 'shoot', metadata: { days: 1 }, displayOrder: 1 }),
  item({ id: 'photo-prewedding-2-day', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-prewedding-duration', name: '2 Days', description: 'Pre-wedding shoot scheduled across two days.', imageUrl: '', packageLevel: 'gold', price: 0, unit: 'shoot', metadata: { days: 2 }, displayOrder: 2 }),

  item({ id: 'photo-prewedding-photographer', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-prewedding-services', name: 'Photographer', description: 'Dedicated photographer for the pre-wedding shoot.', imageUrl: '', packageLevel: 'normal', price: 20000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'photo-prewedding-cinematic-video', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-prewedding-services', name: 'Cinematic Video', description: 'Cinematic video coverage of the pre-wedding shoot.', imageUrl: '', packageLevel: 'gold', price: 30000, unit: 'per event', displayOrder: 2 }),
  item({ id: 'photo-prewedding-drone', supportedEventTypes: ['wedding'], categoryKey: 'photography', groupId: 'photo-prewedding-services', name: 'Drone', description: '4K aerial drone coverage for the pre-wedding shoot.', imageUrl: '', packageLevel: 'gold', price: 15000, unit: 'per event', displayOrder: 3 }),

  // Photography for every other (non-Wedding) event type - single shared
  // group, exactly five options: Traditional/Candid Photography, Traditional/
  // Candid Videography and Drone.
  item({ id: 'photo-other-traditional-photo', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Traditional Photography', description: 'Classic posed traditional photography coverage.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 1 }),
  item({ id: 'photo-other-candid-photo', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Candid Photography', description: 'Storytelling candid photography coverage.', imageUrl: '', packageLevel: 'gold', price: 35000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 2 }),
  item({ id: 'photo-other-traditional-video', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Traditional Videography', description: 'Classic full-event traditional videography.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 3 }),
  item({ id: 'photo-other-candid-video', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Candid Videography', description: 'Cinematic candid videography coverage.', imageUrl: '', packageLevel: 'gold', price: 40000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 4 }),
  item({ id: 'photo-other-drone', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Drone', description: '4K aerial drone coverage of the venue and celebrations.', imageUrl: '', packageLevel: 'gold', price: 20000, unit: 'per event', displayOrder: 5 }),

  // Catering - Wedding menu (unchanged, wedding-only)
  item({ id: 'cater-wd-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-welcome-drinks', name: 'Tender Coconut Water', description: 'Fresh tender coconut water welcome drink.', imageUrl: '', packageLevel: 'normal', price: 40, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-wd-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-welcome-drinks', name: 'Fresh Fruit Punch', description: 'Seasonal fresh fruit punch mocktail.', imageUrl: '', packageLevel: 'standard', price: 45, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-wd-03', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-welcome-drinks', name: 'Rose Milk Sharbat', description: 'Chilled rose milk sharbat welcome drink.', imageUrl: '', packageLevel: 'gold', price: 50, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-start-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-starters', name: 'Veg Manchurian', description: 'Crispy vegetable Manchurian starter.', imageUrl: '', packageLevel: 'normal', price: 60, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-start-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-starters', name: 'Paneer 65', description: 'Spiced fried paneer starter.', imageUrl: '', packageLevel: 'standard', price: 70, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-start-03', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-starters', name: 'Mushroom Chilli', description: 'Indo-Chinese chilli mushroom starter.', imageUrl: '', packageLevel: 'gold', price: 75, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-start-04', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-starters', name: 'Corn Cheese Balls', description: 'Crispy corn and cheese fried balls.', imageUrl: '', packageLevel: 'gold', price: 80, unit: 'per guest', displayOrder: 4 }),
  item({ id: 'cater-main-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-main-course', name: 'Sambar', description: 'Traditional South Indian sambar.', imageUrl: '', packageLevel: 'normal', price: 35, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-main-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-main-course', name: 'Rasam', description: 'Classic tangy South Indian rasam.', imageUrl: '', packageLevel: 'normal', price: 30, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-main-03', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-main-course', name: 'Paneer Butter Masala', description: 'Rich North Indian paneer butter masala.', imageUrl: '', packageLevel: 'gold', price: 65, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-rice-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-rice', name: 'Steamed Rice', description: 'Plain steamed rice.', imageUrl: '', packageLevel: 'normal', price: 20, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-rice-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-rice', name: 'Curd Rice', description: 'Traditional South Indian curd rice.', imageUrl: '', packageLevel: 'normal', price: 22, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-rice-03', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-rice', name: 'Bisi Bele Bath', description: 'Karnataka-style spiced rice dish.', imageUrl: '', packageLevel: 'standard', price: 40, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-bread-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-breads', name: 'Chapati', description: 'Soft wheat chapati.', imageUrl: '', packageLevel: 'normal', price: 15, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-bread-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-breads', name: 'Poori', description: 'Deep-fried puffed bread.', imageUrl: '', packageLevel: 'standard', price: 20, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-curry-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-curries', name: 'Mixed Vegetable Kurma', description: 'Coconut-based mixed vegetable kurma.', imageUrl: '', packageLevel: 'normal', price: 45, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-live-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-live-counters', name: 'Live Dosa Counter', description: 'Freshly made dosa served live on request.', imageUrl: '', packageLevel: 'gold', price: 90, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-live-02', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-live-counters', name: 'Live Chaat Counter', description: 'Live chaat station with regional favorites.', imageUrl: '', packageLevel: 'premium', price: 85, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-dessert-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-desserts', name: 'Payasam', description: 'Traditional South Indian payasam.', imageUrl: '', packageLevel: 'normal', price: 35, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-icecream-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-ice-cream', name: 'Ice Cream Counter', description: 'Live ice cream serving counter, 3 flavors.', imageUrl: '', packageLevel: 'standard', price: 40, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-bev-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-beverages', name: 'Filter Coffee & Tea', description: 'Traditional South Indian filter coffee and tea service.', imageUrl: '', packageLevel: 'normal', price: 25, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-special-01', supportedEventTypes: ['wedding'], categoryKey: 'catering', groupId: 'cat-special-items', name: 'Banana Leaf Service', description: 'Full traditional banana leaf serving experience.', imageUrl: '', packageLevel: 'standard', price: 30, unit: 'per guest', displayOrder: 1 }),

  // Catering - shared general catering (all non-wedding events)
  item({ id: 'cater-gen-01', supportedEventTypes: ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'], categoryKey: 'catering', groupId: 'cat-general', name: 'Standard Buffet Catering', description: 'Multi-item vegetarian buffet spread.', imageUrl: '', packageLevel: 'normal', price: 350, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-gen-02', supportedEventTypes: ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function', 'other_events'], categoryKey: 'catering', groupId: 'cat-general', name: 'Premium Buffet Catering', description: 'Extended multi-cuisine buffet with live counters.', imageUrl: '', packageLevel: 'gold', price: 550, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-gen-03', supportedEventTypes: ['birthday', 'anniversary'], categoryKey: 'catering', groupId: 'cat-general', name: 'Birthday Cake & Dessert Table', description: 'Custom cake and dessert table for the celebration.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'setup', displayOrder: 3 }),
  item({ id: 'cater-bar-01', supportedEventTypes: ['bachelor_party'], categoryKey: 'catering', groupId: 'cat-general', name: 'Cocktail & Bar Snacks', description: 'Bar snacks and mixers spread to go with the bar setup.', imageUrl: '', packageLevel: 'standard', price: 400, unit: 'per guest', displayOrder: 4 }),
  item({ id: 'cater-traditional-01', supportedEventTypes: ['housewarming', 'traditional_home_function', 'haldi_function', 'shrimantha_karya', 'half_saree_function'], categoryKey: 'catering', groupId: 'cat-general', name: 'Traditional Vegetarian Feast', description: 'Full traditional South Indian vegetarian feast for the ceremony.', imageUrl: '', packageLevel: 'standard', price: 320, unit: 'per guest', displayOrder: 5 }),

  // Catering - Breakfast menu (Wedding, Engagement, Reception, Housewarming, Traditional Home Function)
  item({ id: 'cater-bfast-01', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Idli, Vada & Sambar', description: 'Classic South Indian breakfast plate with coconut chutney.', imageUrl: '', packageLevel: 'normal', price: 60, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-bfast-02', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Rava Upma', description: 'Semolina upma tempered with mustard, curry leaves and cashews.', imageUrl: '', packageLevel: 'normal', price: 45, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-bfast-03', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Ven Pongal', description: 'Traditional rice and lentil pongal with ghee and cashews.', imageUrl: '', packageLevel: 'standard', price: 55, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-bfast-04', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Mysore Masala Dosa', description: 'Crisp dosa with spiced red chutney and potato masala.', imageUrl: '', packageLevel: 'standard', price: 70, unit: 'per guest', displayOrder: 4 }),
  item({ id: 'cater-bfast-05', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Breakfast Filter Coffee & Tea', description: 'Freshly brewed South Indian filter coffee and tea service.', imageUrl: '', packageLevel: 'normal', price: 25, unit: 'per guest', displayOrder: 5 }),

  // Catering - Snacks (available under both Lunch and Dinner, for every event type)


  // Additional Services - Wedding
  item({ id: 'addon-bridal-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Bridal Makeup', description: 'HD bridal makeup and hair styling.', imageUrl: '', packageLevel: 'gold', price: 25000, unit: 'per session', displayOrder: 1 }),
  item({ id: 'addon-groom-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Groom Makeup', description: 'Groom styling and grooming session.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'per session', displayOrder: 2 }),
  item({ id: 'addon-airbrush-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Airbrush Makeup', description: 'Premium airbrush bridal makeup upgrade.', imageUrl: '', packageLevel: 'luxury', price: 40000, unit: 'per session', displayOrder: 3 }),
  item({ id: 'addon-mehendi', supportedEventTypes: ['wedding', 'haldi_function', 'bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Mehendi', description: 'Professional mehendi artist.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per session', displayOrder: 4 }),
  item({ id: 'addon-music-dj', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'additional_services', groupId: 'addon-services', name: 'Music / DJ', description: 'Live DJ and sound setup for the event.', imageUrl: '', packageLevel: 'standard', price: 30000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'addon-nadaswara', supportedEventTypes: ['wedding', 'haldi_function', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Nadaswara', description: 'Traditional Nadaswaram performance troupe.', imageUrl: '', packageLevel: 'standard', price: 20000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'addon-lighting', supportedEventTypes: ['wedding', 'anniversary', 'get_together', 'other_events'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Lighting', description: 'Ambient event lighting design.', imageUrl: '', packageLevel: 'standard', price: 25000, unit: 'setup', displayOrder: 7 }),
  item({ id: 'addon-led-wall', supportedEventTypes: ['wedding', 'engagement', 'corporate_event', 'reception'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'LED Wall', description: 'Large-format LED wall display for the stage.', imageUrl: '', packageLevel: 'premium', price: 30000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'addon-invitations', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Invitation Cards', description: 'Custom-designed printed invitations.', imageUrl: '', packageLevel: 'standard', price: 100, unit: 'per card', quantityMode: 'stepper', displayOrder: 9 }),
  item({ id: 'addon-return-gifts', supportedEventTypes: ['wedding', 'birthday', 'reception', 'anniversary', 'get_together', 'housewarming', 'haldi_function', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Return Gifts', description: 'Curated return gifts for guests.', imageUrl: '', packageLevel: 'standard', price: 150, unit: 'per guest', quantityMode: 'stepper', displayOrder: 10 }),
  item({ id: 'addon-transportation', supportedEventTypes: ['wedding', 'bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Transportation', description: 'Guest and family transportation coordination.', imageUrl: '', packageLevel: 'gold', price: 25000, unit: 'per event', displayOrder: 11 }),
  item({ id: 'addon-accommodation', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Guest Accommodation', description: 'Guest accommodation booking coordination.', imageUrl: '', packageLevel: 'gold', price: 5000, unit: 'per room', quantityMode: 'stepper', displayOrder: 12 }),
  item({ id: 'addon-coordination', supportedEventTypes: ['wedding', 'corporate_event', 'reception', 'other_events'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Event Coordination', description: 'Dedicated day-of event coordinator and team.', imageUrl: '', packageLevel: 'premium', price: 35000, unit: 'per event', displayOrder: 13 }),

  // Additional Services - Birthday / Engagement / Corporate
  item({ id: 'addon-kids-entertainment', supportedEventTypes: ['birthday'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Kids Entertainment', description: 'Games, activities and entertainers for young guests.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'per event', displayOrder: 14 }),
  item({ id: 'addon-magician', supportedEventTypes: ['birthday'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Magician', description: 'Live magic show for the birthday celebration.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per event', displayOrder: 15 }),
  item({ id: 'addon-anchor', supportedEventTypes: ['birthday', 'corporate_event', 'reception', 'anniversary'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Anchor / Host', description: 'Professional event anchor or emcee.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'per event', displayOrder: 16 }),
  item({ id: 'addon-makeup-general', supportedEventTypes: ['engagement', 'anniversary'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Makeup', description: 'Professional makeup and styling session.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per session', displayOrder: 17 }),
  item({ id: 'addon-audio-system', supportedEventTypes: ['corporate_event'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Audio System', description: 'Professional PA and audio setup for the venue.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per event', displayOrder: 18 }),
  item({ id: 'addon-projector', supportedEventTypes: ['corporate_event'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Projector', description: 'Projector and screen setup for presentations.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'per event', displayOrder: 19 }),
  item({ id: 'addon-conference-seating', supportedEventTypes: ['corporate_event'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Conference Seating', description: 'Rows or roundtable seating arrangement for delegates.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'setup', displayOrder: 20 }),
  item({ id: 'addon-registration-desk', supportedEventTypes: ['corporate_event'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Registration Desk', description: 'Branded registration and check-in desk setup.', imageUrl: '', packageLevel: 'standard', price: 6000, unit: 'setup', displayOrder: 21 }),

  // Additional Services - Housewarming / Haldi / Traditional Home Function / Bachelor Party / Get Together
  item({ id: 'addon-purohit', supportedEventTypes: ['wedding', 'housewarming', 'haldi_function', 'traditional_home_function', 'shrimantha_karya', 'half_saree_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Purohit / Pandit Services', description: 'Experienced purohit for rituals, samagri and muhurtham guidance.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per event', displayOrder: 22 }),
  item({ id: 'addon-bartender', supportedEventTypes: ['bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Bartender Service', description: 'Professional bartender and mixology setup.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'per event', displayOrder: 23 }),
  item({ id: 'addon-games-entertainment', supportedEventTypes: ['get_together', 'bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Games & Entertainment', description: 'Party games, activities and entertainment coordination.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'per event', displayOrder: 24 }),
];

export const MOCK_PACKAGE_DEFINITIONS: PackageDefinition[] = [
  { id: 'pkg-normal', eventTypeId: 'wedding', name: 'Normal Wedding Package', tagline: 'Simple & Elegant', packageLevel: 'normal', basePrice: 250000, guestCapacity: 200, description: 'Essential decor and catering for an intimate wedding.', isPopular: false },
  { id: 'pkg-standard', eventTypeId: 'wedding', name: 'Standard Wedding Package', tagline: 'Thoughtful Essentials', packageLevel: 'standard', basePrice: 400000, guestCapacity: 300, description: 'A well-rounded package covering all core wedding needs.', isPopular: false },
  { id: 'pkg-silver-tier', eventTypeId: 'wedding', name: 'Silver Wedding Package', tagline: 'Elegant & Traditional', packageLevel: 'silver', basePrice: 550000, guestCapacity: 400, description: 'Traditional decor and a full catering menu.', isPopular: false },
  { id: 'pkg-gold-tier', eventTypeId: 'wedding', name: 'Gold Wedding Package', tagline: 'Our Most Popular Choice', packageLevel: 'gold', basePrice: 800000, guestCapacity: 600, description: 'Comprehensive luxury setup with live catering counters.', isPopular: true },
  { id: 'pkg-premium-tier', eventTypeId: 'wedding', name: 'Premium Wedding Package', tagline: 'Opulent Grandeur', packageLevel: 'premium', basePrice: 1300000, guestCapacity: 1000, description: 'Platinum decor and extensive add-ons.', isPopular: false },
  { id: 'pkg-luxury-tier', eventTypeId: 'wedding', name: 'Luxury Wedding Package', tagline: 'Regal Palace Level', packageLevel: 'luxury', basePrice: 2200000, guestCapacity: 1500, description: 'Bespoke palace-level celebration with every premium inclusion.', isPopular: false },
];

function inc(packageId: string, catalogItemId: string, quantity: number = 1): PackageIncludedItem {
  return { packageId, catalogItemId, quantity };
}

// Photography is not offered for Wedding events and Venue is not offered at all,
// so no photo-* or venue-* items are included here.
export const MOCK_PACKAGE_INCLUDED_ITEMS: PackageIncludedItem[] = [
  inc('pkg-normal', 'dec-silver'), inc('pkg-normal', 'cater-wd-01'),
  inc('pkg-standard', 'dec-silver'), inc('pkg-standard', 'cater-wd-02'),
  inc('pkg-silver-tier', 'dec-silver'), inc('pkg-silver-tier', 'cater-wd-02'),
  inc('pkg-gold-tier', 'dec-gold'), inc('pkg-gold-tier', 'cater-wd-03'), inc('pkg-gold-tier', 'cater-live-01'),
  inc('pkg-premium-tier', 'dec-platinum'), inc('pkg-premium-tier', 'cater-wd-03'), inc('pkg-premium-tier', 'cater-live-01'), inc('pkg-premium-tier', 'cater-live-02'),
  inc('pkg-luxury-tier', 'dec-platinum'), inc('pkg-luxury-tier', 'cater-wd-03'), inc('pkg-luxury-tier', 'cater-live-01'), inc('pkg-luxury-tier', 'cater-live-02'),
];

export const MOCK_PACKAGE_GROUP_LIMITS: PackageGroupLimit[] = [
  { packageId: 'pkg-normal', groupId: 'cat-starters', maxSelections: 2, freeIncludedCount: 2 },
  { packageId: 'pkg-standard', groupId: 'cat-starters', maxSelections: 2, freeIncludedCount: 2 },
  { packageId: 'pkg-silver-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 2 },
  { packageId: 'pkg-gold-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
  { packageId: 'pkg-premium-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
  { packageId: 'pkg-luxury-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
];
