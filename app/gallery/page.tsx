'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types/wedding';
import { getGalleryItems } from '@/lib/data/gallery';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { LazyVideo } from '@/components/ui/lazy-video';
import { LoadingState } from '@/components/builder/EmptyState';
import { ZoomIn, PlayCircle } from 'lucide-react';
import { SharedImageLightbox, LightboxMediaItem } from '@/components/ui/shared-image-lightbox';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    getGalleryItems().then(setItems);
  }, []);

  const categories = [
    { id: 'all', label: 'All Showcase' },
    { id: 'decoration', label: 'Manthapa Decor' },
    { id: 'traditional', label: 'Traditional Rituals' },
    { id: 'reception', label: 'Feast & Reception' },
    { id: 'photography', label: 'Bridal Photography' },
  ];

  const baseItems = !items
    ? []
    : activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const filteredItems = [...baseItems].sort((a, b) => {
    if (a.mediaType === 'video' && b.mediaType !== 'video') return -1;
    if (a.mediaType !== 'video' && b.mediaType === 'video') return 1;
    return 0;
  });

  const lightboxMediaItems: LightboxMediaItem[] = filteredItems.map((item) => ({
    src: item.url,
    alt: item.title,
    title: item.title,
    category: item.category,
    categoryLabel: item.category === 'decoration' ? 'Manthapa Decor' : item.category,
    mediaType: item.mediaType,
    rotate: item.rotate,
  }));

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-script-sm text-gold-600 block">Visual Heritage</span>
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-maroon-900">
          Wedding <span className="font-script text-gold-500 font-normal">Gallery</span>
        </h1>
        <p className="text-maroon-700/80 text-sm sm:text-base">
          Photos and clips from weddings we&apos;ve set up and shot over the last few seasons.
        </p>
        <TraditionalBorder />
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => {
              setActiveCategory(cat.id);
              setSelectedItemIndex(null);
            }}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              activeCategory === cat.id
                ? 'bg-maroon-800 text-gold-300 shadow-md border border-gold-400'
                : 'bg-ivory text-maroon-900 border border-gold-300 hover:bg-gold-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {items === null ? (
        <LoadingState label="Loading gallery..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => setSelectedItemIndex(idx)}
              className="group relative h-96 sm:h-[420px] rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-gold-300/40"
            >
              {item.mediaType === 'video' ? (
                <LazyVideo
                  src={item.url}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
                />
              ) : (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
                />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-maroon-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

              <div className="absolute top-4 right-4 bg-maroon-900/80 text-gold-300 p-2.5 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity border border-gold-400/40">
                {item.mediaType === 'video' ? <PlayCircle className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-silk-50">
                <span className="text-[10px] uppercase font-bold text-gold-300 bg-maroon-900/70 px-2 py-0.5 rounded">
                  {item.category === 'decoration' ? 'Manthapa Decor' : item.category}
                </span>
                <h4 className="font-playfair text-lg font-bold text-gold-100 mt-1">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Unified Media Lightbox with Scoped Navigation (Images + Videos) */}
      {selectedItemIndex !== null && (
        <SharedImageLightbox
          items={lightboxMediaItems}
          initialIndex={selectedItemIndex}
          isOpen={true}
          onClose={() => setSelectedItemIndex(null)}
        />
      )}
    </div>
  );
}
