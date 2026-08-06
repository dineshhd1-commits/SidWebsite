'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { CatalogItem } from '@/lib/types/catalog';
import { PackageLevelBadge } from './PackageLevelBadge';
import { GoldButton } from '../ui/gold-button';

interface ImageGalleryModalProps {
  item: CatalogItem;
  isSelected: boolean;
  isLocked: boolean;
  onClose: () => void;
  onSelect: () => void;
}

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function ImageGalleryModal({ item, isSelected, isLocked, onClose, onSelect }: ImageGalleryModalProps) {
  const images = (item.images.length > 0 ? item.images : [item.imageUrl]).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % images.length);
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[80] bg-maroon-950/90 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl bg-maroon-900 rounded-3xl p-4 border-2 border-gold-400 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-gold-300 bg-maroon-950 p-2 rounded-full border border-gold-400 hover:bg-maroon-800"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative h-[50vh] sm:h-[60vh] w-full rounded-2xl overflow-hidden mb-4 bg-black flex items-center justify-center">
          <Image src={images[index]} alt={`${item.name} - photo ${index + 1}`} fill sizes="(min-width: 640px) 768px, 100vw" className="object-contain" />

          {images.length > 1 && (
            <>
              <button
                onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 text-gold-300 bg-maroon-950/80 p-2 rounded-full border border-gold-400 hover:bg-maroon-800"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIndex((i) => (i + 1) % images.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gold-300 bg-maroon-950/80 p-2 rounded-full border border-gold-400 hover:bg-maroon-800"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gold-200 bg-maroon-950/80 px-2 py-0.5 rounded-full border border-gold-400/40">
                {index + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-ivory">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-playfair text-xl font-bold text-gold-300">{item.name}</h3>
              <PackageLevelBadge level={item.packageLevel} />
            </div>
            <p className="text-xs text-gold-100/80 max-w-lg">{item.description}</p>
            <p className="text-sm font-bold text-gold-200">{formatCurrency(item.price)} <span className="text-[11px] font-normal text-gold-300/70">/ {item.unit}</span></p>
          </div>

          <GoldButton
            variant={isSelected ? 'dark' : 'gold'}
            size="md"
            onClick={onSelect}
            disabled={isLocked && !isSelected}
          >
            {isSelected ? 'Selected' : isLocked ? 'Limit Reached' : 'Select This Design'}
          </GoldButton>
        </div>
      </div>
    </div>
  );
}
