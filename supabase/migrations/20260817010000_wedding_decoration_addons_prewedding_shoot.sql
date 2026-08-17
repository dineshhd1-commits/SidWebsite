-- Adds Wedding-only decoration add-on checklists (Home Decoration, Venue
-- Decoration, Couple Entry) and a new Pre-Wedding Shoot photography section
-- (duration pick + service checklist). Mirrors supabase/seed_event_builder.sql
-- and lib/data/mock-catalog-data.ts.

INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('dec-home', ARRAY['wedding'], 'decoration', 'Home Decoration', NULL, 0, false, NULL, 2, true),
('dec-venue', ARRAY['wedding'], 'decoration', 'Venue Decoration', NULL, 0, false, NULL, 3, true),
('dec-couple-entry', ARRAY['wedding'], 'decoration', 'Couple Entry', NULL, 0, false, NULL, 4, true),
('photo-prewedding-duration', ARRAY['wedding'], 'photography', 'Pre-Wedding Shoot Duration', 1, 0, false, NULL, 3, true),
('photo-prewedding-services', ARRAY['wedding'], 'photography', 'Pre-Wedding Shoot', NULL, 0, false, NULL, 4, true)
ON CONFLICT (id) DO UPDATE SET
  supported_event_types = EXCLUDED.supported_event_types,
  name = EXCLUDED.name,
  default_max_selections = EXCLUDED.default_max_selections,
  display_order = EXCLUDED.display_order;

UPDATE catalog_groups SET display_order = 5 WHERE id = 'photo-services';

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-home-house-lighting', ARRAY['wedding'], 'decoration', 'dec-home', 'House Lighting', 'Decorative lighting across the home for the wedding occasion.', '', '[]', 'normal', 8000, 'per event', 'single', 1),
('dec-home-chapra', ARRAY['wedding'], 'decoration', 'dec-home', 'Chapra Decoration', 'Traditional chapra (canopy) decoration with flowers and drapery.', '', '[]', 'gold', 12000, 'per event', 'single', 2),
('dec-home-front-door', ARRAY['wedding'], 'decoration', 'dec-home', 'Front Door Decoration', 'Floral and festive decoration for the main entrance of the house.', '', '[]', 'normal', 6000, 'per event', 'single', 3),
('dec-home-pooja-door', ARRAY['wedding'], 'decoration', 'dec-home', 'Pooja Door Decoration', 'Decoration for the pooja room door with flowers and toran.', '', '[]', 'normal', 4000, 'per event', 'single', 4),
('dec-home-yellow', ARRAY['wedding'], 'decoration', 'dec-home', 'Yellow Decoration', 'Traditional yellow-themed decor for the pre-wedding rituals.', '', '[]', 'normal', 5000, 'per event', 'single', 5),
('dec-home-mehendi', ARRAY['wedding'], 'decoration', 'dec-home', 'Mehendi', 'Decor setup for the Mehendi ceremony seating and backdrop.', '', '[]', 'normal', 6000, 'per event', 'single', 6),
('dec-home-led-par-light', ARRAY['wedding'], 'decoration', 'dec-home', 'LED Par Light', 'LED par light setup for ambient event lighting.', '', '[]', 'normal', 5000, 'per event', 'single', 7),
('dec-venue-entrance-name-board', ARRAY['wedding'], 'decoration', 'dec-venue', 'Entrance Name Board', 'Personalised name board decoration at the venue entrance.', '', '[]', 'normal', 4000, 'per event', 'single', 1),
('dec-venue-pathway', ARRAY['wedding'], 'decoration', 'dec-venue', 'Pathway', 'Decorated walkway leading up to the venue.', '', '[]', 'normal', 8000, 'per event', 'single', 2),
('dec-venue-stage-decor', ARRAY['wedding'], 'decoration', 'dec-venue', 'Stage Decor', 'Complete stage decoration with florals, drapery and lighting.', '', '[]', 'gold', 30000, 'per event', 'single', 3),
('dec-venue-muhuratha-mantapa', ARRAY['wedding'], 'decoration', 'dec-venue', 'Muhuratha Mantapa', 'Traditional decoration of the muhuratha mantapa for the ceremony.', '', '[]', 'gold', 25000, 'per event', 'single', 4),
('dec-venue-sapthapadi', ARRAY['wedding'], 'decoration', 'dec-venue', 'Sapthapadi', 'Decorated setup for the Sapthapadi (seven steps) ritual.', '', '[]', 'normal', 6000, 'per event', 'single', 5),
('dec-venue-phonebooth', ARRAY['wedding'], 'decoration', 'dec-venue', 'Phonebooth', 'Decorated photo/phone booth setup for guests.', '', '[]', 'normal', 5000, 'per event', 'single', 6),
('dec-venue-garlands', ARRAY['wedding'], 'decoration', 'dec-venue', 'Garlands', 'Fresh flower garlands for the ceremony.', '', '[]', 'normal', 4000, 'per event', 'single', 7),
('dec-venue-music-system', ARRAY['wedding'], 'decoration', 'dec-venue', 'Music System with Mic', 'Sound system and microphone setup for the venue.', '', '[]', 'normal', 8000, 'per event', 'single', 8),
('dec-venue-mogina-jade', ARRAY['wedding'], 'decoration', 'dec-venue', 'Mogina Jade', 'Traditional mogina jade (floral string) decoration.', '', '[]', 'normal', 3000, 'per event', 'single', 9),
('dec-venue-harani-bashige', ARRAY['wedding'], 'decoration', 'dec-venue', 'Harani Bashige', 'Traditional harani bashige setup for the ceremony.', '', '[]', 'normal', 3000, 'per event', 'single', 10),
('dec-venue-nadaswara', ARRAY['wedding'], 'decoration', 'dec-venue', 'Nadaswara', 'Live Nadaswara musicians for the ceremony.', '', '[]', 'gold', 10000, 'per event', 'single', 11),
('dec-couple-cold-fair', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Cold Fair', 'Cold pyro entry effect for the couple.', '', '[]', 'gold', 5000, 'per event', 'single', 1),
('dec-couple-fog-machine', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Fog Machine', 'Fog effect for a dramatic couple entry.', '', '[]', 'normal', 6000, 'per event', 'single', 2),
('dec-couple-welcome-bouquet', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Welcome Bouquet', 'Fresh flower bouquet to welcome the couple.', '', '[]', 'normal', 3000, 'per event', 'single', 3),
('dec-couple-crackers', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Crackers', 'Celebratory crackers for the couple entry.', '', '[]', 'normal', 4000, 'per event', 'single', 4),
('dec-couple-fireworks', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Fire Works', 'Fireworks display for a grand couple entry.', '', '[]', 'gold', 8000, 'per event', 'single', 5),
('dec-couple-dole', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Dole', 'Traditional dole (palanquin) entry for the couple.', '', '[]', 'gold', 6000, 'per event', 'single', 6),
('dec-couple-dancer', ARRAY['wedding'], 'decoration', 'dec-couple-entry', 'Dancer', 'Professional dancers to lead the couple entry.', '', '[]', 'gold', 10000, 'per event', 'single', 7)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, display_order = EXCLUDED.display_order;

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('photo-prewedding-1-day', ARRAY['wedding'], 'photography', 'photo-prewedding-duration', '1 Day', 'Pre-wedding shoot scheduled across a single day.', '', '[]', 'normal', 0, 'shoot', 'single', '{"days": 1}', 1),
('photo-prewedding-2-day', ARRAY['wedding'], 'photography', 'photo-prewedding-duration', '2 Days', 'Pre-wedding shoot scheduled across two days.', '', '[]', 'gold', 0, 'shoot', 'single', '{"days": 2}', 2),
('photo-prewedding-photographer', ARRAY['wedding'], 'photography', 'photo-prewedding-services', 'Photographer', 'Dedicated photographer for the pre-wedding shoot.', '', '[]', 'normal', 20000, 'per event', 'single', '{}', 1),
('photo-prewedding-cinematic-video', ARRAY['wedding'], 'photography', 'photo-prewedding-services', 'Cinematic Video', 'Cinematic video coverage of the pre-wedding shoot.', '', '[]', 'gold', 30000, 'per event', 'single', '{}', 2),
('photo-prewedding-drone', ARRAY['wedding'], 'photography', 'photo-prewedding-services', 'Drone', '4K aerial drone coverage for the pre-wedding shoot.', '', '[]', 'gold', 15000, 'per event', 'single', '{}', 3)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, display_order = EXCLUDED.display_order;
