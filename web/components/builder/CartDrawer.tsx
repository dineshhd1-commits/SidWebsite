'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Trash2 } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { CartLine } from '@/lib/types/event-builder';
import { useCartSummary } from './useCartSummary';
import { CartLineItemRow } from './CartLineItemRow';
import { GoldButton } from '../ui/gold-button';

interface CartDrawerProps {
  state: EventBuilderState;
  open: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onClearCart: () => void;
  onContinue: () => void;
  onViewDetails?: (line: CartLine) => void;
}

export function CartDrawer({ state, open, onClose, onRemove, onClearCart, onContinue, onViewDetails }: CartDrawerProps) {
  const { lines, requestedExtras, itemCount } = useCartSummary(state);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-maroon-950 text-silk-50 z-[70] shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gold-400/30">
              <h3 className="font-playfair text-lg font-bold text-gold-300">Your Package Cart</h3>
              <button onClick={onClose} className="p-1.5 text-gold-300 hover:text-white" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 && requestedExtras.length === 0 ? (
                <p className="text-xs text-gold-200/70 text-center py-10">
                  Your cart is empty. Start selecting services to build your package.
                </p>
              ) : (
                <div className="space-y-1">
                  {lines.map((line) => (
                    <CartLineItemRow key={line.id} line={line} onRemove={onRemove} onViewDetails={onViewDetails} />
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gold-400/30 p-5 space-y-3">
              <p className="text-[10px] text-gold-200/60">
                Final pricing is confirmed by our team after your enquiry.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={onClearCart}
                  disabled={itemCount === 0}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider bg-maroon-900 text-gold-200 border border-gold-400/30 hover:bg-black disabled:opacity-40"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                </button>
                <GoldButton variant="gold" size="sm" fullWidth onClick={onContinue} className="flex-1">
                  Continue
                </GoldButton>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
