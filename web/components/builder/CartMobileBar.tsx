'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { useCartSummary } from './useCartSummary';

interface CartMobileBarProps {
  state: EventBuilderState;
  onOpen: () => void;
}

export function CartMobileBar({ state, onOpen }: CartMobileBarProps) {
  const { itemCount } = useCartSummary(state);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-maroon-950 text-gold-200 border-t border-gold-400/40 px-4 py-3 flex items-center justify-between shadow-2xl"
    >
      <span className="flex items-center gap-2 text-xs font-bold">
        <ShoppingBag className="w-4 h-4" /> {itemCount} item{itemCount === 1 ? '' : 's'}
      </span>
      <span className="flex items-center gap-2 text-xs font-bold">
        <span className="uppercase tracking-wider text-gold-400 underline">View Cart</span>
      </span>
    </button>
  );
}
