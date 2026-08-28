-- Wraps the "replace a package's included items + group limits" operation
-- (previously four separate delete/insert calls from the API route, with no
-- rollback - a failure between the two pairs left the package with zero
-- included items until manually retried) in a single Postgres function, so
-- Supabase runs all four statements as one transaction: either the full
-- replacement lands, or none of it does.

CREATE OR REPLACE FUNCTION replace_package_items(
  p_package_id VARCHAR(100),
  p_included_items JSONB, -- [{ "catalogItemId": "...", "quantity": 1 }, ...]
  p_group_limits JSONB    -- [{ "groupId": "...", "maxSelections": 1, "freeIncludedCount": 0 }, ...]
) RETURNS VOID
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM package_included_items WHERE package_id = p_package_id;

  INSERT INTO package_included_items (package_id, catalog_item_id, quantity)
  SELECT p_package_id, (item->>'catalogItemId')::VARCHAR(120), COALESCE((item->>'quantity')::INT, 1)
  FROM jsonb_array_elements(p_included_items) AS item;

  DELETE FROM package_group_limits WHERE package_id = p_package_id;

  INSERT INTO package_group_limits (package_id, group_id, max_selections, free_included_count)
  SELECT
    p_package_id,
    (lim->>'groupId')::VARCHAR(100),
    (lim->>'maxSelections')::INT,
    COALESCE((lim->>'freeIncludedCount')::INT, 0)
  FROM jsonb_array_elements(p_group_limits) AS lim;
END;
$$;
