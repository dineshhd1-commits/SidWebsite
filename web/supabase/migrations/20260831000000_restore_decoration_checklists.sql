-- Fixes a production data bug: migration 20260808020000 deactivated every
-- decoration checklist group/item (Home/Venue/Couple Entry/Security, across
-- wedding/engagement/reception/anniversary) in favor of a Silver/Gold/Platinum
-- tier model. The custom-builder frontend (app/custom-builder/steps/
-- DecorationStep.tsx) was never switched over to the tier model though - it
-- still queries and renders those checklist groups directly - so from that
-- migration onward the Decoration step rendered almost nothing (later
-- attempts in 20260817010000/20260817020000 to restore the wedding checklist
-- didn't take effect in production because their ON CONFLICT clauses didn't
-- reset `active`, now fixed alongside this migration).
--
-- This reactivates all decoration checklist data. The dec-package tier items
-- stay active too (they already are) - they're just currently unused by the
-- frontend, left in place rather than deactivated in case that UI returns.
UPDATE catalog_groups SET active = true WHERE category_key = 'decoration';

UPDATE catalog_items SET active = true WHERE category_key = 'decoration';
