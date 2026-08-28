import { PackageLevelId } from '../types/catalog';

export const PACKAGE_LEVEL_RANK: Record<PackageLevelId, number> = {
  normal: 0,
  standard: 1,
  silver: 2,
  gold: 3,
  premium: 4,
  luxury: 5,
  platinum: 6,
};

export const PACKAGE_LEVEL_NAMES: Record<PackageLevelId, string> = {
  normal: 'Normal',
  standard: 'Standard',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Premium',
  luxury: 'Luxury',
  platinum: 'Platinum',
};

/** True when an item's package level is higher than the customer's currently
 * selected package - the trigger for the package-upgrade popup. If no package
 * is selected yet, nothing is gated (there's no baseline to upgrade from). */
export function isGatedByPackage(itemLevel: PackageLevelId, currentPackageLevel: PackageLevelId | null): boolean {
  if (!currentPackageLevel) return false;
  return PACKAGE_LEVEL_RANK[itemLevel] > PACKAGE_LEVEL_RANK[currentPackageLevel];
}
