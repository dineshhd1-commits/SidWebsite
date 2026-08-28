-- Adds Drone Photography to the Deverakarya group, and Traditional/Candid
-- Photography + Traditional/Candid Videography to the Wedding Hall group,
-- alongside its existing items (Drone, LED Wall, Live Streaming). These are
-- deliberately separate line items from their Deverakarya counterparts,
-- since a couple may want coverage booked separately for the ceremony
-- location vs. the wedding hall reception.

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('photo-deverakarya-drone', ARRAY['wedding'], 'photography', 'photo-deverakarya', 'Drone Photography', '4K aerial drone coverage of the Deverakarya ceremony.', '', '[]', 'gold', 20000, 'per event', 'single', '{}', 5),
('photo-hall-traditional-photo', ARRAY['wedding'], 'photography', 'photo-wedding-hall', 'Traditional Photography', 'Classic posed traditional photography for the wedding hall reception.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 4),
('photo-hall-candid-photo', ARRAY['wedding'], 'photography', 'photo-wedding-hall', 'Candid Photography', 'Storytelling candid photography coverage of the wedding hall reception.', '', '[]', 'gold', 35000, 'per event', 'team_size', '{"teamSize": 2}', 5),
('photo-hall-traditional-video', ARRAY['wedding'], 'photography', 'photo-wedding-hall', 'Traditional Videography', 'Classic full-event traditional videography of the wedding hall reception.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 6),
('photo-hall-candid-video', ARRAY['wedding'], 'photography', 'photo-wedding-hall', 'Candid Videography', 'Cinematic candid videography coverage of the wedding hall reception.', '', '[]', 'gold', 40000, 'per event', 'team_size', '{"teamSize": 2}', 7)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  display_order = EXCLUDED.display_order;
