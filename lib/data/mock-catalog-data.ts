/**
 * Local fallback data for the Event Builder catalog - lets the whole builder flow
 * (event selection, decoration limits, replace/upgrade modals, catering approval,
 * venue, cart) be reviewed in the browser before the Supabase migrations/seed are
 * run. Mirrors supabase/seed_event_builder.sql exactly - once the real tables have
 * rows, the data-access functions in this folder prefer Supabase and only fall back
 * to this file when a table is missing or genuinely empty.
 *
 * All 12 event types are catalog-ready with real Indian event-planning categories
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
  { id: 'engagement', name: 'Engagement', shortDescription: 'Ring ceremony décor, stage design and catering for your engagement.', imageUrl: '', isCatalogReady: true, displayOrder: 2, active: true },
  { id: 'reception', name: 'Reception', shortDescription: 'Elegant reception stage, catering and entertainment.', imageUrl: '', isCatalogReady: true, displayOrder: 3, active: true },
  { id: 'birthday', name: 'Birthday', shortDescription: 'Themed birthday celebrations for every age and milestone.', imageUrl: '', isCatalogReady: true, displayOrder: 4, active: true },
  { id: 'anniversary', name: 'Anniversary', shortDescription: 'Elegant anniversary celebrations, big or intimate.', imageUrl: '', isCatalogReady: true, displayOrder: 5, active: true },
  { id: 'get_together', name: 'Get Together', shortDescription: 'Casual and semi-formal family or friends get-togethers.', imageUrl: '', isCatalogReady: true, displayOrder: 6, active: true },
  { id: 'bachelor_party', name: 'Bachelor Party', shortDescription: 'Fun, high-energy bachelor party planning and coordination.', imageUrl: '', isCatalogReady: true, displayOrder: 7, active: true },
  { id: 'housewarming', name: 'Housewarming', shortDescription: 'Griha Pravesh ceremonies handled from rituals to hospitality.', imageUrl: '', isCatalogReady: true, displayOrder: 8, active: true },
  { id: 'haldi_function', name: 'Haldi Function', shortDescription: 'Vibrant Haldi decor, seating and catering setup.', imageUrl: '', isCatalogReady: true, displayOrder: 9, active: true },
  { id: 'corporate_event', name: 'Corporate Event', shortDescription: 'Conferences, product launches and corporate celebrations.', imageUrl: '', isCatalogReady: true, displayOrder: 10, active: true },
  { id: 'traditional_home_function', name: 'Traditional Home Function', shortDescription: 'Naming ceremonies, seemantham and other home rituals.', imageUrl: '', isCatalogReady: true, displayOrder: 11, active: true },
  { id: 'other_events', name: 'Other Events', shortDescription: 'Reunions, custom celebrations and everything in between.', imageUrl: '', isCatalogReady: true, displayOrder: 12, active: true },
];

export const MOCK_PACKAGE_LEVELS: PackageLevel[] = [
  { id: 'normal', name: 'Normal', rank: 0, displayOrder: 1, active: true },
  { id: 'standard', name: 'Standard', rank: 1, displayOrder: 2, active: true },
  { id: 'silver', name: 'Silver', rank: 2, displayOrder: 3, active: true },
  { id: 'gold', name: 'Gold', rank: 3, displayOrder: 4, active: true },
  { id: 'premium', name: 'Premium', rank: 4, displayOrder: 5, active: true },
  { id: 'luxury', name: 'Luxury', rank: 5, displayOrder: 6, active: true },
];

const ALL_EVENT_TYPES = [
  'wedding', 'engagement', 'reception', 'birthday', 'anniversary', 'get_together',
  'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event',
  'traditional_home_function', 'other_events',
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

/** Photography & Videography is not offered for Wedding events. */
export const PHOTOGRAPHY_EVENT_TYPES = ALL_EVENT_TYPES.filter((t) => t !== 'wedding');

export const MOCK_CATALOG_GROUPS: CatalogGroup[] = [
  group('dec-stage', ['wedding'], 'decoration', 'Stage Decoration', 2, 1, false, null, 1),
  group('dec-mandap', ['wedding'], 'decoration', 'Mandap Decoration', 2, 1, false, null, 2),
  group('dec-entrance', ['wedding', 'birthday', 'engagement', 'reception', 'anniversary', 'get_together', 'housewarming', 'traditional_home_function'], 'decoration', 'Entrance Decoration', 1, 1, false, null, 3),
  group('dec-pathway', ['wedding'], 'decoration', 'Pathway Decoration', 1, 1, false, null, 4),
  group('dec-passage', ['wedding'], 'decoration', 'Passage Decoration', 1, 1, false, null, 5),
  group('dec-garland', ['wedding', 'haldi_function'], 'decoration', 'Garland Selection', 3, 1, false, null, 6),
  group('dec-nadaswara', ['wedding', 'haldi_function', 'traditional_home_function'], 'decoration', 'Nadaswara', 1, 1, false, null, 7),
  group('dec-house', ['wedding', 'housewarming', 'traditional_home_function'], 'decoration', 'House Decoration', 2, 1, false, null, 8),
  group('dec-main-door', ['wedding', 'housewarming', 'traditional_home_function'], 'decoration', 'Main Door Decoration', 1, 1, false, null, 9),
  group('dec-haldi', ['wedding', 'haldi_function'], 'decoration', 'Haldi Decoration', 1, 1, false, null, 10),
  group('dec-reception', ['wedding', 'reception'], 'decoration', 'Reception Decoration', 2, 1, false, null, 11),
  group('dec-traditional-home', ['wedding', 'housewarming', 'traditional_home_function'], 'decoration', 'Traditional Home Decoration', 1, 1, false, null, 12),
  group('dec-front-canopy', ['wedding', 'housewarming', 'traditional_home_function'], 'decoration', 'Front Canopy / Chapra Decoration', 1, 1, false, null, 13),
  group('dec-bridal-room', ['wedding'], 'decoration', 'Bridal Room Decoration', 1, 1, false, null, 14),
  group('dec-birthday-stage', ['birthday'], 'decoration', 'Birthday Stage Decoration', 1, 1, false, null, 15),
  group('dec-balloon', ['birthday', 'get_together', 'bachelor_party'], 'decoration', 'Balloon Decoration', 1, 1, false, null, 16),
  group('dec-theme', ['birthday', 'get_together', 'bachelor_party', 'other_events'], 'decoration', 'Theme Decoration', 1, 1, false, null, 17),
  group('dec-cake-table', ['birthday', 'anniversary'], 'decoration', 'Cake Table Decoration', 1, 1, false, null, 18),
  group('dec-engagement-stage', ['engagement'], 'decoration', 'Engagement Stage Decoration', 1, 1, false, null, 19),
  group('dec-ring-ceremony', ['engagement'], 'decoration', 'Ring Ceremony Setup', 1, 1, false, null, 20),
  group('dec-floral', ['engagement', 'anniversary'], 'decoration', 'Floral Decoration', 1, 1, false, null, 21),
  group('dec-corporate-stage', ['corporate_event'], 'decoration', 'Corporate Stage', 1, 1, false, null, 22),
  group('dec-branding', ['corporate_event'], 'decoration', 'Branding Setup', 1, 1, false, null, 23),
  group('dec-candlelit-dinner', ['anniversary'], 'decoration', 'Candlelit Dinner Setup', 1, 1, false, null, 24),
  group('dec-griha-pravesh', ['housewarming'], 'decoration', 'Griha Pravesh Pooja Decoration', 1, 1, false, null, 25),
  group('dec-cradle-ceremony', ['traditional_home_function'], 'decoration', 'Cradle Ceremony Decoration', 1, 1, false, null, 26),
  group('dec-bar-lounge', ['bachelor_party'], 'decoration', 'Bar / Lounge Decoration', 1, 1, false, null, 27),
  group('dec-general', ['other_events'], 'decoration', 'Event Decoration', 1, 1, false, null, 28),

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
  group('cat-general', ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'other_events'], 'catering', 'Catering', 1, 1, false, null, 12, ['lunch', 'dinner']),
  group('cat-breakfast', BREAKFAST_EVENT_TYPES, 'catering', 'Breakfast', null, 0, false, null, 13, ['breakfast']),
  group('cat-snacks', ALL_EVENT_TYPES, 'catering', 'Snacks', null, 0, false, null, 14, ['lunch', 'dinner']),

  // Photography is not offered for Wedding events - see PHOTOGRAPHY_EVENT_TYPES below.
  group('photo-services', PHOTOGRAPHY_EVENT_TYPES, 'photography', 'Photography & Videography', null, 0, false, null, 1),
  group('venue-options', ['wedding', 'reception'], 'venue', 'Venue', 1, 0, false, null, 1),
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
  // Decoration - Wedding
  item({ id: 'dec-stage-01', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-stage', name: 'Classic Floral Stage', description: 'Fresh marigold and jasmine stage backdrop with brass lamps.', imageUrl: '', packageLevel: 'standard', price: 45000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-stage-02', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-stage', name: 'Royal Brass Mandapam Stage', description: 'Grand brass-themed stage with layered floral drape and lighting.', imageUrl: '', packageLevel: 'gold', price: 95000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-stage-03', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-stage', name: 'Luxury Crystal & Floral Stage', description: 'Premium crystal drop backdrop with imported floral arrangement.', imageUrl: '', packageLevel: 'luxury', price: 175000, unit: 'setup', displayOrder: 3 }),
  item({ id: 'dec-mandap-01', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-mandap', name: 'Traditional Chepparam Mandap', description: 'Authentic temple-style mandap backdrop with golden drapes.', imageUrl: '', packageLevel: 'standard', price: 55000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-mandap-02', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-mandap', name: 'Saptapadi Royal Mandap', description: 'Fresh jasmine and lotus royal brass mandapam.', imageUrl: '', packageLevel: 'gold', price: 120000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-entrance-01', supportedEventTypes: ['wedding', 'birthday', 'engagement', 'reception', 'anniversary', 'get_together', 'housewarming', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-entrance', name: 'Floral Arch Entrance', description: 'Marigold and rose arch with hanging bells.', imageUrl: '', packageLevel: 'standard', price: 18000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-entrance-02', supportedEventTypes: ['wedding', 'engagement', 'reception', 'anniversary'], categoryKey: 'decoration', groupId: 'dec-entrance', name: 'Grand Welcome Entrance', description: 'Illuminated floral entrance with traditional welcome signage.', imageUrl: '', packageLevel: 'premium', price: 38000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-pathway-01', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-pathway', name: 'Petal Pathway', description: 'Rose petal scattered aisle with candle lining.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-pathway-02', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-pathway', name: 'Illuminated Grand Pathway', description: 'LED-lit walkway with floral garlands on both sides.', imageUrl: '', packageLevel: 'gold', price: 28000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-passage-01', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-passage', name: 'Traditional Passage Decor', description: 'Coconut leaf and floral passage arrangement.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-passage-02', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-passage', name: 'Premium Floral Passage', description: 'Layered floral passage with hanging lanterns.', imageUrl: '', packageLevel: 'premium', price: 24000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-garland-01', supportedEventTypes: ['wedding', 'haldi_function'], categoryKey: 'decoration', groupId: 'dec-garland', name: 'Classic Rose Garlands', description: 'Fresh rose garlands for the couple.', imageUrl: '', packageLevel: 'normal', price: 3000, unit: 'pair', quantityMode: 'stepper', displayOrder: 1 }),
  item({ id: 'dec-garland-02', supportedEventTypes: ['wedding', 'haldi_function'], categoryKey: 'decoration', groupId: 'dec-garland', name: 'Jasmine & Marigold Garlands', description: 'Fragrant mixed-flower garlands.', imageUrl: '', packageLevel: 'standard', price: 4500, unit: 'pair', quantityMode: 'stepper', displayOrder: 2 }),
  item({ id: 'dec-garland-03', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-garland', name: 'Designer Orchid Garlands', description: 'Imported orchid designer garlands.', imageUrl: '', packageLevel: 'luxury', price: 9000, unit: 'pair', quantityMode: 'stepper', displayOrder: 3 }),
  item({ id: 'dec-nadaswara-01', supportedEventTypes: ['wedding', 'haldi_function', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-nadaswara', name: 'Live Nadaswaram & Thavil Duo', description: 'Traditional auspicious live ensemble for muhurtham and home rituals.', imageUrl: '', packageLevel: 'standard', price: 25000, unit: 'per event', displayOrder: 1 }),
  item({ id: 'dec-house-01', supportedEventTypes: ['wedding', 'housewarming', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-house', name: 'Home Entrance Rangoli & Torans', description: 'Traditional rangoli with mango leaf torans.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-house-02', supportedEventTypes: ['wedding', 'housewarming'], categoryKey: 'decoration', groupId: 'dec-house', name: 'Complete Home Floral Decor', description: 'Full home floral and lighting decoration.', imageUrl: '', packageLevel: 'gold', price: 32000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-main-door-01', supportedEventTypes: ['wedding', 'housewarming', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-main-door', name: 'Traditional Main Door Toran', description: 'Mango leaf and marigold main door toran.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-haldi-01', supportedEventTypes: ['wedding', 'haldi_function'], categoryKey: 'decoration', groupId: 'dec-haldi', name: 'Yellow Marigold Haldi Setup', description: 'Bright marigold-themed Haldi seating with decorated urli and backdrop.', imageUrl: '', packageLevel: 'standard', price: 22000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-reception-01', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'decoration', groupId: 'dec-reception', name: 'Reception Stage & Table Decor', description: 'Elegant reception stage with themed table centerpieces.', imageUrl: '', packageLevel: 'standard', price: 60000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-reception-02', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'decoration', groupId: 'dec-reception', name: 'Luxury Reception Ambience', description: 'Premium lighting, drapery and floral reception setup.', imageUrl: '', packageLevel: 'luxury', price: 145000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-trad-home-01', supportedEventTypes: ['wedding', 'housewarming', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-traditional-home', name: 'Traditional Home Function Decor', description: 'Classic South Indian home ceremony decoration.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-canopy-01', supportedEventTypes: ['wedding', 'housewarming', 'traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-front-canopy', name: 'Front Canopy / Chapra Setup', description: 'Traditional decorated chapra canopy for the home front.', imageUrl: '', packageLevel: 'standard', price: 20000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-bridal-room-01', supportedEventTypes: ['wedding'], categoryKey: 'decoration', groupId: 'dec-bridal-room', name: 'Bridal Room Decoration', description: 'Floral and fairy-light bridal getting-ready room styling.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'setup', displayOrder: 1 }),

  // Decoration - Birthday / Engagement / Corporate
  item({ id: 'dec-bday-stage-01', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-birthday-stage', name: 'Themed Birthday Stage', description: 'Colourful themed stage backdrop for the birthday star.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-balloon-01', supportedEventTypes: ['birthday', 'get_together', 'bachelor_party'], categoryKey: 'decoration', groupId: 'dec-balloon', name: 'Balloon Arch & Backdrop', description: 'Full balloon arch with matching backdrop wall.', imageUrl: '', packageLevel: 'normal', price: 6000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-balloon-02', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-balloon', name: 'Premium Balloon Ceiling Decor', description: 'Ceiling-to-floor balloon decor with organic garlands.', imageUrl: '', packageLevel: 'gold', price: 18000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-theme-01', supportedEventTypes: ['birthday'], categoryKey: 'decoration', groupId: 'dec-theme', name: 'Kids Cartoon Theme Setup', description: 'Full cartoon-character themed decor and props.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-theme-02', supportedEventTypes: ['birthday', 'get_together', 'bachelor_party', 'other_events'], categoryKey: 'decoration', groupId: 'dec-theme', name: 'Custom Theme Setup', description: 'Custom themed backdrop, props and table decor for any occasion.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'setup', displayOrder: 2 }),
  item({ id: 'dec-cake-table-01', supportedEventTypes: ['birthday', 'anniversary'], categoryKey: 'decoration', groupId: 'dec-cake-table', name: 'Designer Cake Table', description: 'Styled cake table with floral and fairy-light accents.', imageUrl: '', packageLevel: 'normal', price: 4000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-eng-stage-01', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-engagement-stage', name: 'Elegant Engagement Stage', description: 'Sophisticated floral stage for the ring ceremony.', imageUrl: '', packageLevel: 'standard', price: 35000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-ring-ceremony-01', supportedEventTypes: ['engagement'], categoryKey: 'decoration', groupId: 'dec-ring-ceremony', name: 'Ring Platter & Ceremony Setup', description: 'Ring exchange platter, seating and ceremony styling.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-floral-01', supportedEventTypes: ['engagement', 'anniversary'], categoryKey: 'decoration', groupId: 'dec-floral', name: 'Premium Floral Decoration', description: 'Fresh flower decor across stage and seating areas.', imageUrl: '', packageLevel: 'gold', price: 40000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-corp-stage-01', supportedEventTypes: ['corporate_event'], categoryKey: 'decoration', groupId: 'dec-corporate-stage', name: 'Corporate Stage Setup', description: 'Clean professional stage setup for conferences and launches.', imageUrl: '', packageLevel: 'standard', price: 40000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-branding-01', supportedEventTypes: ['corporate_event'], categoryKey: 'decoration', groupId: 'dec-branding', name: 'Branding & Backdrop Setup', description: 'Company-branded backdrop, standees and signage.', imageUrl: '', packageLevel: 'standard', price: 20000, unit: 'setup', displayOrder: 1 }),

  // Decoration - Anniversary / Housewarming / Naming Ceremony / Bachelor Party / Other
  item({ id: 'dec-candlelit-01', supportedEventTypes: ['anniversary'], categoryKey: 'decoration', groupId: 'dec-candlelit-dinner', name: 'Romantic Candlelit Dinner Setup', description: 'Private candlelit table setup with florals and fairy lights.', imageUrl: '', packageLevel: 'gold', price: 20000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-griha-01', supportedEventTypes: ['housewarming'], categoryKey: 'decoration', groupId: 'dec-griha-pravesh', name: 'Griha Pravesh Pooja Setup', description: 'Kalash, floral curtain and pooja area decoration for the house-warming ritual.', imageUrl: '', packageLevel: 'standard', price: 14000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-cradle-01', supportedEventTypes: ['traditional_home_function'], categoryKey: 'decoration', groupId: 'dec-cradle-ceremony', name: 'Traditional Cradle Decoration', description: 'Floral cradle decor with traditional backdrop for the naming ceremony.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-bar-lounge-01', supportedEventTypes: ['bachelor_party'], categoryKey: 'decoration', groupId: 'dec-bar-lounge', name: 'Bar & Lounge Theme Decoration', description: 'Moody lounge lighting, signage and lounge seating decor.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'setup', displayOrder: 1 }),
  item({ id: 'dec-general-01', supportedEventTypes: ['other_events'], categoryKey: 'decoration', groupId: 'dec-general', name: 'Custom Event Decoration', description: 'Flexible decoration setup tailored to your specific event.', imageUrl: '', packageLevel: 'standard', price: 20000, unit: 'setup', displayOrder: 1 }),

  // Photography (not offered for Wedding events - see PHOTOGRAPHY_EVENT_TYPES)
  item({ id: 'photo-event-photo', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Event Photography', description: 'Full-day event photography coverage.', imageUrl: '', packageLevel: 'standard', price: 25000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 1 }),
  item({ id: 'photo-event-video', supportedEventTypes: PHOTOGRAPHY_EVENT_TYPES, categoryKey: 'photography', groupId: 'photo-services', name: 'Event Videography', description: 'Full-day event videography coverage.', imageUrl: '', packageLevel: 'standard', price: 25000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 2 }),
  item({ id: 'photo-candid-photo', supportedEventTypes: ['engagement', 'reception', 'anniversary'], categoryKey: 'photography', groupId: 'photo-services', name: 'Candid Photography', description: 'Storytelling candid photography coverage.', imageUrl: '', packageLevel: 'gold', price: 35000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 2 }, displayOrder: 3 }),
  item({ id: 'photo-live-streaming', supportedEventTypes: ['corporate_event', 'reception'], categoryKey: 'photography', groupId: 'photo-services', name: 'Live Streaming', description: 'Live stream the event for remote guests.', imageUrl: '', packageLevel: 'premium', price: 15000, unit: 'per event', displayOrder: 4 }),
  item({ id: 'photo-traditional-photo', supportedEventTypes: ['haldi_function', 'traditional_home_function', 'housewarming'], categoryKey: 'photography', groupId: 'photo-services', name: 'Traditional Photography', description: 'Classic posed traditional photography for rituals and ceremonies.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 5 }),
  item({ id: 'photo-traditional-video', supportedEventTypes: ['haldi_function', 'traditional_home_function', 'housewarming'], categoryKey: 'photography', groupId: 'photo-services', name: 'Traditional Videography', description: 'Classic full-ceremony traditional videography.', imageUrl: '', packageLevel: 'normal', price: 15000, unit: 'per event', quantityMode: 'team_size', metadata: { teamSize: 1 }, displayOrder: 6 }),
  item({ id: 'photo-instant', supportedEventTypes: ['birthday', 'get_together'], categoryKey: 'photography', groupId: 'photo-services', name: 'Instant Photography / Prints', description: 'On-the-spot instant photo printing booth for guests.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'per event', displayOrder: 7 }),

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
  item({ id: 'cater-gen-01', supportedEventTypes: ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'other_events'], categoryKey: 'catering', groupId: 'cat-general', name: 'Standard Buffet Catering', description: 'Multi-item vegetarian buffet spread.', imageUrl: '', packageLevel: 'normal', price: 350, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-gen-02', supportedEventTypes: ['engagement', 'reception', 'birthday', 'anniversary', 'get_together', 'bachelor_party', 'housewarming', 'haldi_function', 'corporate_event', 'traditional_home_function', 'other_events'], categoryKey: 'catering', groupId: 'cat-general', name: 'Premium Buffet Catering', description: 'Extended multi-cuisine buffet with live counters.', imageUrl: '', packageLevel: 'gold', price: 550, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-gen-03', supportedEventTypes: ['birthday', 'anniversary'], categoryKey: 'catering', groupId: 'cat-general', name: 'Birthday Cake & Dessert Table', description: 'Custom cake and dessert table for the celebration.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'setup', displayOrder: 3 }),
  item({ id: 'cater-bar-01', supportedEventTypes: ['bachelor_party'], categoryKey: 'catering', groupId: 'cat-general', name: 'Cocktail & Bar Snacks', description: 'Bar snacks and mixers spread to go with the bar setup.', imageUrl: '', packageLevel: 'standard', price: 400, unit: 'per guest', displayOrder: 4 }),
  item({ id: 'cater-traditional-01', supportedEventTypes: ['housewarming', 'traditional_home_function', 'haldi_function'], categoryKey: 'catering', groupId: 'cat-general', name: 'Traditional Vegetarian Feast', description: 'Full traditional South Indian vegetarian feast for the ceremony.', imageUrl: '', packageLevel: 'standard', price: 320, unit: 'per guest', displayOrder: 5 }),

  // Catering - Breakfast menu (Wedding, Engagement, Reception, Housewarming, Traditional Home Function)
  item({ id: 'cater-bfast-01', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Idli, Vada & Sambar', description: 'Classic South Indian breakfast plate with coconut chutney.', imageUrl: '', packageLevel: 'normal', price: 60, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-bfast-02', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Rava Upma', description: 'Semolina upma tempered with mustard, curry leaves and cashews.', imageUrl: '', packageLevel: 'normal', price: 45, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-bfast-03', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Ven Pongal', description: 'Traditional rice and lentil pongal with ghee and cashews.', imageUrl: '', packageLevel: 'standard', price: 55, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-bfast-04', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Mysore Masala Dosa', description: 'Crisp dosa with spiced red chutney and potato masala.', imageUrl: '', packageLevel: 'standard', price: 70, unit: 'per guest', displayOrder: 4 }),
  item({ id: 'cater-bfast-05', supportedEventTypes: BREAKFAST_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-breakfast', name: 'Breakfast Filter Coffee & Tea', description: 'Freshly brewed South Indian filter coffee and tea service.', imageUrl: '', packageLevel: 'normal', price: 25, unit: 'per guest', displayOrder: 5 }),

  // Catering - Snacks (available under both Lunch and Dinner, for every event type)
  item({ id: 'cater-snack-01', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-snacks', name: 'Assorted Namkeen Platter', description: 'Mixed savoury namkeen platter served between meal courses.', imageUrl: '', packageLevel: 'normal', price: 35, unit: 'per guest', displayOrder: 1 }),
  item({ id: 'cater-snack-02', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-snacks', name: 'Veg Samosa Platter', description: 'Crisp vegetable samosas served with mint and tamarind chutney.', imageUrl: '', packageLevel: 'normal', price: 40, unit: 'per guest', displayOrder: 2 }),
  item({ id: 'cater-snack-03', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-snacks', name: 'Bread Pakora Counter', description: 'Live-fried bread pakora snack counter.', imageUrl: '', packageLevel: 'standard', price: 50, unit: 'per guest', displayOrder: 3 }),
  item({ id: 'cater-snack-04', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'catering', groupId: 'cat-snacks', name: 'Evening Tea & Biscuits', description: 'Tea, coffee and assorted biscuits service.', imageUrl: '', packageLevel: 'normal', price: 20, unit: 'per guest', displayOrder: 4 }),

  // Venue - Wedding / Reception
  item({ id: 'venue-community-hall', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'venue', groupId: 'venue-options', name: 'Community Hall', description: 'Simple, well-equipped community hall for intimate celebrations.', imageUrl: '', packageLevel: 'normal', price: 60000, unit: 'per event', metadata: { capacity: 300, location: 'Davanagere', facilities: ['Parking', 'Basic AC', 'Stage'] }, displayOrder: 1 }),
  item({ id: 'venue-banquet', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'venue', groupId: 'venue-options', name: 'Banquet Hall', description: 'Air-conditioned banquet hall with in-house catering support.', imageUrl: '', packageLevel: 'standard', price: 150000, unit: 'per event', metadata: { capacity: 500, location: 'Davanagere', facilities: ['Parking', 'Full AC', 'Stage', 'Green Rooms'] }, displayOrder: 2 }),
  item({ id: 'venue-convention', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'venue', groupId: 'venue-options', name: 'Grand Convention Centre', description: 'Large convention centre suited for grand celebrations.', imageUrl: '', packageLevel: 'gold', price: 350000, unit: 'per event', metadata: { capacity: 1000, location: 'Davanagere', facilities: ['Valet Parking', 'Full AC', 'Stage', 'Multiple Halls'] }, displayOrder: 3 }),
  item({ id: 'venue-palace', supportedEventTypes: ['wedding', 'reception'], categoryKey: 'venue', groupId: 'venue-options', name: 'Royal Palace Resort', description: 'Premium resort-style destination venue.', imageUrl: '', packageLevel: 'luxury', price: 800000, unit: 'per event', metadata: { capacity: 1500, location: 'Davanagere Outskirts', facilities: ['Valet Parking', 'Full AC', 'Stage', 'Guest Rooms', 'Pool'] }, displayOrder: 4 }),

  // Additional Services - Wedding
  item({ id: 'addon-bridal-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Bridal Makeup', description: 'HD bridal makeup and hair styling.', imageUrl: '', packageLevel: 'gold', price: 25000, unit: 'per session', displayOrder: 1 }),
  item({ id: 'addon-groom-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Groom Makeup', description: 'Groom styling and grooming session.', imageUrl: '', packageLevel: 'standard', price: 10000, unit: 'per session', displayOrder: 2 }),
  item({ id: 'addon-airbrush-makeup', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Airbrush Makeup', description: 'Premium airbrush bridal makeup upgrade.', imageUrl: '', packageLevel: 'luxury', price: 40000, unit: 'per session', displayOrder: 3 }),
  item({ id: 'addon-mehendi', supportedEventTypes: ['wedding', 'haldi_function', 'bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Mehendi', description: 'Professional mehendi artist.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per session', displayOrder: 4 }),
  item({ id: 'addon-music-dj', supportedEventTypes: ALL_EVENT_TYPES, categoryKey: 'additional_services', groupId: 'addon-services', name: 'Music / DJ', description: 'Live DJ and sound setup for the event.', imageUrl: '', packageLevel: 'standard', price: 30000, unit: 'per event', displayOrder: 5 }),
  item({ id: 'addon-nadaswara', supportedEventTypes: ['wedding', 'haldi_function', 'traditional_home_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Nadaswara', description: 'Traditional Nadaswaram performance troupe.', imageUrl: '', packageLevel: 'standard', price: 20000, unit: 'per event', displayOrder: 6 }),
  item({ id: 'addon-lighting', supportedEventTypes: ['wedding', 'anniversary', 'get_together', 'other_events'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Lighting', description: 'Ambient event lighting design.', imageUrl: '', packageLevel: 'standard', price: 25000, unit: 'setup', displayOrder: 7 }),
  item({ id: 'addon-led-wall', supportedEventTypes: ['wedding', 'engagement', 'corporate_event', 'reception'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'LED Wall', description: 'Large-format LED wall display for the stage.', imageUrl: '', packageLevel: 'premium', price: 30000, unit: 'per event', displayOrder: 8 }),
  item({ id: 'addon-invitations', supportedEventTypes: ['wedding'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Invitation Cards', description: 'Custom-designed printed invitations.', imageUrl: '', packageLevel: 'standard', price: 100, unit: 'per card', quantityMode: 'stepper', displayOrder: 9 }),
  item({ id: 'addon-return-gifts', supportedEventTypes: ['wedding', 'birthday', 'reception', 'anniversary', 'get_together', 'housewarming', 'haldi_function', 'traditional_home_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Return Gifts', description: 'Curated return gifts for guests.', imageUrl: '', packageLevel: 'standard', price: 150, unit: 'per guest', quantityMode: 'stepper', displayOrder: 10 }),
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
  item({ id: 'addon-purohit', supportedEventTypes: ['wedding', 'housewarming', 'haldi_function', 'traditional_home_function'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Purohit / Pandit Services', description: 'Experienced purohit for rituals, samagri and muhurtham guidance.', imageUrl: '', packageLevel: 'standard', price: 15000, unit: 'per event', displayOrder: 22 }),
  item({ id: 'addon-bartender', supportedEventTypes: ['bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Bartender Service', description: 'Professional bartender and mixology setup.', imageUrl: '', packageLevel: 'standard', price: 12000, unit: 'per event', displayOrder: 23 }),
  item({ id: 'addon-games-entertainment', supportedEventTypes: ['get_together', 'bachelor_party'], categoryKey: 'additional_services', groupId: 'addon-services', name: 'Games & Entertainment', description: 'Party games, activities and entertainment coordination.', imageUrl: '', packageLevel: 'standard', price: 8000, unit: 'per event', displayOrder: 24 }),
];

export const MOCK_PACKAGE_DEFINITIONS: PackageDefinition[] = [
  { id: 'pkg-normal', eventTypeId: 'wedding', name: 'Normal Wedding Package', tagline: 'Simple & Elegant', packageLevel: 'normal', basePrice: 250000, guestCapacity: 200, description: 'Essential decor and catering for an intimate wedding.', isPopular: false },
  { id: 'pkg-standard', eventTypeId: 'wedding', name: 'Standard Wedding Package', tagline: 'Thoughtful Essentials', packageLevel: 'standard', basePrice: 400000, guestCapacity: 300, description: 'A well-rounded package covering all core wedding needs.', isPopular: false },
  { id: 'pkg-silver-tier', eventTypeId: 'wedding', name: 'Silver Wedding Package', tagline: 'Elegant & Traditional', packageLevel: 'silver', basePrice: 550000, guestCapacity: 400, description: 'Traditional decor and a full catering menu.', isPopular: false },
  { id: 'pkg-gold-tier', eventTypeId: 'wedding', name: 'Gold Wedding Package', tagline: 'Our Most Popular Choice', packageLevel: 'gold', basePrice: 800000, guestCapacity: 600, description: 'Comprehensive luxury setup with live catering counters.', isPopular: true },
  { id: 'pkg-premium-tier', eventTypeId: 'wedding', name: 'Premium Wedding Package', tagline: 'Opulent Grandeur', packageLevel: 'premium', basePrice: 1300000, guestCapacity: 1000, description: 'Premium venues and extensive decor add-ons.', isPopular: false },
  { id: 'pkg-luxury-tier', eventTypeId: 'wedding', name: 'Luxury Wedding Package', tagline: 'Regal Palace Level', packageLevel: 'luxury', basePrice: 2200000, guestCapacity: 1500, description: 'Bespoke palace-level celebration with every premium inclusion.', isPopular: false },
];

function inc(packageId: string, catalogItemId: string, quantity: number = 1): PackageIncludedItem {
  return { packageId, catalogItemId, quantity };
}

// Photography is not offered for Wedding events, so no photo-* items are included here.
export const MOCK_PACKAGE_INCLUDED_ITEMS: PackageIncludedItem[] = [
  inc('pkg-normal', 'dec-stage-01'), inc('pkg-normal', 'dec-mandap-01'), inc('pkg-normal', 'cater-wd-01'),
  inc('pkg-standard', 'dec-stage-01'), inc('pkg-standard', 'dec-mandap-01'), inc('pkg-standard', 'cater-wd-02'),
  inc('pkg-silver-tier', 'dec-stage-01'), inc('pkg-silver-tier', 'dec-mandap-01'), inc('pkg-silver-tier', 'dec-entrance-01'), inc('pkg-silver-tier', 'cater-wd-02'),
  inc('pkg-gold-tier', 'dec-stage-02'), inc('pkg-gold-tier', 'dec-mandap-02'), inc('pkg-gold-tier', 'dec-entrance-01'), inc('pkg-gold-tier', 'cater-wd-03'), inc('pkg-gold-tier', 'cater-live-01'),
  inc('pkg-premium-tier', 'dec-stage-02'), inc('pkg-premium-tier', 'dec-mandap-02'), inc('pkg-premium-tier', 'dec-entrance-02'), inc('pkg-premium-tier', 'cater-wd-03'), inc('pkg-premium-tier', 'cater-live-01'), inc('pkg-premium-tier', 'cater-live-02'),
  inc('pkg-luxury-tier', 'dec-stage-03'), inc('pkg-luxury-tier', 'dec-mandap-02'), inc('pkg-luxury-tier', 'dec-entrance-02'), inc('pkg-luxury-tier', 'cater-wd-03'), inc('pkg-luxury-tier', 'cater-live-01'), inc('pkg-luxury-tier', 'cater-live-02'), inc('pkg-luxury-tier', 'venue-palace'),
];

export const MOCK_PACKAGE_GROUP_LIMITS: PackageGroupLimit[] = [
  { packageId: 'pkg-normal', groupId: 'cat-starters', maxSelections: 2, freeIncludedCount: 2 },
  { packageId: 'pkg-standard', groupId: 'cat-starters', maxSelections: 2, freeIncludedCount: 2 },
  { packageId: 'pkg-silver-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 2 },
  { packageId: 'pkg-gold-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
  { packageId: 'pkg-premium-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
  { packageId: 'pkg-luxury-tier', groupId: 'cat-starters', maxSelections: 3, freeIncludedCount: 3 },
  { packageId: 'pkg-normal', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
  { packageId: 'pkg-standard', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
  { packageId: 'pkg-silver-tier', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
  { packageId: 'pkg-gold-tier', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
  { packageId: 'pkg-premium-tier', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
  { packageId: 'pkg-luxury-tier', groupId: 'venue-options', maxSelections: 1, freeIncludedCount: 0 },
];
