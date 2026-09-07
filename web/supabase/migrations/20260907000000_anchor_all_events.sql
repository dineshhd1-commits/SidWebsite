-- Update Anchor / Host to be supported across ALL event types
UPDATE catalog_items
SET supported_event_types = ARRAY[
  'wedding',
  'engagement',
  'reception',
  'birthday',
  'anniversary',
  'get_together',
  'bachelor_party',
  'housewarming',
  'haldi_function',
  'corporate_event',
  'traditional_home_function',
  'shrimantha_karya',
  'half_saree_function',
  'other_events'
]
WHERE id = 'addon-anchor';
