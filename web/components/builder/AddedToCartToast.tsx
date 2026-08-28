'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useEventBuilder } from '@/lib/store/event-builder-context';

const VISIBLE_MS = 2200;

/** Lightweight "Added to selections" confirmation - a fixed-position toast
 * that appears the instant something is added anywhere in the builder and
 * fades itself out. Purely an overlay: it never scrolls or moves the page,
 * so it works the same whether the customer is mid-scroll on mobile or
 * browsing a step on desktop. */
export function AddedToCartToast() {
  const { lastAdded } = useEventBuilder();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastAdded) return;
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [lastAdded]);

  return (
    <AnimatePresence>
      {visible && lastAdded && (
        <motion.div
          key={lastAdded.token}
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-[60] max-w-xs bg-maroon-950 text-silk-50 border border-gold-400/50 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-2.5"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gold-200 leading-snug">Added to your selections</p>
            <p className="text-[11px] text-silk-100/80 truncate">{lastAdded.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
