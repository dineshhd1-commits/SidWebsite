-- Adds a new "Welcome Girls" decoration category (its own section, separate
-- from Couple Entry), right after Couple Entry in display order.
-- Mirrors supabase/seed_event_builder.sql and lib/data/mock-catalog-data.ts.

INSERT INTO catalog_groups (id, supported_event_types, category_key, name, default_max_selections, free_included_count, requires_approval_after_limit, approval_message, display_order, active) VALUES
('dec-welcome-girls', ARRAY['wedding'], 'decoration', 'Welcome Girls', NULL, 0, false, NULL, 5, true)
ON CONFLICT (id) DO UPDATE SET
  supported_event_types = EXCLUDED.supported_event_types,
  name = EXCLUDED.name,
  display_order = EXCLUDED.display_order,
  active = true;

INSERT INTO catalog_items (id, supported_event_types, category_key, group_id, name, description, image_url, images, package_level, price, unit, quantity_mode, display_order) VALUES
('dec-welcome-girls-service', ARRAY['wedding'], 'decoration', 'dec-welcome-girls', 'Welcome Girls', 'Welcome girls to greet and escort guests with flowers and aarti.', '', '[]', 'normal', 5000, 'per event', 'single', 1)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, price = EXCLUDED.price, display_order = EXCLUDED.display_order, active = true;
