'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Check, Search, UtensilsCrossed, X } from 'lucide-react';
import { CateringMenuCategory } from '@/lib/types/catering-menu';

/** Card-sized dish photo. Every item already resolves to a conventioned image
 * path (`/catering/{itemId}.jpg`) - this just renders it and falls back to a
 * placeholder icon on 404, so dropping in a real photo later is a file swap,
 * no UI or logic change required. */
function DishCardImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="w-full h-28 sm:h-32 rounded-t-xl bg-gold-100 border-b border-gold-200 flex flex-col items-center justify-center gap-1.5 text-gold-600/70">
        <UtensilsCrossed className="w-6 h-6" />
        <span className="text-[9px] font-bold uppercase tracking-wider">Photo coming soon</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-28 sm:h-32 rounded-t-xl overflow-hidden bg-gold-50">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

interface CateringCategoryModalProps {
  category: CateringMenuCategory;
  selectedItemIds: Set<string>;
  onToggleItem: (categoryId: string, categoryName: string, itemId: string, itemName: string) => void;
  onClose: () => void;
}

export function CateringCategoryModal({
  category,
  selectedItemIds,
  onToggleItem,
  onClose,
}: CateringCategoryModalProps) {
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  // Mount in a hidden state, then flip to visible on the next frame so the
  // opacity/scale transition actually animates instead of snapping in.
  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock background scroll while the modal is open, restoring whatever the
  // page's overflow was before (rather than assuming it was always 'visible').
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleItems = useMemo(() => {
    if (!normalizedSearch) return category.items;
    return category.items.filter((item) => item.name.toLowerCase().includes(normalizedSearch));
  }, [category.items, normalizedSearch]);

  const selectedCount = category.items.filter((item) => selectedItemIds.has(item.id)).length;
  const { maxSelections } = category;
  const limitReached = maxSelections !== undefined && selectedCount >= maxSelections;

  // Portaled to <body> so `fixed inset-0` covers the real viewport - the step
  // content this modal is triggered from renders inside a framer-motion
  // `motion.div`, and a `transform` on that ancestor would otherwise turn it
  // into the containing block for `fixed` children, shrinking the backdrop to
  // the step area and leaving the navbar clickable/undimmed above it.
  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[80] bg-maroon-950/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[85vh] flex flex-col bg-white rounded-3xl border-2 border-gold-400 shadow-2xl overflow-hidden transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gold-200 bg-gold-50/60">
          <div>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900">{category.name}</h3>
            {(selectedCount > 0 || maxSelections !== undefined) && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-gold-700 bg-gold-100 border border-gold-300 rounded-full px-2 py-0.5">
                {selectedCount} selected{maxSelections !== undefined ? ` / ${maxSelections} max` : ''}
              </span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="text-maroon-700 bg-white p-2 rounded-full border border-gold-300 hover:bg-gold-100 shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-5 sm:px-6 pt-4 pb-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            <input
              type="text"
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${category.name.toLowerCase()}...`}
              className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-gold-300 bg-white text-sm text-maroon-900 focus:outline-none focus:ring-2 focus:ring-gold-400"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-maroon-500 hover:text-maroon-800"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {limitReached && (
          <div className="mx-5 sm:mx-6 mb-2 text-xs font-bold text-maroon-800 bg-gold-100 border border-gold-300 rounded-xl px-4 py-2.5">
            You've reached the maximum of {maxSelections} for {category.name}. Remove one to pick a different dish.
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-5 sm:px-6 pb-6 pt-2">
          {visibleItems.length === 0 ? (
            <p className="text-sm text-maroon-700/70 text-center py-10">No dishes match your search.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {visibleItems.map((item) => {
                const isSelected = selectedItemIds.has(item.id);
                const isLocked = limitReached && !isSelected;
                return (
                  <div
                    key={item.id}
                    role="button"
                    tabIndex={isLocked ? -1 : 0}
                    aria-disabled={isLocked}
                    onClick={() => !isLocked && onToggleItem(category.id, category.name, item.id, item.name)}
                    onKeyDown={(e) => {
                      if (isLocked) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onToggleItem(category.id, category.name, item.id, item.name);
                      }
                    }}
                    className={`group text-left rounded-xl border overflow-hidden transition-all ${
                      isLocked
                        ? 'border-gold-200 bg-gold-50/50 opacity-50 cursor-not-allowed'
                        : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
                    } ${isSelected ? 'border-gold-500 ring-2 ring-gold-400 bg-gold-50' : !isLocked ? 'border-gold-200 bg-white' : ''}`}
                  >
                    <div className="relative">
                      <DishCardImage src={item.imageUrl} alt={item.name} />
                      <span
                        className={`absolute top-2 right-2 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'bg-maroon-800 border-gold-300' : 'bg-white/90 border-gold-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-gold-300" />}
                      </span>
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="text-xs font-bold text-maroon-900 leading-snug line-clamp-2">{item.name}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
