'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Sparkles, X } from 'lucide-react';
import {
  DECORATION_CATEGORIES,
  getDecorationPhotoById,
  getDecorationPhotosByCategory,
  getSimilarDecorationPhotos,
} from '@/lib/data/decoration-inspiration';
import { DecorationPhoto } from '@/lib/types/decoration-inspiration';

const RECOMMENDATION_COUNT = 8;
const INITIAL_VISIBLE_COUNT = 12;

interface DecorationDiscoveryProps {
  /** The photo id currently added to the customer's cart, if any (restored
   * from state.cart when this step is revisited). */
  selectedPhotoId: string | null;
  /** Called whenever a photo is clicked - this IS the "add to cart" action,
   * there's no separate select/confirm button. */
  onSelectPhoto: (photo: DecorationPhoto) => void;
  /** Called when the customer closes/clears their current pick. */
  onRemoveSelection: () => void;
  /** Restricts both the category filter chips and the photos shown to just
   * these category slugs - e.g. Birthday never sees Bridal Entry or Mantap
   * Decoration photos, which are wedding/reception-only. Omit to show
   * everything (kept for flexibility, though every caller currently passes
   * a scoped list). */
  allowedCategories?: string[];
}

/** Pinterest/Amazon-style "browse and discover" gallery for the client's real
 * decoration photos. Clicking a photo sets it as the customer's decoration
 * pick for their quote. */
export function DecorationDiscovery({ selectedPhotoId, onSelectPhoto, onRemoveSelection, allowedCategories }: DecorationDiscoveryProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(selectedPhotoId);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const selectedPanelRef = useRef<HTMLDivElement>(null);

  const visibleCategoryChips = useMemo(
    () => (allowedCategories ? DECORATION_CATEGORIES.filter((c) => allowedCategories.includes(c.slug)) : DECORATION_CATEGORIES),
    [allowedCategories]
  );

  // If the active category filter isn't relevant to this event type (e.g. the
  // event type changed), fall back to "All Styles" instead of showing an
  // empty grid stuck on a filtered-out category.
  useEffect(() => {
    if (activeCategory !== 'all' && !visibleCategoryChips.some((c) => c.slug === activeCategory)) {
      setActiveCategory('all');
    }
  }, [activeCategory, visibleCategoryChips]);

  const allBrowseItems = useMemo(() => {
    const items = getDecorationPhotosByCategory(activeCategory);
    return allowedCategories ? items.filter((p) => allowedCategories.includes(p.category)) : items;
  }, [activeCategory, allowedCategories]);
  const browseItems = allBrowseItems.slice(0, visibleCount);
  const hasMore = allBrowseItems.length > browseItems.length;

  // Reset how many photos are shown whenever the category filter changes,
  // so switching categories doesn't leave a huge grid expanded.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory]);

  const selected = selectedId ? getDecorationPhotoById(selectedId) : null;
  const similar = useMemo(() => {
    if (!selectedId) return [];
    // The full photo library is small (~180 photos), so pulling a generous
    // pool before filtering to allowed categories comfortably still fills
    // the recommendation strip.
    const pool = getSimilarDecorationPhotos(selectedId, allowedCategories ? 60 : RECOMMENDATION_COUNT);
    const filtered = allowedCategories ? pool.filter((p) => allowedCategories.includes(p.category)) : pool;
    return filtered.slice(0, RECOMMENDATION_COUNT);
  }, [selectedId, allowedCategories]);

  const handleSelect = (id: string) => {
    const photo = getDecorationPhotoById(id);
    if (!photo) return;
    setSelectedId(id);
    onSelectPhoto(photo);
    requestAnimationFrame(() => {
      selectedPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const handleClose = () => {
    setSelectedId(null);
    onRemoveSelection();
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-gold-600 font-semibold text-[10px] uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300 inline-flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" /> Get Inspired
        </span>
        <h3 className="font-playfair text-xl font-bold text-maroon-900 mt-2">Explore Decoration Styles</h3>
        <p className="text-xs text-maroon-700/80 mt-1 max-w-xl">
          Real decorations from our past events. Tap a photo to make it your pick.
        </p>
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors ${
            activeCategory === 'all'
              ? 'bg-maroon-900 text-gold-200 border-maroon-900'
              : 'bg-white text-maroon-700 border-gold-300 hover:border-gold-500'
          }`}
        >
          All Styles
        </button>
        {visibleCategoryChips.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border transition-colors ${
              activeCategory === c.slug
                ? 'bg-maroon-900 text-gold-200 border-maroon-900'
                : 'bg-white text-maroon-700 border-gold-300 hover:border-gold-500'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Browse grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {browseItems.map((photo) => (
          <motion.button
            key={photo.id}
            type="button"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => handleSelect(photo.id)}
            className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition-colors ${
              selectedId === photo.id ? 'border-gold-500 ring-2 ring-gold-400/60' : 'border-gold-200'
            }`}
          >
            <Image
              src={photo.src}
              alt={photo.categoryLabel}
              fill
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-maroon-950/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="absolute bottom-2 left-2 right-2 text-[10px] font-bold uppercase tracking-wide text-gold-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 truncate">
              {photo.categoryLabel}
            </span>
            {selectedId === photo.id && (
              <span className="absolute top-2 right-2 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                <Check className="w-3 h-3" /> Picked
              </span>
            )}
          </motion.button>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + INITIAL_VISIBLE_COUNT)}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-[11px] font-bold uppercase tracking-widest border-2 border-gold-400 text-maroon-800 hover:bg-gold-100/60 transition-colors"
          >
            Show More Photos ({allBrowseItems.length - browseItems.length} left)
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Selected decoration + Similar Decorations */}
      <AnimatePresence mode="wait">
        {selected && (
          <motion.div
            key={selected.id}
            ref={selectedPanelRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl border-2 border-gold-400/50 bg-gradient-to-br from-silk-50 via-white to-gold-50 p-4 sm:p-6 space-y-5 shadow-gold-glow scroll-mt-24"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-700">{selected.categoryLabel}</span>
                  <span className="bg-emerald-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" /> Added to Your Event
                  </span>
                </div>
                <h4 className="font-playfair text-lg font-bold text-maroon-900">Your Decoration Pick</h4>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Remove this decoration pick"
                className="text-maroon-700 hover:text-maroon-900 p-2 rounded-full hover:bg-gold-100 transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full h-[260px] sm:h-[380px] lg:h-[460px] rounded-2xl overflow-hidden bg-maroon-950">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selected.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={selected.src}
                    alt={selected.categoryLabel}
                    fill
                    sizes="(min-width: 1024px) 800px, 100vw"
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {similar.length > 0 && (
              <div>
                <h5 className="font-playfair text-base font-bold text-maroon-900 mb-3">Similar Decorations</h5>
                <div className="flex sm:grid sm:grid-cols-4 gap-3 overflow-x-auto sm:overflow-visible snap-x snap-mandatory sm:snap-none pb-1 -mx-1 px-1 sm:mx-0 sm:px-0">
                  {similar.map((photo) => (
                    <motion.button
                      key={photo.id}
                      type="button"
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => handleSelect(photo.id)}
                      className="group relative shrink-0 w-28 sm:w-auto aspect-square rounded-xl overflow-hidden border-2 border-gold-200 hover:border-gold-500 transition-colors snap-start"
                    >
                      <Image
                        src={photo.src}
                        alt={photo.categoryLabel}
                        fill
                        sizes="(min-width: 640px) 20vw, 112px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-maroon-950/75 text-gold-200 text-[8px] font-bold uppercase tracking-wide px-1.5 py-1 truncate">
                        {photo.categoryLabel}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
