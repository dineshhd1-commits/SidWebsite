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
  { id: 'platinum', name: 'Platinum', rank: 6, displayOrder: 7, active: true },
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
  // Decoration is a single choice of one of three tiers - Silver, Gold or Platinum -
  // offered the same way across every event type.
  group('dec-package', ALL_EVENT_TYPES, 'decoration', 'Decoration Package', 1, 1, false, null, 1),

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
