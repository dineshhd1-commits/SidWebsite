-- Replaces the non-Wedding photo-services lineup (previously Event
-- Photography, Event Videography, Live Streaming) with exactly five options:
-- Traditional Photography, Candid Photography, Traditional Videography,
-- Candid Videography and Drone. Wedding's Deverakarya / Wedding Hall split
-- from the previous migration is untouched.

UPDATE catalog_items SET supported_event_types = ARRAY[]::text[]
WHERE id IN ('photo-event-photo', 'photo-event-video', 'photo-live-streaming');

DELETE FROM package_included_items
WHERE catalog_item_id IN ('photo-event-photo', 'photo-event-video', 'photo-live-streaming');

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, metadata, display_order) VALUES
('photo-other-traditional-photo', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Traditional Photography', 'Classic posed traditional photography coverage.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 14),
('photo-other-candid-photo', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Candid Photography', 'Storytelling candid photography coverage.', '', '[]', 'gold', 35000, 'per event', 'team_size', '{"teamSize": 2}', 15),
('photo-other-traditional-video', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Traditional Videography', 'Classic full-event traditional videography.', '', '[]', 'normal', 15000, 'per event', 'team_size', '{"teamSize": 1}', 16),
('photo-other-candid-video', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Candid Videography', 'Cinematic candid videography coverage.', '', '[]', 'gold', 40000, 'per event', 'team_size', '{"teamSize": 2}', 17),
('photo-other-drone', ARRAY['engagement','reception','birthday','anniversary','get_together','bachelor_party','housewarming','haldi_function','corporate_event','traditional_home_function','other_events'], 'photography', 'photo-services', 'Drone', '4K aerial drone coverage of the venue and celebrations.', '', '[]', 'gold', 20000, 'per event', 'single', '{}', 18)
ON CONFLICT (id) DO UPDATE SET
  supported_event_types = EXCLUDED.supported_event_types,
  active = true;
