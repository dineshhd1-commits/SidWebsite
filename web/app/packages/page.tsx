'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CalendarHeart } from 'lucide-react';
import { GoldButton } from '@/components/ui/gold-button';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { LoadingState, EmptyState } from '@/components/builder/EmptyState';
import { getEventTypes } from '@/lib/data/event-types';
import { EventType } from '@/lib/types/catalog';
import { SITE } from '@/lib/site-config';

export default function PackagesPage() {
  const [eventTypes, setEventTypes] = useState<EventType[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getEventTypes().then((types) => {
      if (!cancelled) setEventTypes(types.filter((t) => t.active));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE.siteUrl}/` },
      { '@type': 'ListItem', position: 2, name: 'Packages', item: `${SITE.siteUrl}/packages` },
    ],
  };

  return (
    <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12 sm:space-y-16">
      {/* Header Banner */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300">
          Events We Plan
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl lg:text-6xl font-bold text-maroon-900">
          Choose Your Event
        </h1>
        <p className="text-maroon-700/80 text-sm sm:text-base leading-relaxed">
          Pick the occasion you&apos;re planning and build your package step by step - decoration, photography,
          catering and more. Our team confirms pricing and availability after you send your enquiry.
        </p>
        <TraditionalBorder />
      </section>

      {/* Event Types Grid */}
      {eventTypes === null ? (
        <LoadingState label="Loading events..." />
      ) : eventTypes.length === 0 ? (
        <EmptyState
          title="Events not available yet"
          description="Our event catalog is being set up. Use the custom builder to plan your event in the meantime."
          actionLabel="Open Custom Builder"
          onAction={() => (window.location.href = '/custom-builder')}
        />
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
          {eventTypes.map((eventType) => (
            <GlassCard
              key={eventType.id}
              variant="light"
              className="flex flex-col justify-between space-y-5 !p-0 overflow-hidden"
            >
              <div>
                {/* Events without a verified photo show a branded icon panel rather
                    than a stock image that doesn't depict them. */}
                <div className="relative h-40 w-full bg-gold-50">
                  {eventType.imageUrl ? (
                    <Image
                      src={eventType.imageUrl}
                      alt={eventType.name}
                      fill
                      sizes="(min-width: 1536px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain object-center"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gold-100 border-b border-gold-200 text-gold-700/70">
                      <CalendarHeart className="w-10 h-10" />
                    </div>
                  )}
                </div>

                <div className="px-6 pt-5">
                  <h2 className="font-playfair text-xl font-bold text-maroon-900">{eventType.name}</h2>
                  <p className="text-xs text-maroon-700/80 leading-relaxed mt-1.5">{eventType.shortDescription}</p>
                </div>
              </div>

              <div className="px-6 pb-6 space-y-2.5">
                <Link href={`/custom-builder?event=${eventType.id}`}>
                  <GoldButton fullWidth variant="dark" size="sm" icon={<ArrowRight className="w-4 h-4" />}>
                    Plan This Event
                  </GoldButton>
                </Link>
              </div>
            </GlassCard>
          ))}
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </main>
  );
}
