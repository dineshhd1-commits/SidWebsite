-- Seed data for the generic Event Package Builder.
-- Separate from the original seed.sql (kept as-is; its 4 legacy wedding_packages rows
-- and 8 legacy services rows are placeholder demo data, not remapped into this model).
--
-- All 12 event types are catalog-ready with real Indian event-planning categories
-- (Griha Pravesh, Haldi, Seemantham/Naming ceremony, Nadaswara, Purohit services,
-- etc.), researched against how Indian event planners actually structure these
-- services. Universal services (Photography, DJ/Music, Catering, Return Gifts,
-- Entrance Decoration) are shared across the event types they genuinely apply to
-- via supported_event_types (TEXT[]) instead of being duplicated per event.
--
-- NOTE: image_url / images are intentionally left blank ('' / '[]') across the
-- board except sid-party29.jpeg (verified real wedding stage/mandap photo). None
-- of the other stock photos bundled in public/ reliably depict the specific
-- catalog item they'd be attached to (verified by inspection) - the UI shows a
-- "Photo coming soon" placeholder until real per-item photos are uploaded via the
-- admin panel.

-- 1. Event Types (all catalog-ready) ----------------------------------------
INSERT INTO event_types (id, name, short_description, image_url, is_catalog_ready, display_order, active) VALUES
('wedding', 'Wedding', 'Complete traditional South Indian wedding planning, decor to catering.', '/sid-party29.jpeg', true, 1, true),
('engagement', 'Engagement', 'Ring ceremony décor, stage design and catering for your engagement.', '', true, 2, true),
('reception', 'Reception', 'Elegant reception stage, catering and entertainment.', '', true, 3, true),
('birthday', 'Birthday', 'Themed birthday celebrations for every age and milestone.', '', true, 4, true),
('anniversary', 'Anniversary', 'Elegant anniversary celebrations, big or intimate.', '', true, 5, true),
('get_together', 'Get Together', 'Casual and semi-formal family or friends get-togethers.', '', true, 6, true),
('bachelor_party', 'Bachelor Party', 'Fun, high-energy bachelor party planning and coordination.', '', true, 7, true),
('housewarming', 'Housewarming', 'Griha Pravesh ceremonies handled from rituals to hospitality.', '', true, 8, true),
('haldi_function', 'Haldi Function', 'Vibrant Haldi decor, seating and catering setup.', '', true, 9, true),
('corporate_event', 'Corporate Event', 'Conferences, product launches and corporate celebrations.', '', true, 10, true),
('traditional_home_function', 'Traditional Home Function', 'Naming ceremonies, seemantham and other home rituals.', '', true, 11, true),
('other_events', 'Other Events', 'Reunions, custom celebrations and everything in between.', '', true, 12, true)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  short_description = EXCLUDED.short_description,
  is_catalog_ready = EXCLUDED.is_catalog_ready,
  display_order = EXCLUDED.display_order;

-- 2. Package Levels --------------------------------------------------------
INSERT INTO package_levels (id, name, rank, display_order, active) VALUES
('normal', 'Normal', 0, 1, true),
('standard', 'Standard', 1, 2, true),
('silver', 'Silver', 2, 3, true),
('gold', 'Gold', 3, 4, true),
('premium', 'Premium', 4, 5, true),
('luxury', 'Luxury', 5, 6, true)
ON CONFLICT (id) DO NOTHING;

-- 3. Decoration Groups -------------------------------------------------------
INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('dec-stage', ARRAY['wedding'], 'decoration', 'Stage Decoration', 2, 1, false, NULL, 1, true),
('dec-mandap', ARRAY['wedding'], 'decoration', 'Mandap Decoration', 2, 1, false, NULL, 2, true),
('dec-entrance', ARRAY['wedding','birthday','engagement','reception','anniversary','get_together','housewarming','traditional_home_function'], 'decoration', 'Entrance Decoration', 1, 1, false, NULL, 3, true),
('dec-pathway', ARRAY['wedding'], 'decoration', 'Pathway Decoration', 1, 1, false, NULL, 4, true),
('dec-passage', ARRAY['wedding'], 'decoration', 'Passage Decoration', 1, 1, false, NULL, 5, true),
('dec-garland', ARRAY['wedding','haldi_function'], 'decoration', 'Garland Selection', 3, 1, false, NULL, 6, true),
('dec-nadaswara', ARRAY['wedding','haldi_function','traditional_home_function'], 'decoration', 'Nadaswara', 1, 1, false, NULL, 7, true),
('dec-house', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'House Decoration', 2, 1, false, NULL, 8, true),
('dec-main-door', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'Main Door Decoration', 1, 1, false, NULL, 9, true),
('dec-haldi', ARRAY['wedding','haldi_function'], 'decoration', 'Haldi Decoration', 1, 1, false, NULL, 10, true),
('dec-reception', ARRAY['wedding','reception'], 'decoration', 'Reception Decoration', 2, 1, false, NULL, 11, true),
('dec-traditional-home', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'Traditional Home Decoration', 1, 1, false, NULL, 12, true),
('dec-front-canopy', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'Front Canopy / Chapra Decoration', 1, 1, false, NULL, 13, true),
('dec-bridal-room', ARRAY['wedding'], 'decoration', 'Bridal Room Decoration', 1, 1, false, NULL, 14, true),
('dec-birthday-stage', ARRAY['birthday'], 'decoration', 'Birthday Stage Decoration', 1, 1, false, NULL, 15, true),
('dec-balloon', ARRAY['birthday','get_together','bachelor_party'], 'decoration', 'Balloon Decoration', 1, 1, false, NULL, 16, true),
('dec-theme', ARRAY['birthday','get_together','bachelor_party','other_events'], 'decoration', 'Theme Decoration', 1, 1, false, NULL, 17, true),
('dec-cake-table', ARRAY['birthday','anniversary'], 'decoration', 'Cake Table Decoration', 1, 1, false, NULL, 18, true),
('dec-engagement-stage', ARRAY['engagement'], 'decoration', 'Engagement Stage Decoration', 1, 1, false, NULL, 19, true),
('dec-ring-ceremony', ARRAY['engagement'], 'decoration', 'Ring Ceremony Setup', 1, 1, false, NULL, 20, true),
('dec-floral', ARRAY['engagement','anniversary'], 'decoration', 'Floral Decoration', 1, 1, false, NULL, 21, true),
('dec-corporate-stage', ARRAY['corporate_event'], 'decoration', 'Corporate Stage', 1, 1, false, NULL, 22, true),
('dec-branding', ARRAY['corporate_event'], 'decoration', 'Branding Setup', 1, 1, false, NULL, 23, true),
('dec-candlelit-dinner', ARRAY['anniversary'], 'decoration', 'Candlelit Dinner Setup', 1, 1, false, NULL, 24, true),
('dec-griha-pravesh', ARRAY['housewarming'], 'decoration', 'Griha Pravesh Pooja Decoration', 1, 1, false, NULL, 25, true),
('dec-cradle-ceremony', ARRAY['traditional_home_function'], 'decoration', 'Cradle Ceremony Decoration', 1, 1, false, NULL, 26, true),
('dec-bar-lounge', ARRAY['bachelor_party'], 'decoration', 'Bar / Lounge Decoration', 1, 1, false, NULL, 27, true),
('dec-general', ARRAY['other_events'], 'decoration', 'Event Decoration', 1, 1, false, NULL, 28, true)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 4. Catering Groups (Wedding keeps its detailed menu structure; other event types
-- share one simpler general-catering group).
INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('cat-welcome-drinks', ARRAY['wedding'], 'catering', 'Welcome Drinks', 1, 1, true, 'Additional Welcome Drinks require vendor approval.', 1, true),
('cat-starters', ARRAY['wedding'], 'catering', 'Starters', 2, 2, true, 'You have reached the allowed number of starters for your package.', 2, true),
('cat-main-course', ARRAY['wedding'], 'catering', 'Main Course', NULL, 0, false, NULL, 3, true),
('cat-rice', ARRAY['wedding'], 'catering', 'Rice Items', NULL, 0, false, NULL, 4, true),
('cat-breads', ARRAY['wedding'], 'catering', 'Indian Breads', NULL, 0, false, NULL, 5, true),
('cat-curries', ARRAY['wedding'], 'catering', 'Curries', NULL, 0, false, NULL, 6, true),
('cat-live-counters', ARRAY['wedding'], 'catering', 'Live Counters', 2, 1, false, NULL, 7, true),
('cat-desserts', ARRAY['wedding'], 'catering', 'Desserts', NULL, 0, false, NULL, 8, true),
('cat-ice-cream', ARRAY['wedding'], 'catering', 'Ice Cream', 1, 1, false, NULL, 9, true),
('cat-beverages', ARRAY['wedding'], 'catering', 'Beverages', NULL, 0, false, NULL, 10, true),
('cat-special-items', ARRAY['wedding'], 'catering', 'Special Items', NULL, 0, false, NULL, 11, true),
('cat-general', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'Catering', 1, 1, false, NULL, 12, true)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 5. Photography / Venue / Additional Services groups ----------------------
INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('photo-services', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'Photography & Videography', NULL, 0, false, NULL, 1, true),
('venue-options', ARRAY['wedding','reception'], 'venue', 'Venue', 1, 0, false, NULL, 1, true),
('addon-services', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'additional_services', 'Additional Services', NULL, 0, false, NULL, 1, true)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 6. Decoration Catalog Items (Wedding) --------------------------------------
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-stage-01', ARRAY['wedding'], 'decoration', 'dec-stage', 'Classic Floral Stage', 'Fresh marigold and jasmine stage backdrop with brass lamps.', '', '[]', 'standard', 45000, 'setup', 'single', 1),
('dec-stage-02', ARRAY['wedding'], 'decoration', 'dec-stage', 'Royal Brass Mandapam Stage', 'Grand brass-themed stage with layered floral drape and lighting.', '', '[]', 'gold', 95000, 'setup', 'single', 2),
('dec-stage-03', ARRAY['wedding'], 'decoration', 'dec-stage', 'Luxury Crystal & Floral Stage', 'Premium crystal drop backdrop with imported floral arrangement.', '', '[]', 'luxury', 175000, 'setup', 'single', 3),
('dec-mandap-01', ARRAY['wedding'], 'decoration', 'dec-mandap', 'Traditional Chepparam Mandap', 'Authentic temple-style mandap backdrop with golden drapes.', '', '[]', 'standard', 55000, 'setup', 'single', 1),
('dec-mandap-02', ARRAY['wedding'], 'decoration', 'dec-mandap', 'Saptapadi Royal Mandap', 'Fresh jasmine and lotus royal brass mandapam.', '', '[]', 'gold', 120000, 'setup', 'single', 2),
('dec-entrance-01', ARRAY['wedding','birthday','engagement','reception','anniversary','get_together','housewarming','traditional_home_function'], 'decoration', 'dec-entrance', 'Floral Arch Entrance', 'Marigold and rose arch with hanging bells.', '', '[]', 'standard', 18000, 'setup', 'single', 1),
('dec-entrance-02', ARRAY['wedding','engagement','reception','anniversary'], 'decoration', 'dec-entrance', 'Grand Welcome Entrance', 'Illuminated floral entrance with traditional welcome signage.', '', '[]', 'premium', 38000, 'setup', 'single', 2),
('dec-pathway-01', ARRAY['wedding'], 'decoration', 'dec-pathway', 'Petal Pathway', 'Rose petal scattered aisle with candle lining.', '', '[]', 'standard', 12000, 'setup', 'single', 1),
('dec-pathway-02', ARRAY['wedding'], 'decoration', 'dec-pathway', 'Illuminated Grand Pathway', 'LED-lit walkway with floral garlands on both sides.', '', '[]', 'gold', 28000, 'setup', 'single', 2),
('dec-passage-01', ARRAY['wedding'], 'decoration', 'dec-passage', 'Traditional Passage Decor', 'Coconut leaf and floral passage arrangement.', '', '[]', 'standard', 10000, 'setup', 'single', 1),
('dec-passage-02', ARRAY['wedding'], 'decoration', 'dec-passage', 'Premium Floral Passage', 'Layered floral passage with hanging lanterns.', '', '[]', 'premium', 24000, 'setup', 'single', 2),
('dec-garland-01', ARRAY['wedding','haldi_function'], 'decoration', 'dec-garland', 'Classic Rose Garlands', 'Fresh rose garlands for the couple.', '', '[]', 'normal', 3000, 'pair', 'stepper', 1),
('dec-garland-02', ARRAY['wedding','haldi_function'], 'decoration', 'dec-garland', 'Jasmine & Marigold Garlands', 'Fragrant mixed-flower garlands.', '', '[]', 'standard', 4500, 'pair', 'stepper', 2),
('dec-garland-03', ARRAY['wedding'], 'decoration', 'dec-garland', 'Designer Orchid Garlands', 'Imported orchid designer garlands.', '', '[]', 'luxury', 9000, 'pair', 'stepper', 3),
('dec-nadaswara-01', ARRAY['wedding','haldi_function','traditional_home_function'], 'decoration', 'dec-nadaswara', 'Live Nadaswaram & Thavil Duo', 'Traditional auspicious live ensemble for muhurtham and home rituals.', '', '[]', 'standard', 25000, 'per event', 'single', 1),
('dec-house-01', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'dec-house', 'Home Entrance Rangoli & Torans', 'Traditional rangoli with mango leaf torans.', '', '[]', 'standard', 8000, 'setup', 'single', 1),
('dec-house-02', ARRAY['wedding','housewarming'], 'decoration', 'dec-house', 'Complete Home Floral Decor', 'Full home floral and lighting decoration.', '', '[]', 'gold', 32000, 'setup', 'single', 2),
('dec-main-door-01', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'dec-main-door', 'Traditional Main Door Toran', 'Mango leaf and marigold main door toran.', '', '[]', 'normal', 4000, 'setup', 'single', 1),
('dec-haldi-01', ARRAY['wedding','haldi_function'], 'decoration', 'dec-haldi', 'Yellow Marigold Haldi Setup', 'Bright marigold-themed Haldi seating with decorated urli and backdrop.', '', '[]', 'standard', 22000, 'setup', 'single', 1),
('dec-reception-01', ARRAY['wedding','reception'], 'decoration', 'dec-reception', 'Reception Stage & Table Decor', 'Elegant reception stage with themed table centerpieces.', '', '[]', 'standard', 60000, 'setup', 'single', 1),
('dec-reception-02', ARRAY['wedding','reception'], 'decoration', 'dec-reception', 'Luxury Reception Ambience', 'Premium lighting, drapery and floral reception setup.', '', '[]', 'luxury', 145000, 'setup', 'single', 2),
('dec-trad-home-01', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'dec-traditional-home', 'Traditional Home Function Decor', 'Classic South Indian home ceremony decoration.', '', '[]', 'standard', 15000, 'setup', 'single', 1),
('dec-canopy-01', ARRAY['wedding','housewarming','traditional_home_function'], 'decoration', 'dec-front-canopy', 'Front Canopy / Chapra Setup', 'Traditional decorated chapra canopy for the home front.', '', '[]', 'standard', 20000, 'setup', 'single', 1),
('dec-bridal-room-01', ARRAY['wedding'], 'decoration', 'dec-bridal-room', 'Bridal Room Decoration', 'Floral and fairy-light bridal getting-ready room styling.', '', '[]', 'standard', 15000, 'setup', 'single', 1)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 7. Decoration Catalog Items (Birthday, Engagement, Corporate Event) --------
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-bday-stage-01', ARRAY['birthday'], 'decoration', 'dec-birthday-stage', 'Themed Birthday Stage', 'Colourful themed stage backdrop for the birthday star.', '', '[]', 'standard', 15000, 'setup', 'single', 1),
('dec-balloon-01', ARRAY['birthday','get_together','bachelor_party'], 'decoration', 'dec-balloon', 'Balloon Arch & Backdrop', 'Full balloon arch with matching backdrop wall.', '', '[]', 'normal', 6000, 'setup', 'single', 1),
('dec-balloon-02', ARRAY['birthday'], 'decoration', 'dec-balloon', 'Premium Balloon Ceiling Decor', 'Ceiling-to-floor balloon decor with organic garlands.', '', '[]', 'gold', 18000, 'setup', 'single', 2),
('dec-theme-01', ARRAY['birthday'], 'decoration', 'dec-theme', 'Kids Cartoon Theme Setup', 'Full cartoon-character themed decor and props.', '', '[]', 'standard', 12000, 'setup', 'single', 1),
('dec-theme-02', ARRAY['birthday','get_together','bachelor_party','other_events'], 'decoration', 'dec-theme', 'Custom Theme Setup', 'Custom themed backdrop, props and table decor for any occasion.', '', '[]', 'standard', 12000, 'setup', 'single', 2),
('dec-cake-table-01', ARRAY['birthday','anniversary'], 'decoration', 'dec-cake-table', 'Designer Cake Table', 'Styled cake table with floral and fairy-light accents.', '', '[]', 'normal', 4000, 'setup', 'single', 1),
('dec-eng-stage-01', ARRAY['engagement'], 'decoration', 'dec-engagement-stage', 'Elegant Engagement Stage', 'Sophisticated floral stage for the ring ceremony.', '', '[]', 'standard', 35000, 'setup', 'single', 1),
('dec-ring-ceremony-01', ARRAY['engagement'], 'decoration', 'dec-ring-ceremony', 'Ring Platter & Ceremony Setup', 'Ring exchange platter, seating and ceremony styling.', '', '[]', 'standard', 12000, 'setup', 'single', 1),
('dec-floral-01', ARRAY['engagement','anniversary'], 'decoration', 'dec-floral', 'Premium Floral Decoration', 'Fresh flower decor across stage and seating areas.', '', '[]', 'gold', 40000, 'setup', 'single', 1),
('dec-corp-stage-01', ARRAY['corporate_event'], 'decoration', 'dec-corporate-stage', 'Corporate Stage Setup', 'Clean professional stage setup for conferences and launches.', '', '[]', 'standard', 40000, 'setup', 'single', 1),
('dec-branding-01', ARRAY['corporate_event'], 'decoration', 'dec-branding', 'Branding & Backdrop Setup', 'Company-branded backdrop, standees and signage.', '', '[]', 'standard', 20000, 'setup', 'single', 1)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 8. Decoration Catalog Items (Anniversary, Housewarming, Naming Ceremony,
-- Bachelor Party, Other Events)
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-candlelit-01', ARRAY['anniversary'], 'decoration', 'dec-candlelit-dinner', 'Romantic Candlelit Dinner Setup', 'Private candlelit table setup with florals and fairy lights.', '', '[]', 'gold', 20000, 'setup', 'single', 1),
('dec-griha-01', ARRAY['housewarming'], 'decoration', 'dec-griha-pravesh', 'Griha Pravesh Pooja Setup', 'Kalash, floral curtain and pooja area decoration for the house-warming ritual.', '', '[]', 'standard', 14000, 'setup', 'single', 1),
('dec-cradle-01', ARRAY['traditional_home_function'], 'decoration', 'dec-cradle-ceremony', 'Traditional Cradle Decoration', 'Floral cradle decor with traditional backdrop for the naming ceremony.', '', '[]', 'standard', 10000, 'setup', 'single', 1),
('dec-bar-lounge-01', ARRAY['bachelor_party'], 'decoration', 'dec-bar-lounge', 'Bar & Lounge Theme Decoration', 'Moody lounge lighting, signage and lounge seating decor.', '', '[]', 'standard', 15000, 'setup', 'single', 1),
('dec-general-01', ARRAY['other_events'], 'decoration', 'dec-general', 'Custom Event Decoration', 'Flexible decoration setup tailored to your specific event.', '', '[]', 'standard', 20000, 'setup', 'single', 1)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 9. Photography Catalog Items - not offered for Wedding events; scoped to where
-- they genuinely apply otherwise. Items that were wedding-exclusive are seeded
-- with an empty supported_event_types so they stay inactive everywhere.
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('photo-event-photo', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Event Photography', 'Full-day event photography coverage.', '', '[]', 'standard', 25000, 'per event', 'team_size', '{"teamSize": 2}', 1),
('photo-event-video', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Event Videography', 'Full-day event videography coverage.', '', '[]', 'standard', 25000, 'per event', 'team_size', '{"teamSize": 2}', 2),
('photo-candid-photo', ARRAY['engagement','reception','anniversary'], 'photography', 'photo-services', 'Candid Photography', 'Storytelling candid photography coverage.', '', '[]', 'gold', 35000, 'per event', 'team_size', '{"teamSize": 2}', 3),
('photo-candid-video', ARRAY[]::text[], 'photography', 'photo-services', 'Candid Videography', 'Cinematic candid videography coverage.', '', '[]', 'gold', 40000, 'per event', 'team_size', '{"teamSize": 2}', 4),
('photo-cinematic', ARRAY[]::text[], 'photography', 'photo-services', 'Cinematic Wedding Film', 'Full cinematic wedding film with same-day teaser.', '', '[]', 'premium', 60000, 'package', 'single', '{}', 5),
('photo-pre-wedding', ARRAY[]::text[], 'photography', 'photo-services', 'Pre-Wedding Shoot', 'Outdoor or studio pre-wedding photo and video shoot.', '', '[]', 'premium', 30000, 'package', 'single', '{}', 6),
('photo-drone', ARRAY[]::text[], 'photography', 'photo-services', 'Drone Shoot', '4K aerial drone coverage of the venue and event.', '', '[]', 'gold', 20000, 'per event', 'single', '{}', 7),
('photo-led-wall', ARRAY[]::text[], 'photography', 'photo-services', 'LED Wall', 'Live LED screen stage backdrop display.', '', '[]', 'premium', 30000, 'per event', 'single', '{}', 8),
('photo-live-streaming', ARRAY['corporate_event','reception'], 'photography', 'photo-services', 'Live Streaming', 'Live stream the event for remote guests.', '', '[]', 'premium', 15000, 'per event', 'single', '{}', 9),
('photo-traditional-photo', ARRAY['haldi_function','traditional_home_function','housewarming'], 'photography', 'photo-services', 'Traditional Photography', 'Classic posed traditional photography for rituals and ceremonies.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 10),
('photo-traditional-video', ARRAY['haldi_function','traditional_home_function','housewarming'], 'photography', 'photo-services', 'Traditional Videography', 'Classic full-ceremony traditional videography.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 11),
('photo-album', ARRAY[]::text[], 'photography', 'photo-services', 'Wedding Album', 'Premium non-tearable printed photo album.', '', '[]', 'standard', 8000, 'unit', 'stepper', '{}', 12),
('photo-instant', ARRAY['birthday','get_together'], 'photography', 'photo-services', 'Instant Photography / Prints', 'On-the-spot instant photo printing booth for guests.', '', '[]', 'standard', 12000, 'per event', 'single', '{}', 13)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 10. Catering Catalog Items (Wedding menu) -----------------------------------
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('cater-wd-01', ARRAY['wedding'], 'catering', 'cat-welcome-drinks', 'Tender Coconut Water', 'Fresh tender coconut water welcome drink.', '', '[]', 'normal', 40, 'per guest', 'single', 1),
('cater-wd-02', ARRAY['wedding'], 'catering', 'cat-welcome-drinks', 'Fresh Fruit Punch', 'Seasonal fresh fruit punch mocktail.', '', '[]', 'standard', 45, 'per guest', 'single', 2),
('cater-wd-03', ARRAY['wedding'], 'catering', 'cat-welcome-drinks', 'Rose Milk Sharbat', 'Chilled rose milk sharbat welcome drink.', '', '[]', 'gold', 50, 'per guest', 'single', 3),
('cater-start-01', ARRAY['wedding'], 'catering', 'cat-starters', 'Veg Manchurian', 'Crispy vegetable Manchurian starter.', '', '[]', 'normal', 60, 'per guest', 'single', 1),
('cater-start-02', ARRAY['wedding'], 'catering', 'cat-starters', 'Paneer 65', 'Spiced fried paneer starter.', '', '[]', 'standard', 70, 'per guest', 'single', 2),
('cater-start-03', ARRAY['wedding'], 'catering', 'cat-starters', 'Mushroom Chilli', 'Indo-Chinese chilli mushroom starter.', '', '[]', 'gold', 75, 'per guest', 'single', 3),
('cater-start-04', ARRAY['wedding'], 'catering', 'cat-starters', 'Corn Cheese Balls', 'Crispy corn and cheese fried balls.', '', '[]', 'gold', 80, 'per guest', 'single', 4),
('cater-main-01', ARRAY['wedding'], 'catering', 'cat-main-course', 'Sambar', 'Traditional South Indian sambar.', '', '[]', 'normal', 35, 'per guest', 'single', 1),
('cater-main-02', ARRAY['wedding'], 'catering', 'cat-main-course', 'Rasam', 'Classic tangy South Indian rasam.', '', '[]', 'normal', 30, 'per guest', 'single', 2),
('cater-main-03', ARRAY['wedding'], 'catering', 'cat-main-course', 'Paneer Butter Masala', 'Rich North Indian paneer butter masala.', '', '[]', 'gold', 65, 'per guest', 'single', 3),
('cater-rice-01', ARRAY['wedding'], 'catering', 'cat-rice', 'Steamed Rice', 'Plain steamed rice.', '', '[]', 'normal', 20, 'per guest', 'single', 1),
('cater-rice-02', ARRAY['wedding'], 'catering', 'cat-rice', 'Curd Rice', 'Traditional South Indian curd rice.', '', '[]', 'normal', 22, 'per guest', 'single', 2),
('cater-rice-03', ARRAY['wedding'], 'catering', 'cat-rice', 'Bisi Bele Bath', 'Karnataka-style spiced rice dish.', '', '[]', 'standard', 40, 'per guest', 'single', 3),
('cater-bread-01', ARRAY['wedding'], 'catering', 'cat-breads', 'Chapati', 'Soft wheat chapati.', '', '[]', 'normal', 15, 'per guest', 'single', 1),
('cater-bread-02', ARRAY['wedding'], 'catering', 'cat-breads', 'Poori', 'Deep-fried puffed bread.', '', '[]', 'standard', 20, 'per guest', 'single', 2),
('cater-curry-01', ARRAY['wedding'], 'catering', 'cat-curries', 'Mixed Vegetable Kurma', 'Coconut-based mixed vegetable kurma.', '', '[]', 'normal', 45, 'per guest', 'single', 1),
('cater-live-01', ARRAY['wedding'], 'catering', 'cat-live-counters', 'Live Dosa Counter', 'Freshly made dosa served live on request.', '', '[]', 'gold', 90, 'per guest', 'single', 1),
('cater-live-02', ARRAY['wedding'], 'catering', 'cat-live-counters', 'Live Chaat Counter', 'Live chaat station with regional favorites.', '', '[]', 'premium', 85, 'per guest', 'single', 2),
('cater-dessert-01', ARRAY['wedding'], 'catering', 'cat-desserts', 'Payasam', 'Traditional South Indian payasam.', '', '[]', 'normal', 35, 'per guest', 'single', 1),
('cater-icecream-01', ARRAY['wedding'], 'catering', 'cat-ice-cream', 'Ice Cream Counter', 'Live ice cream serving counter, 3 flavors.', '', '[]', 'standard', 40, 'per guest', 'single', 1),
('cater-bev-01', ARRAY['wedding'], 'catering', 'cat-beverages', 'Filter Coffee & Tea', 'Traditional South Indian filter coffee and tea service.', '', '[]', 'normal', 25, 'per guest', 'single', 1),
('cater-special-01', ARRAY['wedding'], 'catering', 'cat-special-items', 'Banana Leaf Service', 'Full traditional banana leaf serving experience.', '', '[]', 'standard', 30, 'per guest', 'single', 1)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 11. Catering Catalog Items (shared general catering for non-wedding events)
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('cater-gen-01', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-general', 'Standard Buffet Catering', 'Multi-item vegetarian buffet spread.', '', '[]', 'normal', 350, 'per guest', 'single', 1),
('cater-gen-02', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'catering', 'cat-general', 'Premium Buffet Catering', 'Extended multi-cuisine buffet with live counters.', '', '[]', 'gold', 550, 'per guest', 'single', 2),
('cater-gen-03', ARRAY['birthday','anniversary'], 'catering', 'cat-general', 'Birthday Cake & Dessert Table', 'Custom cake and dessert table for the celebration.', '', '[]', 'standard', 8000, 'setup', 'single', 3),
('cater-bar-01', ARRAY['bachelor_party'], 'catering', 'cat-general', 'Cocktail & Bar Snacks', 'Bar snacks and mixers spread to go with the bar setup.', '', '[]', 'standard', 400, 'per guest', 'single', 4),
('cater-traditional-01', ARRAY['housewarming','traditional_home_function','haldi_function'], 'catering', 'cat-general', 'Traditional Vegetarian Feast', 'Full traditional South Indian vegetarian feast for the ceremony.', '', '[]', 'standard', 320, 'per guest', 'single', 5)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 12. Venue Catalog Items (Wedding / Reception) -------------------------------
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('venue-community-hall', ARRAY['wedding','reception'], 'venue', 'venue-options', 'Community Hall', 'Simple, well-equipped community hall for intimate celebrations.', '', '[]', 'normal', 60000, 'per event', 'single', '{"capacity": 300, "location": "Davanagere", "facilities": ["Parking", "Basic AC", "Stage"]}', 1),
('venue-banquet', ARRAY['wedding','reception'], 'venue', 'venue-options', 'Banquet Hall', 'Air-conditioned banquet hall with in-house catering support.', '', '[]', 'standard', 150000, 'per event', 'single', '{"capacity": 500, "location": "Davanagere", "facilities": ["Parking", "Full AC", "Stage", "Green Rooms"]}', 2),
('venue-convention', ARRAY['wedding','reception'], 'venue', 'venue-options', 'Grand Convention Centre', 'Large convention centre suited for grand celebrations.', '', '[]', 'gold', 350000, 'per event', 'single', '{"capacity": 1000, "location": "Davanagere", "facilities": ["Valet Parking", "Full AC", "Stage", "Multiple Halls"]}', 3),
('venue-palace', ARRAY['wedding','reception'], 'venue', 'venue-options', 'Royal Palace Resort', 'Premium resort-style destination venue.', '', '[]', 'luxury', 800000, 'per event', 'single', '{"capacity": 1500, "location": "Davanagere Outskirts", "facilities": ["Valet Parking", "Full AC", "Stage", "Guest Rooms", "Pool"]}', 4)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 13. Additional Services Catalog Items (Wedding) ----------------------------
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('addon-bridal-makeup', ARRAY['wedding'], 'additional_services', 'addon-services', 'Bridal Makeup', 'HD bridal makeup and hair styling.', '', '[]', 'gold', 25000, 'per session', 'single', 1),
('addon-groom-makeup', ARRAY['wedding'], 'additional_services', 'addon-services', 'Groom Makeup', 'Groom styling and grooming session.', '', '[]', 'standard', 10000, 'per session', 'single', 2),
('addon-airbrush-makeup', ARRAY['wedding'], 'additional_services', 'addon-services', 'Airbrush Makeup', 'Premium airbrush bridal makeup upgrade.', '', '[]', 'luxury', 40000, 'per session', 'single', 3),
('addon-mehendi', ARRAY['wedding','haldi_function','bachelor_party'], 'additional_services', 'addon-services', 'Mehendi', 'Professional mehendi artist.', '', '[]', 'standard', 15000, 'per session', 'single', 4),
('addon-music-dj', ARRAY['wedding','engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'additional_services', 'addon-services', 'Music / DJ', 'Live DJ and sound setup for the event.', '', '[]', 'standard', 30000, 'per event', 'single', 5),
('addon-nadaswara', ARRAY['wedding','haldi_function','traditional_home_function'], 'additional_services', 'addon-services', 'Nadaswara', 'Traditional Nadaswaram performance troupe.', '', '[]', 'standard', 20000, 'per event', 'single', 6),
('addon-lighting', ARRAY['wedding','anniversary','get_together','other_events'], 'additional_services', 'addon-services', 'Lighting', 'Ambient event lighting design.', '', '[]', 'standard', 25000, 'setup', 'single', 7),
('addon-led-wall', ARRAY['wedding','engagement','corporate_event','reception'], 'additional_services', 'addon-services', 'LED Wall', 'Large-format LED wall display for the stage.', '', '[]', 'premium', 30000, 'per event', 'single', 8),
('addon-invitations', ARRAY['wedding'], 'additional_services', 'addon-services', 'Invitation Cards', 'Custom-designed printed invitations.', '', '[]', 'standard', 100, 'per card', 'stepper', 9),
('addon-return-gifts', ARRAY['wedding','birthday','reception','anniversary','get_together','housewarming','haldi_function','traditional_home_function'], 'additional_services', 'addon-services', 'Return Gifts', 'Curated return gifts for guests.', '', '[]', 'standard', 150, 'per guest', 'stepper', 10),
('addon-transportation', ARRAY['wedding','bachelor_party'], 'additional_services', 'addon-services', 'Transportation', 'Guest and family transportation coordination.', '', '[]', 'gold', 25000, 'per event', 'single', 11),
('addon-accommodation', ARRAY['wedding'], 'additional_services', 'addon-services', 'Guest Accommodation', 'Guest accommodation booking coordination.', '', '[]', 'gold', 5000, 'per room', 'stepper', 12),
('addon-coordination', ARRAY['wedding','corporate_event','reception','other_events'], 'additional_services', 'addon-services', 'Event Coordination', 'Dedicated day-of event coordinator and team.', '', '[]', 'premium', 35000, 'per event', 'single', 13)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 14. Additional Services Catalog Items (Birthday, Engagement, Corporate Event,
-- Housewarming, Haldi Function, Traditional Home Function, Bachelor Party, Get
-- Together)
INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('addon-kids-entertainment', ARRAY['birthday'], 'additional_services', 'addon-services', 'Kids Entertainment', 'Games, activities and entertainers for young guests.', '', '[]', 'standard', 12000, 'per event', 'single', 14),
('addon-magician', ARRAY['birthday'], 'additional_services', 'addon-services', 'Magician', 'Live magic show for the birthday celebration.', '', '[]', 'standard', 15000, 'per event', 'single', 15),
('addon-anchor', ARRAY['birthday','corporate_event','reception','anniversary'], 'additional_services', 'addon-services', 'Anchor / Host', 'Professional event anchor or emcee.', '', '[]', 'standard', 10000, 'per event', 'single', 16),
('addon-makeup-general', ARRAY['engagement','anniversary'], 'additional_services', 'addon-services', 'Makeup', 'Professional makeup and styling session.', '', '[]', 'standard', 15000, 'per session', 'single', 17),
('addon-audio-system', ARRAY['corporate_event'], 'additional_services', 'addon-services', 'Audio System', 'Professional PA and audio setup for the venue.', '', '[]', 'standard', 15000, 'per event', 'single', 18),
('addon-projector', ARRAY['corporate_event'], 'additional_services', 'addon-services', 'Projector', 'Projector and screen setup for presentations.', '', '[]', 'standard', 8000, 'per event', 'single', 19),
('addon-conference-seating', ARRAY['corporate_event'], 'additional_services', 'addon-services', 'Conference Seating', 'Rows or roundtable seating arrangement for delegates.', '', '[]', 'standard', 10000, 'setup', 'single', 20),
('addon-registration-desk', ARRAY['corporate_event'], 'additional_services', 'addon-services', 'Registration Desk', 'Branded registration and check-in desk setup.', '', '[]', 'standard', 6000, 'setup', 'single', 21),
('addon-purohit', ARRAY['wedding','housewarming','haldi_function','traditional_home_function'], 'additional_services', 'addon-services', 'Purohit / Pandit Services', 'Experienced purohit for rituals, samagri and muhurtham guidance.', '', '[]', 'standard', 15000, 'per event', 'single', 22),
('addon-bartender', ARRAY['bachelor_party'], 'additional_services', 'addon-services', 'Bartender Service', 'Professional bartender and mixology setup.', '', '[]', 'standard', 12000, 'per event', 'single', 23),
('addon-games-entertainment', ARRAY['get_together','bachelor_party'], 'additional_services', 'addon-services', 'Games & Entertainment', 'Party games, activities and entertainment coordination.', '', '[]', 'standard', 8000, 'per event', 'single', 24)
ON CONFLICT (id) DO UPDATE SET supported_event_types = EXCLUDED.supported_event_types;

-- 15. Six-tier Wedding Package Definitions (new ids; legacy pkg-silver/gold/diamond/royal
-- rows from seed.sql are untouched placeholder data, superseded going forward) ---
INSERT INTO wedding_packages (id, name, tagline, tier, base_price, guest_capacity, description, is_popular, event_type_id, package_level) VALUES
('pkg-normal', 'Normal Wedding Package', 'Simple & Elegant', 'silver', 250000, 200, 'Essential decor, catering and photography for an intimate wedding.', false, 'wedding', 'normal'),
('pkg-standard', 'Standard Wedding Package', 'Thoughtful Essentials', 'silver', 400000, 300, 'A well-rounded package covering all core wedding needs.', false, 'wedding', 'standard'),
('pkg-silver-tier', 'Silver Wedding Package', 'Elegant & Traditional', 'silver', 550000, 400, 'Traditional decor, full catering menu and candid coverage.', false, 'wedding', 'silver'),
('pkg-gold-tier', 'Gold Wedding Package', 'Our Most Popular Choice', 'gold', 800000, 600, 'Comprehensive luxury setup with live counters and drone coverage.', true, 'wedding', 'gold'),
('pkg-premium-tier', 'Premium Wedding Package', 'Opulent Grandeur', 'diamond', 1300000, 1000, 'Premium venues, cinematic films and extensive add-ons.', false, 'wedding', 'premium'),
('pkg-luxury-tier', 'Luxury Wedding Package', 'Regal Palace Level', 'royal', 2200000, 1500, 'Bespoke palace-level celebration with every premium inclusion.', false, 'wedding', 'luxury')
ON CONFLICT (id) DO NOTHING;

-- 16. Package Group Limits - demonstrates the Starters 2-vs-3 rule and
-- decoration-group overrides varying by package level.
INSERT INTO package_group_limits (package_id, group_id, max_selections, free_included_count) VALUES
('pkg-normal', 'cat-starters', 2, 2),
('pkg-standard', 'cat-starters', 2, 2),
('pkg-silver-tier', 'cat-starters', 3, 2),
('pkg-gold-tier', 'cat-starters', 3, 3),
('pkg-premium-tier', 'cat-starters', 3, 3),
('pkg-luxury-tier', 'cat-starters', 3, 3),
('pkg-normal', 'venue-options', 1, 0),
('pkg-standard', 'venue-options', 1, 0),
('pkg-silver-tier', 'venue-options', 1, 0),
('pkg-gold-tier', 'venue-options', 1, 0),
('pkg-premium-tier', 'venue-options', 1, 0),
('pkg-luxury-tier', 'venue-options', 1, 0)
ON CONFLICT (package_id, group_id) DO NOTHING;

-- 17. Package Included Items - representative starter inclusions per package.
-- Photography is not offered for Wedding events, so no photo-* items are included here.
INSERT INTO package_included_items (package_id, catalog_item_id, quantity) VALUES
('pkg-normal', 'dec-stage-01', 1), ('pkg-normal', 'dec-mandap-01', 1), ('pkg-normal', 'cater-wd-01', 1),
('pkg-standard', 'dec-stage-01', 1), ('pkg-standard', 'dec-mandap-01', 1), ('pkg-standard', 'cater-wd-02', 1),
('pkg-silver-tier', 'dec-stage-01', 1), ('pkg-silver-tier', 'dec-mandap-01', 1), ('pkg-silver-tier', 'dec-entrance-01', 1), ('pkg-silver-tier', 'cater-wd-02', 1),
('pkg-gold-tier', 'dec-stage-02', 1), ('pkg-gold-tier', 'dec-mandap-02', 1), ('pkg-gold-tier', 'dec-entrance-01', 1), ('pkg-gold-tier', 'cater-wd-03', 1), ('pkg-gold-tier', 'cater-live-01', 1),
('pkg-premium-tier', 'dec-stage-02', 1), ('pkg-premium-tier', 'dec-mandap-02', 1), ('pkg-premium-tier', 'dec-entrance-02', 1), ('pkg-premium-tier', 'cater-wd-03', 1), ('pkg-premium-tier', 'cater-live-01', 1), ('pkg-premium-tier', 'cater-live-02', 1),
('pkg-luxury-tier', 'dec-stage-03', 1), ('pkg-luxury-tier', 'dec-mandap-02', 1), ('pkg-luxury-tier', 'dec-entrance-02', 1), ('pkg-luxury-tier', 'cater-wd-03', 1), ('pkg-luxury-tier', 'cater-live-01', 1), ('pkg-luxury-tier', 'cater-live-02', 1), ('pkg-luxury-tier', 'venue-palace', 1)
ON CONFLICT (package_id, catalog_item_id) DO NOTHING;
