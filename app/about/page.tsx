'use client';

import React from 'react';
import Image from 'next/image';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { Award, ShieldCheck } from 'lucide-react';
import { SITE } from '@/lib/site-config';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="font-script-sm text-gold-600 block">
          Our Story
        </span>
        <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-maroon-900">
          {SITE.name} &mdash; <span className="font-script text-gold-500 font-normal">Top Event Team</span>
        </h1>
        <p className="text-maroon-700/80 text-base">
          SID Events started in {SITE.foundedYear} as a small decor outfit in {SITE.city}. Over 10+ years we&apos;ve grown into a full-service event company &mdash; weddings, corporate events, birthdays and more &mdash; while still planning every event the same way: itemized, transparent, and true to what the client actually asked for.
        </p>
        <TraditionalBorder />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="relative h-[450px] rounded-3xl overflow-hidden shadow-2xl border-4 border-gold-400">
          <Image
            src="/Sid2.png"
            alt="The SID Events studio in Davanagere - Planning, Design, Perfection"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="space-y-6">
          <h2 className="font-playfair text-3xl font-bold text-maroon-900">
            A Local Team That Handles the Details Directly
          </h2>
          <p className="text-sm text-maroon-800 leading-relaxed">
            No call centre, no franchise model. A core team of decorators, a catering partner we&apos;ve worked with for years, and vendors we book directly &mdash; that&apos;s who actually shows up on the day of your event.
          </p>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <GlassCard variant="warm" className="p-4 space-y-2">
              <Award className="w-6 h-6 text-maroon-800" />
              <h4 className="font-bold text-sm text-maroon-900">500+ Events Managed</h4>
              <p className="text-xs text-maroon-700">Weddings, corporate events and celebrations across Karnataka since {SITE.foundedYear}.</p>
            </GlassCard>

            <GlassCard variant="warm" className="p-4 space-y-2">
              <ShieldCheck className="w-6 h-6 text-maroon-800" />
              <h4 className="font-bold text-sm text-maroon-900">Line-Item Quotes</h4>
              <p className="text-xs text-maroon-700">Every quote shows individual service costs, not a bundled number.</p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
