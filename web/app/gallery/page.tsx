'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { GalleryItem } from '@/lib/types/wedding';
import { getGalleryItems } from '@/lib/data/gallery';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { LazyVideo } from '@/components/ui/lazy-video';
import { LoadingState } from '@/components/builder/EmptyState';
import { ZoomIn, PlayCircle, Grid } from 'lucide-react';
import { SharedImageLightbox, LightboxMediaItem } from '@/components/ui/shared-image-lightbox';
import { PortfolioAlbumModal } from '@/components/gallery/PortfolioAlbumModal';
import { SITE } from '@/lib/site-config';

export default function GalleryPage() {
  const [selectedAlbumIndex, setSelectedAlbumIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [items, setItems] = useState<GalleryItem[] | null>(null);

  useEffect(() => {
    getGalleryItems().then(setItems);
  }, []);

  const baseItems = !items ? [] : items;

  const filteredItems = [...baseItems].sort((a, b) => {
    if (a.mediaType === 'video' && b.mediaType !== 'video') return -1;
    if (a.mediaType !== 'video' && b.mediaType === 'video') return 1;
    return 0;
  });

  const selectedAlbum = selectedAlbumIndex !== null && filteredItems[selectedAlbumIndex] ? filteredItems[selectedAlbumIndex] : null;

  const activeAlbumMediaList: LightboxMediaItem[] = selectedAlbum
    ? (selectedAlbum.images && selectedAlbum.images.length > 0
        ? selectedAlbum.images
        : [selectedAlbum.url]
      ).map((imgUrl, i) => {
        const isVideo = imgUrl.endsWith('.mp4') || imgUrl.endsWith('.webm');
        return {
          src: imgUrl,
          alt: `${selectedAlbum.title} - ${i + 1}`,
          title: selectedAlbum.title,
          category: selectedAlbum.category,
          categoryLabel: selectedAlbum.category === 'decoration' ? 'Manthapa Decor' : (selectedAlbum.category === 'traditional' ? 'Traditional Rituals & Functions' : selectedAlbum.category),
          mediaType: isVideo ? 'video' : selectedAlbum.mediaType,
          rotate: selectedAlbum.rotate,
        };
      })
    : [];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${SITE.siteUrl}/gallery` },
    ],
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">
      {/* Header */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-script-sm text-gold-600 block">Visual Heritage</span>
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-maroon-900">
          Wedding <span className="font-script text-gold-500 font-normal">Gallery</span>
        </h1>
        <p className="text-maroon-700/80 text-sm sm:text-base">
          Photos and clips from weddings we&apos;ve set up and shot over the last few seasons.
        </p>
        <TraditionalBorder />
      </section>

      {/* Gallery Grid */}
      {items === null ? (
        <LoadingState label="Loading gallery..." />
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              onClick={() => {
                setSelectedAlbumIndex(idx);
                setLightboxIndex(null);
              }}
              className="group relative h-96 sm:h-[420px] rounded-2xl overflow-hidden shadow-lg cursor-pointer border border-gold-300/40 hover:border-gold-400 transition-all hover:-translate-y-1"
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

              {/* Album Multi-Photo Indicator Badge */}
              {item.images && item.images.length > 1 && (
                <div className="absolute top-4 left-4 bg-maroon-950/85 text-gold-300 px-3 py-1 rounded-full border border-gold-400/50 backdrop-blur-md text-[11px] font-bold flex items-center gap-1.5 shadow-md">
                  <Grid className="w-3.5 h-3.5 text-gold-400" />
                  <span>{item.images.length} Photos</span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 text-silk-50">
                <span className="text-[10px] uppercase font-bold text-gold-300 bg-maroon-950/80 px-2.5 py-0.5 rounded border border-gold-400/30">
                  {item.category === 'decoration' ? 'Decoration' : (item.category === 'traditional' ? 'Traditional Functions' : item.category)}
                </span>
                <h2 className="font-playfair text-lg font-bold text-silk-50 mt-1">{item.title}</h2>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Portfolio Album Grid Modal */}
      {selectedAlbum && (
        <PortfolioAlbumModal
          title={selectedAlbum.title}
          categoryLabel={selectedAlbum.category === 'decoration' ? 'Manthapa Decor' : (selectedAlbum.category === 'traditional' ? 'Traditional Rituals & Functions' : selectedAlbum.category)}
          items={activeAlbumMediaList}
          isOpen={true}
          onClose={() => setSelectedAlbumIndex(null)}
          onSelectMedia={(mediaIdx: number) => {
            setLightboxIndex(mediaIdx);
          }}
        />
      )}

      {/* Shared Lightbox Component */}
      {selectedAlbum && lightboxIndex !== null && activeAlbumMediaList.length > 0 && (
        <SharedImageLightbox
          items={activeAlbumMediaList}
          initialIndex={lightboxIndex}
          isOpen={true}
          onClose={() => setLightboxIndex(null)}
          title={selectedAlbum.title}
          subtitle={selectedAlbum.category === 'decoration' ? 'Manthapa Decor' : (selectedAlbum.category === 'traditional' ? 'Traditional Rituals & Functions' : selectedAlbum.category)}
        />
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
