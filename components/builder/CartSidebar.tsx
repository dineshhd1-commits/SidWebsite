'use client';

import React from 'react';
import { EventBuilderState, CartLine } from '@/lib/types/event-builder';
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

        <div className="max-h-72 overflow-y-auto pr-1">
          {lines.length === 0 ? (
            <p className="text-xs text-gold-200/70 py-6 text-center">No items selected yet.</p>
          ) : (
            lines.map((line) => (
              <CartLineItemRow key={line.id} line={line} onRemove={onRemove} onViewDetails={onViewDetails} compact />
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
