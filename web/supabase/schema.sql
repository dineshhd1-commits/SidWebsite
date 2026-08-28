-- Kalyana South Indian Wedding Planner Database Schema

CREATE TABLE IF NOT EXISTS service_categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(100) PRIMARY KEY,
  category VARCHAR(50) REFERENCES service_categories(id),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  unit VARCHAR(50) DEFAULT 'setup',
  image_url TEXT,
  popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wedding_packages (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  tagline VARCHAR(255),
  tier VARCHAR(50) NOT NULL,
  base_price DECIMAL(12, 2) NOT NULL,
  guest_capacity INT DEFAULT 500,
  description TEXT,
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quotations (
  id VARCHAR(100) PRIMARY KEY,
  customer_name VARCHAR(200),
  customer_email VARCHAR(200),
  customer_phone VARCHAR(50),
  wedding_date DATE,
  venue_city VARCHAR(100),
  builder_state JSONB NOT NULL,
  price_breakdown JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inquiries (
  id VARCHAR(100) PRIMARY KEY,
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  wedding_date DATE,
  notes TEXT,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(100) PRIMARY KEY,
  quotation_id VARCHAR(100) REFERENCES quotations(id),
  customer_name VARCHAR(200) NOT NULL,
  email VARCHAR(200) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  wedding_date DATE NOT NULL,
  venue TEXT NOT NULL,
  guest_count INT DEFAULT 500,
  total_amount DECIMAL(12, 2) NOT NULL,
  advance_paid DECIMAL(12, 2) DEFAULT 0,
  payment_status VARCHAR(50) DEFAULT 'pending',
  booking_status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(100) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL,
  media_type VARCHAR(20) DEFAULT 'image',
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(100) PRIMARY KEY,
  couple_names VARCHAR(200) NOT NULL,
  wedding_date VARCHAR(100),
  location VARCHAR(200),
  rating INT DEFAULT 5,
  comment TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public read access to catalog data. This is the only access the
-- anon key gets on any table below: quotations/inquiries/bookings contain
-- customer PII and are read/written exclusively through Next.js API routes
-- using the service-role key (which bypasses RLS), and services/packages
-- writes go through those same authenticated routes - see
-- supabase/migrations/20260828000000_lockdown_rls.sql for the follow-up
-- migration that removed the public write/quotations-read policies this
-- file used to define.
CREATE POLICY "Public read services" ON services FOR SELECT USING (true);
CREATE POLICY "Public read packages" ON wedding_packages FOR SELECT USING (true);
CREATE POLICY "Public read gallery" ON gallery_items FOR SELECT USING (true);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (true);
