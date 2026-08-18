'use client';

import React, { useEffect, useRef, useState } from 'react';
import { EventBuilderState, CartLine } from '@/lib/types/event-builder';
import { useEventBuilder } from '@/lib/store/event-builder-context';
import { useCartSummary } from './useCartSummary';
import { CartLineItemRow } from './CartLineItemRow';
import { GlassCard } from '../ui/glass-card';
import { GoldButton } from '../ui/gold-button';

interface CartSidebarProps {
  state: EventBuilderState;
  currentStepLabel: string;
  totalSteps: number;
  currentStepIndex: number;
  onRemove: (id: string) => void;
  onViewDetails?: (line: CartLine) => void;
  onContinue: () => void;
  continueLabel?: string;
}

const HIGHLIGHT_MS = 1400;

export function CartSidebar({
  state,
  currentStepLabel,
  totalSteps,
  currentStepIndex,
  onRemove,
  onViewDetails,
  onContinue,
  continueLabel = 'Continue',
}: CartSidebarProps) {
  const { lines, itemCount } = useCartSummary(state);
  const { lastAdded } = useEventBuilder();
  const listRef = useRef<HTMLDivElement>(null);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);

  // When something new lands in the cart, flash it briefly so it's easy to
  // spot if this list is already on screen. Deliberately does NOT call
  // scrollIntoView: this sidebar is `position: sticky`, and scrollIntoView on
  // a descendant of a sticky element is a well-known cross-browser trap - the
  // browser can compute "is this visible?" off the element's static
  // (un-stuck) position in the document rather than its current stuck
  // position, and "helpfully" scroll the whole page to chase it. The
  // customer's actual confirmation that a selection landed is
  // AddedToCartToast (a fixed-position overlay, unaffected by any of this)
  // plus the selected-state highlight on the photo/card itself - neither of
  // which ever needs to move the viewport, so nothing here should either.
  useEffect(() => {
    if (!lastAdded) return;
    setHighlightedId(lastAdded.id);
    const timer = setTimeout(() => setHighlightedId(null), HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  return (
    <div className="hidden lg:block lg:col-span-4 sticky top-32 space-y-6">
      <GlassCard variant="dark" className="border-2 border-gold-400 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b border-gold-400/40 pb-3">
          <h3 className="font-playfair text-lg font-bold text-gold-300">Your Selections</h3>
          <span className="text-[10px] uppercase font-bold text-gold-200 bg-maroon-900 px-2 py-0.5 rounded border border-gold-400/40">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <p className="text-[11px] text-gold-200/70 -mt-2">Currently on: {currentStepLabel}</p>

        <div ref={listRef} className="max-h-72 overflow-y-auto pr-1">
          {lines.length === 0 ? (
            <p className="text-xs text-gold-200/70 py-6 text-center">No items selected yet.</p>
          ) : (
            lines.map((line) => (
              <CartLineItemRow
                key={line.id}
                line={line}
                onRemove={onRemove}
                onViewDetails={onViewDetails}
                highlighted={highlightedId === line.id}
                compact
              />
            ))
          )}
        </div>

        <div className="border-t border-gold-400/40 pt-4 space-y-1">
          <div className="flex justify-between text-xs text-gold-200/80">
            <span>{itemCount} item{itemCount === 1 ? '' : 's'} selected</span>
          </div>
          <p className="text-[10px] text-gold-200/60">Final pricing confirmed after enquiry.</p>
        </div>

        <GoldButton fullWidth variant="copper" size="md" onClick={onContinue}>
          {continueLabel}
        </GoldButton>
      </GlassCard>
    </div>
  );
}
