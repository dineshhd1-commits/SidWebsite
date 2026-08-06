'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types/wedding';
import { getGalleryItems } from '@/lib/data/gallery';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { LoadingState } from '@/components/builder/EmptyState';
import { X, ZoomIn, PlayCircle, Images, VolumeX } from 'lucide-react';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    getGalleryItems().then(setItems);
  }, []);

  useEffect(() => {
    if (!lightboxItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxItem]);

  const categories = [
    { id: 'all', label: 'All Showcase' },
    { id: 'decoration', label: 'Mandapam Decor' },
    { id: 'traditional', label: 'Traditional Rituals' },
    { id: 'reception', label: 'Feast & Reception' },
    { id: 'photography', label: 'Bridal Photography' },
  ];

  const baseItems = !items ? [] : activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const filteredItems = [...baseItems].sort((a, b) => {
    if (a.mediaType === 'video' && b.mediaType !== 'video') return -1;
    if (a.mediaType !== 'video' && b.mediaType === 'video') return 1;
    return 0;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-script-sm text-gold-600 block">
          Visual Heritage
        </span>
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
            onClick={() => setActiveCategory(cat.id)}
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
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightboxItem(item)}
            className="group relative h-96 sm:h-[420px] rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-gold-300/40"
          >
            {item.mediaType === 'video' ? (
              <video
                src={item.url}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
              />
            ) : (
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ transform: item.rotate ? `rotate(${item.rotate}deg) scale(1.45)` : undefined }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-950/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

            {item.mediaType !== 'video' && (
              <div className="absolute top-4 right-4 bg-maroon-900/80 text-gold-300 p-2 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                <ZoomIn className="w-5 h-5" />
              </div>
            )}

            {item.images && item.images.length > 1 && (
              <span className="absolute top-4 left-4 bg-maroon-900/80 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-gold-400/30 inline-flex items-center gap-1">
                <Images className="w-3.5 h-3.5" /> {item.images.length} Photos
              </span>
            )}

            {item.mediaType === 'video' && (
              <span className="absolute top-4 left-4 bg-maroon-900/80 text-gold-300 text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md border border-gold-400/30 inline-flex items-center gap-1">
                <VolumeX className="w-3.5 h-3.5" /> Tap for Sound
              </span>
            )}

            <div className="absolute bottom-4 left-4 right-4 text-ivory">
              <span className="text-[10px] uppercase font-bold text-gold-300 bg-maroon-900/70 px-2 py-0.5 rounded">
                {item.category}
              </span>
              <h4 className="font-playfair text-lg font-bold text-gold-100 mt-1">{item.title}</h4>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-maroon-950/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full bg-maroon-900 rounded-3xl p-4 border-2 border-gold-400 shadow-2xl ${
              lightboxItem.images && lightboxItem.images.length >= 3
                ? 'max-w-6xl'
                : lightboxItem.images && lightboxItem.images.length > 1
                ? 'max-w-5xl'
                : 'max-w-4xl'
            }`}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-gold-300 bg-maroon-950 p-2 rounded-full border border-gold-400 hover:bg-maroon-800"
            >
              <X className="w-6 h-6" />
            </button>

            {lightboxItem.mediaType === 'video' ? (
              <div className="relative h-[65vh] w-full rounded-2xl overflow-hidden mb-4 bg-black flex items-center justify-center">
                <video
                  src={lightboxItem.url}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  style={{ transform: lightboxItem.rotate ? `rotate(${lightboxItem.rotate}deg) scale(0.85)` : undefined }}
                />
              </div>
            ) : lightboxItem.images && lightboxItem.images.length > 1 ? (
              <div
                className={`grid grid-cols-1 gap-4 mb-4 ${
                  lightboxItem.images.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
                }`}
              >
                {lightboxItem.images.map((src, i) => (
                  <div key={src} className="relative h-[40vh] sm:h-[42vh] w-full rounded-2xl overflow-hidden bg-black flex items-center justify-center">
                    <Image
                      src={src}
                      alt={`${lightboxItem.title} - photo ${i + 1}`}
                      fill
                      className="object-contain"
                      style={{ transform: lightboxItem.rotate ? `rotate(${lightboxItem.rotate}deg) scale(0.85)` : undefined }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative h-[65vh] w-full rounded-2xl overflow-hidden mb-4 bg-black flex items-center justify-center">
                <Image
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  fill
                  className="object-contain"
                  style={{ transform: lightboxItem.rotate ? `rotate(${lightboxItem.rotate}deg) scale(0.85)` : undefined }}
                />
              </div>
            )}

            <div className="text-center text-ivory space-y-1">
              <h3 className="font-playfair text-2xl font-bold text-gold-300">{lightboxItem.title}</h3>
              <p className="text-xs text-gold-200 uppercase tracking-widest">{lightboxItem.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
