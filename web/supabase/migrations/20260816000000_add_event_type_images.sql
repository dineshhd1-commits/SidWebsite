-- Adds photos for every event type on the Packages page. All 12 non-Wedding
-- event types get a real photo supplied by the user (public/packages/); Other
-- Events gets the site's brand mark instead, since it has no dedicated photo.

UPDATE event_types SET image_url = '/packages/engagement.jpg' WHERE id = 'engagement';
UPDATE event_types SET image_url = '/packages/reception.jpg' WHERE id = 'reception';
UPDATE event_types SET image_url = '/packages/birthday.jpg' WHERE id = 'birthday';
UPDATE event_types SET image_url = '/packages/anniversary.jpg' WHERE id = 'anniversary';
UPDATE event_types SET image_url = '/packages/get-together.jpg' WHERE id = 'get_together';
UPDATE event_types SET image_url = '/packages/bachelor-party.jpg' WHERE id = 'bachelor_party';
UPDATE event_types SET image_url = '/packages/housewarming.jpg' WHERE id = 'housewarming';
UPDATE event_types SET image_url = '/packages/haldi-function.jpg' WHERE id = 'haldi_function';
UPDATE event_types SET image_url = '/packages/corporate-event.jpg' WHERE id = 'corporate_event';
UPDATE event_types SET image_url = '/packages/traditional-home-function.jpg' WHERE id = 'traditional_home_function';
UPDATE event_types SET image_url = '/packages/shrimantha-karya.jpg' WHERE id = 'shrimantha_karya';
UPDATE event_types SET image_url = '/packages/half-saree-function.jpg' WHERE id = 'half_saree_function';
UPDATE event_types SET image_url = '/packages/other-events.jpg' WHERE id = 'other_events';
