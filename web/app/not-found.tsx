import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Home, Sparkles, Phone, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { BrandMark } from '@/components/ui/brand-mark';

export const metadata: Metadata = {
  title: 'Page Not Found | 404',
  description: 'The requested page could not be found on SID Events.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 sm:py-24 text-center space-y-8">
      <div className="flex justify-center">
        <BrandMark className="w-20 h-20 shadow-2xl" />
      </div>

      <div className="space-y-3">
        <span className="text-gold-700 font-bold text-xs uppercase tracking-widest bg-gold-100 px-4 py-1.5 rounded-full border border-gold-300 inline-flex items-center gap-1.5 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" /> 404 Error
        </span>
        <h1 className="font-playfair text-4xl sm:text-6xl font-bold text-maroon-900">
          Page Not Found
        </h1>
        <p className="text-maroon-800 text-base max-w-md mx-auto leading-relaxed">
          The page you are looking for does not exist, has been moved, or is no longer available.
        </p>
      </div>

      <GlassCard variant="warm" className="p-8 space-y-6 border-2 border-gold-400 shadow-md text-left">
        <h2 className="font-playfair text-lg font-bold text-maroon-900 border-b border-gold-300 pb-3">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Link
            href="/packages"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition-all font-semibold text-maroon-900 group"
          >
            <span>Wedding &amp; Event Packages</span>
            <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/custom-builder"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition-all font-semibold text-maroon-900 group"
          >
            <span>Custom Package Builder</span>
            <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/services"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition-all font-semibold text-maroon-900 group"
          >
            <span>Our Services</span>
            <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/gallery"
            className="flex items-center justify-between p-3 rounded-xl bg-white border border-gold-300 hover:border-gold-500 hover:bg-gold-50 transition-all font-semibold text-maroon-900 group"
          >
            <span>Decoration Gallery</span>
            <ArrowRight className="w-4 h-4 text-gold-600 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </GlassCard>

      <TraditionalBorder />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <GoldButton variant="gold" size="lg" icon={<Home className="w-4 h-4" />}>
            Back to Homepage
          </GoldButton>
        </Link>
        <Link href="/contact">
          <GoldButton variant="dark" size="lg" icon={<Phone className="w-4 h-4" />}>
            Contact Support
          </GoldButton>
        </Link>
      </div>
    </main>
  );
}
