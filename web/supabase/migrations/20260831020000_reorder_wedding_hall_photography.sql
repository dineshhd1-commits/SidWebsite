-- Reorders the Wedding Hall photography checklist to lead with the
-- photography items, then videography, then AV/services: Traditional
-- Photography, Candid Photography, Traditional Videography, Cinematic
-- Videography, Live Streaming, LED Wall, Drone (was the reverse).
UPDATE catalog_items SET display_order = 1 WHERE id = 'photo-hall-traditional-photo';
UPDATE catalog_items SET display_order = 2 WHERE id = 'photo-hall-candid-photo';
UPDATE catalog_items SET display_order = 3 WHERE id = 'photo-hall-traditional-video';
UPDATE catalog_items SET display_order = 4 WHERE id = 'photo-hall-candid-video';
UPDATE catalog_items SET display_order = 5 WHERE id = 'photo-wedding-live-streaming';
UPDATE catalog_items SET display_order = 6 WHERE id = 'photo-led-wall';
UPDATE catalog_items SET display_order = 7 WHERE id = 'photo-drone' AND group_id = 'photo-wedding-hall';
