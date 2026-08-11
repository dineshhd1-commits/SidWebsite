-- Brings Photography back for Wedding events, organised into two groups by
-- where the coverage happens:
--   Deverakarya  - Traditional Photography, Candid Photography,
--                  Traditional Videography, Candid Videography
--   Wedding Hall - Drone, LED Wall, Live Streaming
-- Every other event type keeps the single shared photo-services group.

INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('photo-deverakarya', ARRAY['wedding'], 'photography', 'Deverakarya', NULL, 0, false, NULL, 1, true),
('photo-wedding-hall', ARRAY['wedding'], 'photography', 'Wedding Hall', NULL, 0, false, NULL, 2, true)
ON CONFLICT (id) DO UPDATE SET
  supported_event_types = EXCLUDED.supported_event_types,
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order,
  active = true;

UPDATE catalog_groups SET display_order = 3 WHERE id = 'photo-services';

-- Re-enable the four Deverakarya items (they were cleared to an empty
-- supported_event_types when wedding photography was previously dropped) and
-- move them onto the new group.
UPDATE catalog_items
SET supported_event_types = ARRAY['wedding'], group_id = 'photo-deverakarya', active = true
WHERE id IN ('photo-traditional-photo', 'photo-candid-photo', 'photo-traditional-video', 'photo-candid-video');

UPDATE catalog_items SET description = 'Classic posed traditional photography for the Deverakarya rituals.', display_order = 1 WHERE id = 'photo-traditional-photo';
UPDATE catalog_items SET description = 'Storytelling candid photography coverage of the Deverakarya.',      display_order = 2 WHERE id = 'photo-candid-photo';
UPDATE catalog_items SET description = 'Classic full-ceremony traditional videography of the Deverakarya.', display_order = 3 WHERE id = 'photo-traditional-video';
UPDATE catalog_items SET description = 'Cinematic candid videography coverage of the Deverakarya.',         display_order = 4 WHERE id = 'photo-candid-video';

-- Wedding Hall items. Drone and LED Wall are re-enabled in place; Live
-- Streaming gets its own wedding row because the existing photo-live-streaming
-- item still belongs to photo-services for corporate and reception events and
-- an item can only sit in one group.
UPDATE catalog_items
SET supported_event_types = ARRAY['wedding'], group_id = 'photo-wedding-hall', active = true
WHERE id IN ('photo-drone', 'photo-led-wall');

UPDATE catalog_items SET name = 'Drone', description = '4K aerial drone coverage of the venue and celebrations.', display_order = 1 WHERE id = 'photo-drone';
UPDATE catalog_items SET description = 'Live LED screen stage backdrop display.', display_order = 2 WHERE id = 'photo-led-wall';

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('photo-wedding-live-streaming', ARRAY['wedding'], 'photography', 'photo-wedding-hall', 'Live Streaming', 'Live stream the wedding for guests who cannot attend.', '', '[]', 'premium', 15000, 'per event', 'single', '{}', 3)
ON CONFLICT (id) DO UPDATE SET
  supported_event_types = EXCLUDED.supported_event_types,
  group_id = EXCLUDED.group_id,
  active = true;
