-- Adds meal-period tagging (Breakfast / Lunch / Dinner) to catering catalog groups,
-- plus a shared Snacks group (available under Lunch and Dinner for every event type)
-- and a Breakfast group (Wedding, Engagement, Reception, Housewarming, Traditional
-- Home Function only). Mirrors lib/data/mock-catalog-data.ts exactly.

ALTER TABLE catalog_groups ADD COLUMN IF NOT EXISTS meals TEXT[] DEFAULT '{}';

-- Existing wedding catering menu groups serve both Lunch and Dinner events.
UPDATE catalog_groups SET meals = ARRAY['lunch', 'dinner']
WHERE id IN (
  'cat-welcome-drinks', 'cat-starters', 'cat-main-course', 'cat-rice', 'cat-breads',
  'cat-curries', 'cat-live-counters', 'cat-desserts', 'cat-ice-cream', 'cat-beverages',
  'cat-special-items', 'cat-general'
);

INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active, meals) VALUES
('cat-breakfast', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'Breakfast', NULL, 0, false, NULL, 13, true, ARRAY['breakfast']),
('cat-snacks', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'Snacks', NULL, 0, false, NULL, 14, true, ARRAY['lunch','dinner'])
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types, meals = EXCLUDED.meals;

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('cater-bfast-01', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'cat-breakfast', 'Idli, Vada & Sambar', 'Classic South Indian breakfast plate with coconut chutney.', '', '[]', 'normal', 60, 'per guest', 'single', 1),
('cater-bfast-02', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'cat-breakfast', 'Rava Upma', 'Semolina upma tempered with mustard, curry leaves and cashews.', '', '[]', 'normal', 45, 'per guest', 'single', 2),
('cater-bfast-03', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'cat-breakfast', 'Ven Pongal', 'Traditional rice and lentil pongal with ghee and cashews.', '', '[]', 'standard', 55, 'per guest', 'single', 3),
('cater-bfast-04', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'cat-breakfast', 'Mysore Masala Dosa', 'Crisp dosa with spiced red chutney and potato masala.', '', '[]', 'standard', 70, 'per guest', 'single', 4),
('cater-bfast-05', ARRAY['wedding','engagement','reception','housewarming','traditional_home_function'], 'catering', 'cat-breakfast', 'Breakfast Filter Coffee & Tea', 'Freshly brewed South Indian filter coffee and tea service.', '', '[]', 'normal', 25, 'per guest', 'single', 5),
('cater-snack-01', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-snacks', 'Assorted Namkeen Platter', 'Mixed savoury namkeen platter served between meal courses.', '', '[]', 'normal', 35, 'per guest', 'single', 1),
('cater-snack-02', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-snacks', 'Veg Samosa Platter', 'Crisp vegetable samosas served with mint and tamarind chutney.', '', '[]', 'normal', 40, 'per guest', 'single', 2),
('cater-snack-03', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-snacks', 'Bread Pakora Counter', 'Live-fried bread pakora snack counter.', '', '[]', 'standard', 50, 'per guest', 'single', 3),
('cater-snack-04', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-snacks', 'Evening Tea & Biscuits', 'Tea, coffee and assorted biscuits service.', '', '[]', 'normal', 20, 'per guest', 'single', 4)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;
