-- Extends the Breakfast catering menu (cat-breakfast group + cater-bfast-* items) to
-- every event type instead of just Wedding, Engagement, Reception, Housewarming and
-- Traditional Home Function. Mirrors lib/data/mock-catalog-data.ts (BREAKFAST_EVENT_TYPES)
-- and lib/data/catering-menu.json (breakfastEventTypes).

UPDATE catalog_groups
SET supported_event_types = ARRAY[
  'wedding','engagement','reception','birthday','anniversary','get_together',
  'bachelor_party','housewarming','haldi_function','corporate_event',
  'traditional_home_function','other_events'
]
WHERE id = 'cat-breakfast';

UPDATE catalog_items
SET supported_event_types = ARRAY[
  'wedding','engagement','reception','birthday','anniversary','get_together',
  'bachelor_party','housewarming','haldi_function','corporate_event',
  'traditional_home_function','other_events'
]
WHERE id IN ('cater-bfast-01', 'cater-bfast-02', 'cater-bfast-03', 'cater-bfast-04', 'cater-bfast-05');
