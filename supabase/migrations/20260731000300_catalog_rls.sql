-- RLS for the new catalog tables: public read only. Unlike the pre-existing
-- fully-open write policies on services/wedding_packages, these tables get NO
-- open write policy - all writes must go through service-role-only admin API routes.

ALTER TABLE event_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_included_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE package_group_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read event_types" ON event_types FOR SELECT USING (true);
CREATE POLICY "Public read package_levels" ON package_levels FOR SELECT USING (true);
CREATE POLICY "Public read catalog_groups" ON catalog_groups FOR SELECT USING (true);
CREATE POLICY "Public read catalog_items" ON catalog_items FOR SELECT USING (true);
CREATE POLICY "Public read package_included_items" ON package_included_items FOR SELECT USING (true);
CREATE POLICY "Public read package_group_limits" ON package_group_limits FOR SELECT USING (true);

CREATE POLICY "Service role write event_types" ON event_types FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write package_levels" ON package_levels FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write catalog_groups" ON catalog_groups FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write catalog_items" ON catalog_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write package_included_items" ON package_included_items FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role write package_group_limits" ON package_group_limits FOR ALL USING (auth.role() = 'service_role');
