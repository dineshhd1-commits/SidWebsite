import { CatalogGroup, PackageGroupLimit } from '../types/catalog';
import { EventBuilderState } from '../types/event-builder';
import { getEffectiveGroupLimit, getGroupSelectionCount } from './selectors';

export type AddDecision =
  | { allowed: true }
  | { allowed: false; reason: 'limit_reached'; requiresApproval: boolean; approvalMessage: string | null }
  | { allowed: false; reason: 'group_inactive' };

/**
 * Central selection-limit check reused by Decoration, Catering and Venue steps.
 * Never mutates state or the cart - callers decide what to do with the decision
 * (lock the button, open the replace-confirmation modal, open the approval modal, etc).
 */
export function canAddToGroup(
  state: EventBuilderState,
  group: CatalogGroup,
  packageLimit: PackageGroupLimit | undefined,
  incomingQuantity: number = 1
): AddDecision {
  if (!group.active) {
    return { allowed: false, reason: 'group_inactive' };
  }

  const { maxSelections } = getEffectiveGroupLimit(group, packageLimit);
  if (maxSelections === null) {
    return { allowed: true };
  }

  const currentCount = getGroupSelectionCount(state, group.id);
  if (currentCount + incomingQuantity <= maxSelections) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason: 'limit_reached',
    requiresApproval: group.requiresApprovalAfterLimit,
    approvalMessage: group.approvalMessage,
  };
}

export function isGroupLocked(
  state: EventBuilderState,
  group: CatalogGroup,
  packageLimit: PackageGroupLimit | undefined
): boolean {
  const { maxSelections } = getEffectiveGroupLimit(group, packageLimit);
  if (maxSelections === null) return false;
  return getGroupSelectionCount(state, group.id) >= maxSelections;
}
