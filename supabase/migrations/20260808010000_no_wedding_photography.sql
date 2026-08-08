-- Removes Photography & Videography as an offering for Wedding events. Wedding-only
-- photography items (Candid Videography, Cinematic Wedding Film, Pre-Wedding Shoot,
-- Drone Shoot, LED Wall, Wedding Album) are cleared to an empty supported_event_types
-- so they stay inactive everywhere; multi-event items simply drop 'wedding' from
-- their list. Also drops the photo-* inclusions from the wedding package tiers.
-- Mirrors lib/data/mock-catalog-data.ts (PHOTOGRAPHY_EVENT_TYPES).

UPDATE catalog_groups
SET supported_event_types = array_remove(supported_event_types, 'wedding')
WHERE id = 'photo-services';

UPDATE catalog_items
SET supported_event_types = array_remove(supported_event_types, 'wedding')
WHERE id IN (
  'photo-event-photo', 'photo-event-video', 'photo-candid-photo',
  'photo-live-streaming', 'photo-traditional-photo', 'photo-traditional-video',
  'photo-instant'
);

UPDATE catalog_items
SET supported_event_types = ARRAY[]::text[]
WHERE id IN (
  'photo-candid-video', 'photo-cinematic', 'photo-pre-wedding',
  'photo-drone', 'photo-led-wall', 'photo-album'
);

DELETE FROM package_included_items
WHERE package_id IN ('pkg-normal', 'pkg-standard', 'pkg-silver-tier', 'pkg-gold-tier', 'pkg-premium-tier', 'pkg-luxury-tier')
  AND catalog_item_id LIKE 'photo-%';
