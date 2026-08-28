'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface LightboxMediaItem {
  src?: string;
  url?: string;
  alt?: string;
  title?: string;
  category?: string;
  categoryLabel?: string;
  mediaType?: 'image' | 'video';
  rotate?: number;
}

export type LightboxItemInput = string | LightboxMediaItem;

interface SharedImageLightboxProps {
  images?: LightboxItemInput[];
  items?: LightboxItemInput[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function SharedImageLightbox({
  images,
  items,
  initialIndex = 0,
  isOpen,
  onClose,
  title,
  subtitle,
}: SharedImageLightboxProps) {
  const mediaList = items || images || [];
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Sync index whenever modal opens with a new initialIndex
  useEffect(() => {
    if (isOpen && mediaList.length > 0) {
      setCurrentIndex(Math.max(0, Math.min(initialIndex, mediaList.length - 1)));
    }
  }, [isOpen, initialIndex, mediaList.length]);

  // Keyboard navigation: Escape to close, Left/Right arrows to cycle
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (mediaList.length > 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
        } else if (e.key === 'ArrowRight') {
          setCurrentIndex((prev) => (prev + 1) % mediaList.length);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, mediaList.length, onClose]);

  if (!isOpen || mediaList.length === 0) return null;

  const currentItem = mediaList[currentIndex];
  const src =
    typeof currentItem === 'string'
      ? currentItem
      : currentItem.src || currentItem.url || '';
  const isVideo =
    typeof currentItem !== 'string' &&
    (currentItem.mediaType === 'video' || src.endsWith('.mp4') || src.endsWith('.webm'));
  const rotate = typeof currentItem !== 'string' ? currentItem.rotate : undefined;
  const alt =
    typeof currentItem === 'string'
      ? `Gallery item ${currentIndex + 1}`
      : currentItem.alt || currentItem.title || `Gallery item ${currentIndex + 1}`;
  const itemTitle =
    typeof currentItem === 'string' ? title : currentItem.title || title;
  const itemCategory =
    typeof currentItem === 'string'
      ? subtitle
      : currentItem.categoryLabel || currentItem.category || subtitle;

  const hasMultiple = mediaList.length > 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaList.length);
  };

  return (
    <div
      onClick={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className="fixed inset-0 z-[100] bg-maroon-950/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Media Viewer"
      data-lightbox="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="relative w-full max-w-4xl bg-maroon-900/95 rounded-3xl p-4 sm:p-6 border border-gold-400/50 shadow-2xl flex flex-col select-none"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-30 text-gold-200 bg-maroon-950/90 p-2 sm:p-2.5 rounded-full border border-gold-400/60 hover:bg-maroon-800 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Close viewer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Main Media Stage */}
        <div
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="relative h-[55vh] sm:h-[65vh] w-full rounded-2xl overflow-hidden bg-black/80 flex items-center justify-center border border-gold-400/20 select-none"
        >
          {isVideo ? (
            <video
              key={src}
              src={src}
              controls
              autoPlay
              playsInline
              controlsList="nodownload noplaybackrate"
              disablePictureInPicture
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full h-full object-contain z-10"
              style={{
                transform: rotate ? `rotate(${rotate}deg) scale(0.85)` : undefined,
              }}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-contain select-none pointer-events-none"
              priority
              draggable={false}
              onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            />
          )}

          {/* Transparent right-click protection overlay (applies over non-interactive areas) */}
          <div
            className="absolute inset-0 pointer-events-none z-[5]"
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          />

          {/* Navigation Controls only if 2+ items */}
          {hasMultiple && (
            <>
              <button
                onClick={handlePrev}
                type="button"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gold-200 bg-maroon-950/80 p-2.5 sm:p-3 rounded-full border border-gold-400/60 hover:bg-maroon-800 hover:text-white transition-all cursor-pointer shadow-lg z-20"
                aria-label="Previous item"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={handleNext}
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-200 bg-maroon-950/80 p-2.5 sm:p-3 rounded-full border border-gold-400/60 hover:bg-maroon-800 hover:text-white transition-all cursor-pointer shadow-lg z-20"
                aria-label="Next item"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Counter Pill */}
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[11px] font-bold text-gold-200 bg-maroon-950/90 px-3 py-1 rounded-full border border-gold-400/50 shadow-md z-20">
                {currentIndex + 1} / {mediaList.length}
              </span>
            </>
          )}
        </div>

        {/* Caption / Meta */}
        {(itemTitle || itemCategory) && (
          <div className="mt-3 px-1 flex items-center justify-between gap-4 text-ivory">
            <div>
              {itemCategory && (
                <span className="text-[10px] uppercase font-bold text-gold-300 tracking-wider block mb-0.5">
                  {itemCategory === 'decoration' ? 'Manthapa Decor' : itemCategory}
                </span>
              )}
              {itemTitle && (
                <h3 className="font-playfair text-base sm:text-lg font-bold text-gold-100 line-clamp-1">
                  {itemTitle}
                </h3>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
