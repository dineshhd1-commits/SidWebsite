-- Renames the "Yellow Decoration" Home Decoration checklist item (wedding)
-- to "Haldi Decoration".
UPDATE catalog_items SET name = 'Haldi Decoration' WHERE id = 'dec-home-yellow';
