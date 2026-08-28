import { useMemo } from 'react';
import { EventBuilderState } from '@/lib/types/event-builder';
import {
  getCartItemCount,
  getCartLines,
  getEstimatedTotal,
  getIncludedTotal,
  getPaidExtraTotal,
  getRequestedExtraLines,
} from '@/lib/builder/selectors';

export function useCartSummary(state: EventBuilderState) {
  return useMemo(
    () => ({
      lines: getCartLines(state),
      requestedExtras: getRequestedExtraLines(state),
      itemCount: getCartItemCount(state),
      includedTotal: getIncludedTotal(state),
      paidExtraTotal: getPaidExtraTotal(state),
      estimatedTotal: getEstimatedTotal(state),
    }),
    [state]
  );
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
