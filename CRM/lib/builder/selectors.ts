import { CatalogGroup, PackageGroupLimit } from '../types/catalog';
import { CartLine, EventBuilderState } from '../types/event-builder';

export function getCartLines(state: EventBuilderState): CartLine[] {
  return Object.values(state.cart);
}

export function getLinesByGroup(state: EventBuilderState, groupId: string): CartLine[] {
  return getCartLines(state).filter((line) => line.groupId === groupId);
}

export function getGroupSelectionCount(state: EventBuilderState, groupId: string): number {
  return getLinesByGroup(state, groupId).reduce((sum, line) => sum + line.quantity, 0);
}

export function getIncludedTotal(state: EventBuilderState): number {
  return getCartLines(state)
    .filter((line) => line.origin === 'included')
    .reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function getPaidExtraTotal(state: EventBuilderState): number {
  return getCartLines(state)
    .filter((line) => line.origin === 'paid_extra')
    .reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function getRequestedExtraLines(state: EventBuilderState): CartLine[] {
  return getCartLines(state).filter((line) => line.origin === 'requested_extra');
}

export function getEstimatedTotal(state: EventBuilderState): number {
  return getIncludedTotal(state) + getPaidExtraTotal(state);
}

export function getCartItemCount(state: EventBuilderState): number {
  return getCartLines(state).reduce((sum, line) => sum + line.quantity, 0);
}

/** Effective max selections for a group, honoring a package-specific override over the group default. */
export function getEffectiveGroupLimit(
  group: CatalogGroup,
  packageLimit: PackageGroupLimit | undefined
): { maxSelections: number | null; freeIncludedCount: number } {
  if (packageLimit) {
    return { maxSelections: packageLimit.maxSelections, freeIncludedCount: packageLimit.freeIncludedCount };
  }
  return { maxSelections: group.defaultMaxSelections, freeIncludedCount: group.freeIncludedCount };
}
