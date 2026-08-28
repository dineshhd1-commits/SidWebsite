-- Adds two more event types: Shrimantha Karya (traditional baby shower) and
-- Half-Saree Function (langa voni coming-of-age ceremony), and extends the
-- catalog to cover them.

INSERT INTO event_types (id, name, short_description, image_url, is_catalog_ready, display_order, active) VALUES
('shrimantha_karya', 'Shrimantha Karya', 'Traditional baby shower ceremony with decor, rituals and catering.', '', true, 12, true),
('half_saree_function', 'Half-Saree Function', 'Langa voni coming-of-age celebration, decor to catering.', '', true, 13, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  is_catalog_ready = EXCLUDED.is_catalog_ready,
  display_order = EXCLUDED.display_order,
  active = true;

UPDATE event_types SET display_order = 14 WHERE id = 'other_events';

-- Groups offered to every event type (decoration, breakfast, snacks, add-ons)
-- plus the shared non-wedding catering and photography groups.
UPDATE catalog_groups
SET supported_event_types = supported_event_types || ARRAY['shrimantha_karya','half_saree_function']
WHERE id IN ('dec-package', 'cat-general', 'cat-breakfast', 'cat-snacks', 'photo-services', 'addon-services')
  AND NOT ('shrimantha_karya' = ANY(supported_event_types));

-- Catalog items available to every event type, and the shared non-wedding
-- catering / photography items.
UPDATE catalog_items
SET supported_event_types = supported_event_types || ARRAY['shrimantha_karya','half_saree_function']
WHERE ('other_events' = ANY(supported_event_types))
  AND NOT ('shrimantha_karya' = ANY(supported_event_types));

-- Both are traditional South Indian ceremonies, so they also get the
-- ritual-oriented services that Traditional Home Function already has.
UPDATE catalog_items
SET supported_event_types = supported_event_types || ARRAY['shrimantha_karya','half_saree_function']
WHERE id IN ('cater-traditional-01', 'addon-nadaswara', 'addon-return-gifts', 'addon-purohit')
  AND NOT ('shrimantha_karya' = ANY(supported_event_types));
