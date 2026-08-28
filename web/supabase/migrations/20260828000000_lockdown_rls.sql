-- Locks down RLS policies that were left wide open (`USING (true)`) from the
-- original schema.sql, after the app was rebuilt to route every quotation/
-- inquiry/package write and every quotation/inquiry read through
-- authenticated Next.js API routes using the Supabase service-role key
-- (which bypasses RLS entirely and therefore needs no policy here).
--
-- Until this migration, the public anon key - shipped in the client JS
-- bundle by design - still had direct, unauthenticated SELECT/UPDATE/DELETE
-- access to `quotations` and `inquiries` (full customer PII: name, phone,
-- email, address, guest count, full order breakdown) and direct INSERT/
-- UPDATE/DELETE access to `wedding_packages` (live pricing) via Supabase's
-- own REST API, regardless of anything enforced in the Next.js layer.
--
-- `quotations`/`inquiries`/`bookings` end up with zero anon-key policies at
-- all after this migration: every remaining write path
-- (web/app/api/enquiry/route.ts, web/lib/store/admin-store.ts's
-- saveCorporateDecorationEnquiry) now goes through the service role, so no
-- anon INSERT policy is needed either. `services`/`wedding_packages` keep
-- their public SELECT policies (legitimately public marketing content) but
-- lose their public write policies for the same reason.

DROP POLICY IF EXISTS "Public insert quotations" ON quotations;
DROP POLICY IF EXISTS "Public read quotations" ON quotations;
DROP POLICY IF EXISTS "Allow update quotations" ON quotations;
DROP POLICY IF EXISTS "Allow delete quotations" ON quotations;

DROP POLICY IF EXISTS "Public insert inquiries" ON inquiries;
DROP POLICY IF EXISTS "Public read inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow update inquiries" ON inquiries;
DROP POLICY IF EXISTS "Allow delete inquiries" ON inquiries;

DROP POLICY IF EXISTS "Public insert bookings" ON bookings;
DROP POLICY IF EXISTS "Public read bookings" ON bookings;

DROP POLICY IF EXISTS "Allow write services" ON services;
DROP POLICY IF EXISTS "Allow write packages" ON wedding_packages;
