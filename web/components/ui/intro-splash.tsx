'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BrandMark } from './brand-mark';
import { SITE } from '@/lib/site-config';

const SESSION_KEY = 'sid_intro_seen';

export const IntroSplash: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) return;

    // Purely decorative - the rest of the page renders and is interactive
    // underneath it immediately, it just isn't blocked on this finishing.
    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] bg-maroon-950 flex items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-4 text-center px-4"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <BrandMark className="w-28 h-28 shadow-2xl" />
            </motion.div>

            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-maroon-900/90 border border-gold-400/40 text-gold-300 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              {SITE.tagline}
            </span>

            <h1 className="font-playfair text-2xl sm:text-4xl font-bold leading-tight text-silk-50">
              Crafting <span className="gold-text-foil">Extraordinary</span> Celebrations
            </h1>
            <p className="font-playfair italic text-lg sm:text-2xl text-silk-100/90 -mt-2">
              Creating Timeless Memories
            </p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '10rem' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
              className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-2"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
