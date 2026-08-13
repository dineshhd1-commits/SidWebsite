-- Removes the Snacks catering category. Deactivated rather than deleted, since
-- existing quotations and saved carts may still reference these ids.

UPDATE catalog_groups SET active = false WHERE id = 'cat-snacks';

UPDATE catalog_items
SET supported_event_types = ARRAY[]::text[], active = false
WHERE group_id = 'cat-snacks';

DELETE FROM package_included_items
WHERE catalog_item_id IN ('cater-snack-01', 'cater-snack-02', 'cater-snack-03', 'cater-snack-04');

DELETE FROM package_group_limits WHERE group_id = 'cat-snacks';
