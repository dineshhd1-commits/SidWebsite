'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Share2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useEventBuilder } from '@/lib/store/event-builder-context';
import { GoldButton } from '@/components/ui/gold-button';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';
import { BrandMark } from '@/components/ui/brand-mark';
import { getWhatsAppShareUrl } from '@/lib/whatsapp';
import { getCartLines, getRequestedExtraLines } from '@/lib/builder/selectors';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

export default function QuotationViewPage() {
  const params = useParams();
  const quoteId = (params?.id as string) || 'SID-2026-992';
  const { state } = useEventBuilder();
  const cartLines = getCartLines(state);
  const requestedExtras = getRequestedExtraLines(state);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">

      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <Link href="/custom-builder" className="inline-flex items-center gap-2 text-xs font-bold text-maroon-700 hover:text-gold-600">
          <ArrowLeft className="w-4 h-4" /> Back to Custom Builder
        </Link>

        <div className="flex items-center gap-3">
          <a href={getWhatsAppShareUrl(quoteId, state)} target="_blank" rel="noopener noreferrer">
            <GoldButton variant="dark" size="sm" icon={<Share2 className="w-4 h-4" />}>
              WhatsApp Share
            </GoldButton>
          </a>
        </div>
      </div>

      {/* Main Summary Sheet Card */}
      <GlassCard variant="warm" className="p-8 md:p-12 space-y-8 border-2 border-gold-400 shadow-2xl">

        {/* Header Branding */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-gold-400 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <BrandMark className="w-14 h-14" />
              <h1 className="font-playfair text-3xl font-bold text-maroon-900 tracking-wider">
                SID EVENTS
              </h1>
            </div>
            <p className="text-xs text-maroon-700 font-semibold mt-1">
              Event Package Summary
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-maroon-800 space-y-1">
            <div className="font-bold text-sm text-maroon-900">Reference #: {quoteId}</div>
            <div>Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <div>Guests: {state.eventDetails.guestCount}</div>
          </div>
        </div>

        {/* Selected Services Breakdown Table */}
        <div className="space-y-4">
          <h3 className="font-playfair text-xl font-bold text-maroon-900 border-b border-gold-300 pb-2">
            Selected Package & Services
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-maroon-800 text-gold-300 font-bold border-b border-gold-400">
                  <th className="p-3">Category</th>
                  <th className="p-3">Selection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-200">
                {cartLines.length === 0 ? (
                  <tr>
                    <td className="p-3 text-maroon-800" colSpan={2}>No items selected yet.</td>
                  </tr>
                ) : (
                  cartLines
                    .filter((l) => l.origin !== 'requested_extra')
                    .map((line) => (
                      <tr key={line.id}>
                        <td className="p-3 font-bold text-maroon-900">{CATEGORY_LABELS[line.categoryKey] || line.categoryKey}</td>
                        <td className="p-3 text-maroon-800">
                          {line.name}{line.quantity > 1 ? ` x${line.quantity}` : ''}
                          {line.origin === 'paid_extra' && <span className="ml-2 text-[10px] uppercase font-bold text-gold-700">Paid Extra</span>}
                        </td>
                      </tr>
                    ))
                )}
                {requestedExtras.map((line) => (
                  <tr key={line.id}>
                    <td className="p-3 font-bold text-maroon-900" colSpan={2}>{line.name} <span className="text-[10px] uppercase font-bold text-amber-700">Pending Vendor Approval</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estimate Note */}
        <div className="bg-maroon-900 text-ivory p-6 rounded-2xl border-2 border-gold-400 text-center space-y-1">
          <p className="text-sm font-bold text-gold-300">Ready To Send</p>
          <p className="text-xs text-gold-100/80">
            Request a quote and our team will confirm pricing and availability based on your selections.
          </p>
        </div>

        <TraditionalBorder />

        {/* Bottom CTA */}
        <div className="text-center space-y-4">
          <p className="text-xs text-maroon-700">Ready to move forward? Send us your details and we&apos;ll get back with a confirmed quote.</p>
          <Link href="/booking">
            <GoldButton variant="copper" size="lg" icon={<CheckCircle2 className="w-5 h-5" />}>
              Request A Quote
            </GoldButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
