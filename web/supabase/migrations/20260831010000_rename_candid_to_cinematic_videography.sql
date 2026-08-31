-- Renames "Candid Videography" to "Cinematic Videography" across all three
-- photography line items that use it (Deverakarya, Wedding Hall, and the
-- shared photo-services group for every non-wedding event type). Mirrors
-- lib/data/mock-catalog-data.ts, which already used "Cinematic Videography"
-- for these ids while production Supabase still had the old name.
UPDATE catalog_items SET name = 'Cinematic Videography'
WHERE id IN ('photo-candid-video', 'photo-hall-candid-video', 'photo-other-candid-video');
