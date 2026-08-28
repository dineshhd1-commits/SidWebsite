'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { Search, X, ZoomIn, PlayCircle, Film, Images } from 'lucide-react';
import { LightboxMediaItem } from '@/components/ui/shared-image-lightbox';
import { LazyVideo } from '@/components/ui/lazy-video';

interface PortfolioAlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  categoryLabel?: string;
  items: LightboxMediaItem[];
  onSelectMedia: (index: number) => void;
}

export function PortfolioAlbumModal({
  isOpen,
  onClose,
  title,
  categoryLabel,
  items,
  onSelectMedia,
}: PortfolioAlbumModalProps) {
  const [search, setSearch] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  const normalizedSearch = search.trim().toLowerCase();
  const visibleItems = useMemo(() => {
    if (!normalizedSearch) return items.map((item, originalIndex) => ({ ...item, originalIndex }));
    return items
      .map((item, originalIndex) => ({ ...item, originalIndex }))
      .filter((item) => {
        const itemSrc = item.src || item.url || '';
        return (
          item.title?.toLowerCase().includes(normalizedSearch) ||
          item.categoryLabel?.toLowerCase().includes(normalizedSearch) ||
          itemSrc.toLowerCase().includes(normalizedSearch)
        );
      });
  }, [items, normalizedSearch]);

  if (!isOpen && !visible) return null;

  return createPortal(
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[80] bg-maroon-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl max-h-[90vh] flex flex-col bg-silk-50 rounded-3xl border-2 border-gold-400 shadow-2xl overflow-hidden transition-all duration-200 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        {/* Header - Catering style with title, badge and close */}
        <div className="flex items-center justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-gold-200 bg-gold-50/80">
          <div>
            <span className="font-script-sm text-gold-600 block text-xs">
              {categoryLabel || 'Portfolio Collection'}
            </span>
            <h3 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900">{title}</h3>
            <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wide text-gold-700 bg-gold-100 border border-gold-300 rounded-full px-2.5 py-0.5">
              {items.length} {items.length === 1 ? 'Asset' : 'Photos & Videos'}
            </span>
          </div>
          <button
            onClick={handleClose}
            className="text-maroon-700 bg-white p-2 sm:p-2.5 rounded-full border border-gold-300 hover:bg-gold-100 shrink-0 transition-colors shadow-sm cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-5 sm:px-6 pt-4 pb-2 bg-silk-100/60 border-b border-gold-200/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-maroon-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search within ${title.toLowerCase()}...`}
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-gold-300 bg-white text-sm text-maroon-900 placeholder:text-maroon-700/50 focus:outline-none focus:ring-2 focus:ring-gold-400 shadow-sm"
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

        {/* Media Grid Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {visibleItems.length === 0 ? (
            <div className="py-16 text-center text-maroon-700/60">
              <Images className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-medium">No photos or clips matching &ldquo;{search}&rdquo;</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {visibleItems.map((item, idx) => {
                const itemSrc = item.src || item.url || '';
                const isVideo = item.mediaType === 'video' || itemSrc.endsWith('.mp4') || itemSrc.endsWith('.webm');
                return (
                  <div
                    key={`${itemSrc}-${idx}`}
                    onClick={() => onSelectMedia(item.originalIndex)}
                    className="group relative aspect-square rounded-2xl overflow-hidden bg-maroon-950/10 border border-gold-300/60 hover:border-gold-400 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {isVideo ? (
                      <LazyVideo
                        src={itemSrc}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
                      />
                    ) : (
                      <Image
                        src={itemSrc}
                        alt={item.alt || `${title} - ${idx + 1}`}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/70 via-transparent to-transparent opacity-40 group-hover:opacity-80 transition-opacity" />

                    <div className="absolute top-2.5 right-2.5 bg-maroon-900/85 text-gold-300 p-1.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-gold-400/40 shadow">
                      {isVideo ? <Film className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                    </div>

                    {isVideo && (
                      <div className="absolute bottom-2.5 right-2.5 bg-maroon-900/80 text-gold-300 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-gold-400/40">
                        <PlayCircle className="w-3 h-3" /> Clip
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2.5 text-silk-50 text-[10px] font-semibold opacity-90">
                      #{item.originalIndex + 1}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 sm:px-6 py-3 border-t border-gold-200 bg-gold-50/50 flex items-center justify-between text-xs text-maroon-800/80">
          <span>Tap any photo or video to view in full screen</span>
          <button
            onClick={handleClose}
            className="font-bold text-gold-700 hover:text-maroon-900 underline cursor-pointer"
          >
            Close Album
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
