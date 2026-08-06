-- Event Builder catalog tables: event types, package levels, decoration/photography/
-- catering/venue/additional-services groups + items, and package composition.

CREATE TABLE IF NOT EXISTS event_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  short_description TEXT,
  image_url TEXT,
  is_catalog_ready BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS package_levels (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  rank INT NOT NULL,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS catalog_groups (
  id VARCHAR(100) PRIMARY KEY,
  supported_event_types TEXT[] NOT NULL DEFAULT '{}',
  category_key VARCHAR(30) NOT NULL CHECK (category_key IN ('decoration', 'photography', 'catering', 'venue', 'additional_services')),
  name VARCHAR(150) NOT NULL,
  default_max_selections INT,
  free_included_count INT DEFAULT 0,
  requires_approval_after_limit BOOLEAN DEFAULT false,
  approval_message TEXT,
  display_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id VARCHAR(120) PRIMARY KEY,
  supported_event_types TEXT[] NOT NULL DEFAULT '{}',
  category_key VARCHAR(30) NOT NULL CHECK (category_key IN ('decoration', 'photography', 'catering', 'venue', 'additional_services')),
  group_id VARCHAR(100) REFERENCES catalog_groups(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  package_level VARCHAR(20) REFERENCES package_levels(id),
  price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'item',
  quantity_mode VARCHAR(20) DEFAULT 'single' CHECK (quantity_mode IN ('single', 'stepper', 'team_size')),
  max_quantity INT,
  max_selections_override INT,
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Extend the existing wedding_packages table with event-type + 6-level package_level,
-- while keeping the legacy `tier` column untouched during the transition.
ALTER TABLE wedding_packages ADD COLUMN IF NOT EXISTS event_type_id VARCHAR(50) DEFAULT 'wedding';
ALTER TABLE wedding_packages ADD COLUMN IF NOT EXISTS package_level VARCHAR(20);

CREATE TABLE IF NOT EXISTS package_included_items (
  package_id VARCHAR(100) REFERENCES wedding_packages(id) ON DELETE CASCADE,
  catalog_item_id VARCHAR(120) REFERENCES catalog_items(id) ON DELETE CASCADE,
  quantity INT DEFAULT 1,
  PRIMARY KEY (package_id, catalog_item_id)
);

CREATE TABLE IF NOT EXISTS package_group_limits (
  package_id VARCHAR(100) REFERENCES wedding_packages(id) ON DELETE CASCADE,
  group_id VARCHAR(100) REFERENCES catalog_groups(id) ON DELETE CASCADE,
  max_selections INT NOT NULL,
  free_included_count INT DEFAULT 0,
  PRIMARY KEY (package_id, group_id)
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_category ON catalog_items(category_key);
CREATE INDEX IF NOT EXISTS idx_catalog_groups_category ON catalog_groups(category_key);
CREATE INDEX IF NOT EXISTS idx_catalog_items_event_types ON catalog_items USING GIN (supported_event_types);
CREATE INDEX IF NOT EXISTS idx_catalog_groups_event_types ON catalog_groups USING GIN (supported_event_types);
