-- Make gallery + testimonials admin-manageable (active toggle, ordering, verification flag).

ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
ALTER TABLE gallery_items ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS is_google_verified BOOLEAN DEFAULT true;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true;
