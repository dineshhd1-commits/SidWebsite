-- 1. Adds the Platinum package level (Silver / Gold / Platinum are now the only
--    three decoration tiers, offered identically across every event type).
INSERT INTO package_levels (id, name, rank, display_order, active) VALUES
('platinum', 'Platinum', 6, 7, true)
ON CONFLICT (id) DO NOTHING;

-- 2. Collapses every per-event-type decoration group into a single choice of one
--    of three tiers. Old decoration groups/items are deactivated rather than
--    deleted, since existing quotations/carts may still reference their ids.
UPDATE catalog_groups SET active = false
WHERE category_key = 'decoration' AND id <> 'dec-package';

INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('dec-package', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'decoration', 'Decoration Package', 1, 1, false, NULL, 1, true)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types, active = true;

UPDATE catalog_items SET active = false
WHERE category_key = 'decoration' AND id NOT IN ('dec-silver', 'dec-gold', 'dec-platinum');

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-silver', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'decoration', 'dec-package', 'Silver Decoration', 'Elegant stage, entrance and seating decor with fresh florals and classic drapery.', '', '[]', 'silver', 45000, 'package', 'single', 1),
('dec-gold', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'decoration', 'dec-package', 'Gold Decoration', 'Premium themed decor with layered floral arrangements, upgraded lighting and richer drapery.', '', '[]', 'gold', 85000, 'package', 'single', 2),
('dec-platinum', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'decoration', 'dec-package', 'Platinum Decoration', 'Our most opulent decor - imported florals, crystal and brass accents, and a fully bespoke design consultation.', '', '[]', 'platinum', 150000, 'package', 'single', 3)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types, active = true;

-- 3. Removes the Venue step entirely - deactivate its group/items rather than
--    delete, for the same reason as above.
UPDATE catalog_groups SET active = false WHERE id = 'venue-options';
UPDATE catalog_items SET active = false WHERE category_key = 'venue';
DELETE FROM package_group_limits WHERE group_id = 'venue-options';
DELETE FROM package_included_items WHERE catalog_item_id LIKE 'venue-%';

-- 4. Re-point wedding package inclusions at the new decoration tiers and drop
--    the old per-item decoration inclusions.
DELETE FROM package_included_items
WHERE package_id IN ('pkg-normal', 'pkg-standard', 'pkg-silver-tier', 'pkg-gold-tier', 'pkg-premium-tier', 'pkg-luxury-tier')
  AND catalog_item_id LIKE 'dec-%'
  AND catalog_item_id NOT IN ('dec-silver', 'dec-gold', 'dec-platinum');

INSERT INTO package_included_items (package_id, catalog_item_id, quantity) VALUES
('pkg-normal', 'dec-silver', 1),
('pkg-standard', 'dec-silver', 1),
('pkg-silver-tier', 'dec-silver', 1),
('pkg-gold-tier', 'dec-gold', 1),
('pkg-premium-tier', 'dec-platinum', 1),
('pkg-luxury-tier', 'dec-platinum', 1)
ON CONFLICT (package_id, catalog_item_id) DO NOTHING;
