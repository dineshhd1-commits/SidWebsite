'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, Images } from 'lucide-react';
import { getDecorationPhotosByCategory, getWatermarkedDecorationSrc } from '@/lib/data/decoration-inspiration';
import { DecorationPhoto } from '@/lib/types/decoration-inspiration';

/** Single photo tile in the gallery grid - clicking it is the entire
 * interaction: toggles this exact photo in/out of Your Selections right
 * where the customer is browsing. No detail view, no "similar photos".
 *
 * Always renders the pre-watermarked version of the photo (client logo
 * baked into the actual image bytes, bottom-right corner) rather than the
 * raw source, and layers on reasonable web-level copy protection - right-
 * click, drag, and the iOS long-press "Save to Photos" callout are all
 * disabled. None of this touches the click-to-select interaction itself. */
function DecorationPhotoTile({
  photo,
  isSelected,
  onToggle,
}: {
  photo: DecorationPhoto;
  isSelected: boolean;
  onToggle: (photo: DecorationPhoto) => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={() => onToggle(photo)}
      onContextMenu={(e) => e.preventDefault()}
      whileTap={{ scale: 0.96 }}
      aria-pressed={isSelected}
      style={{ WebkitTouchCallout: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
      className={`group relative aspect-square rounded-xl overflow-hidden border-2 select-none transition-colors ${
        isSelected ? 'border-gold-500 ring-2 ring-gold-400' : 'border-gold-200 hover:border-gold-400'
      }`}
    >
      {failed ? (
        <div className="w-full h-full bg-gold-100 flex items-center justify-center text-gold-600/70">
          <Images className="w-6 h-6" />
        </div>
      ) : (
        <Image
          src={getWatermarkedDecorationSrc(photo.src)}
          alt={photo.categoryLabel}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
          loading="lazy"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className={`object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105 ${isSelected ? 'brightness-90' : ''}`}
          onError={() => setFailed(true)}
        />
      )}

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute inset-0 bg-maroon-950/25 flex items-center justify-center"
        >
          <span className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center shadow-lg">
            <Check className="w-5 h-5 text-white" />
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}

interface DecorationCategorySectionProps {
  slug: string;
  label: string;
  selectedPhotoIds: Set<string>;
  onTogglePhoto: (photo: DecorationPhoto) => void;
}

/** One category's full gallery - every photo the client has for this
 * category, always, never paginated or capped. */
function DecorationCategorySection({ slug, label, selectedPhotoIds, onTogglePhoto }: DecorationCategorySectionProps) {
  const photos = getDecorationPhotosByCategory(slug);
  const selectedCount = photos.filter((p) => selectedPhotoIds.has(p.id)).length;

  if (photos.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-playfair text-lg font-bold text-maroon-900">{label}</h3>
        <span className="text-[10px] font-bold text-maroon-700/60 uppercase tracking-wide shrink-0">
          {photos.length} photo{photos.length === 1 ? '' : 's'}
          {selectedCount > 0 && (
            <span className="ml-2 text-gold-700 bg-gold-100 border border-gold-300 rounded-full px-2 py-0.5">
              {selectedCount} selected
            </span>
          )}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {photos.map((photo) => (
          <DecorationPhotoTile key={photo.id} photo={photo} isSelected={selectedPhotoIds.has(photo.id)} onToggle={onTogglePhoto} />
        ))}
      </div>
    </div>
  );
}

interface DecorationDiscoveryProps {
  /** Every category relevant to the customer's chosen event type, in display order. */
  categories: { slug: string; label: string }[];
  /** Photo ids (DecorationPhoto.id, not cart item id) currently in the cart. */
  selectedPhotoIds: Set<string>;
  /** Toggles one exact photo in/out of Your Selections. */
  onTogglePhoto: (photo: DecorationPhoto) => void;
}

/** Premium decor-catalog style gallery: every relevant category, every photo
 * the client has for it, shown directly - no filter-then-reveal, no detail
 * page, no recommendation carousel. A small chip row lets the customer jump
 * to a category on a long page without hiding anything. */
export function DecorationDiscovery({ categories, selectedPhotoIds, onTogglePhoto }: DecorationDiscoveryProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const jumpTo = (slug: string) => {
    sectionRefs.current[slug]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8">
      {categories.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => jumpTo(c.slug)}
              className="shrink-0 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border border-gold-300 bg-white text-maroon-700 hover:border-gold-500 hover:text-maroon-900 transition-colors"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}

      {categories.map((c) => (
        <div key={c.slug} ref={(el) => { sectionRefs.current[c.slug] = el; }}>
          <DecorationCategorySection slug={c.slug} label={c.label} selectedPhotoIds={selectedPhotoIds} onTogglePhoto={onTogglePhoto} />
        </div>
      ))}
    </div>
  );
}
