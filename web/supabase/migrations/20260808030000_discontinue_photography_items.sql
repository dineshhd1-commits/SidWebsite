-- Discontinues Candid Photography, Traditional Photography, Traditional
-- Videography and Instant Photography/Prints. Only Event Photography, Event
-- Videography and Live Streaming remain in the Photography & Videography
-- catalog. Cleared to an empty supported_event_types (rather than deleted) so
-- the items stay inactive everywhere without breaking any existing references.

UPDATE catalog_items
SET supported_event_types = ARRAY[]::text[]
WHERE id IN ('photo-candid-photo', 'photo-traditional-photo', 'photo-traditional-video', 'photo-instant');

DELETE FROM package_included_items
WHERE catalog_item_id IN ('photo-candid-photo', 'photo-traditional-photo', 'photo-traditional-video', 'photo-instant');
