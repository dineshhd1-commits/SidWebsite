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

interface RemoteQuotationLine {
  name: string;
  quantity: number;
}
interface RemoteQuotationSection {
  categoryKey: string;
  label: string;
  lines: RemoteQuotationLine[];
}
interface RemoteQuotation {
  guestCount: number;
  sections: RemoteQuotationSection[];
  requestedExtras: RemoteQuotationLine[];
}

export default function QuotationViewPage() {
  const params = useParams();
  const quoteId = (params?.id as string) || 'SID-2026-992';
  const { state } = useEventBuilder();

  // A shared /quotation/<refCode> link needs to show the actual saved quote
  // - not whatever happens to be in *this* browser's local builder draft -
  // so try the server first. Falls back to today's local-draft rendering
  // (the "review before submit" flow, reached from the builder itself, where
  // no refCode/server record exists yet) when the lookup 404s or fails.
  const [remote, setRemote] = React.useState<RemoteQuotation | null>(null);
  const [remoteChecked, setRemoteChecked] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    if (!quoteId) {
      setRemoteChecked(true);
      return;
    }
    fetch(`/api/quotation/${encodeURIComponent(quoteId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled) setRemote(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setRemoteChecked(true);
      });
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const localCartLines = getCartLines(state);
  const localRequestedExtras = getRequestedExtraLines(state);

  const guestCount = remote ? remote.guestCount : state.eventDetails.guestCount;
  const requestedExtraNames = remote ? remote.requestedExtras.map((l) => l.name) : localRequestedExtras.map((l) => l.name);

  const displayRows: { key: string; categoryLabel: string; name: string; quantity: number }[] = remote
    ? remote.sections.flatMap((section) =>
        section.lines.map((line, i) => ({
          key: `${section.categoryKey}-${i}`,
          categoryLabel: section.label || CATEGORY_LABELS[section.categoryKey] || section.categoryKey,
          name: line.name,
          quantity: line.quantity,
        }))
      )
    : localCartLines
        .filter((l) => l.origin !== 'requested_extra')
        .map((line) => ({
          key: line.id,
          categoryLabel: CATEGORY_LABELS[line.categoryKey] || line.categoryKey,
          name: line.name,
          quantity: line.quantity,
        }));

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
            <div>Guests: {guestCount}</div>
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
                {!remoteChecked ? (
                  <tr>
                    <td className="p-3 text-maroon-800" colSpan={2}>Loading...</td>
                  </tr>
                ) : displayRows.length === 0 ? (
                  <tr>
                    <td className="p-3 text-maroon-800" colSpan={2}>No items selected yet.</td>
                  </tr>
                ) : (
                  displayRows.map((row) => (
                    <tr key={row.key}>
                      <td className="p-3 font-bold text-maroon-900">{row.categoryLabel}</td>
                      <td className="p-3 text-maroon-800">
                        {row.name}{row.quantity > 1 ? ` x${row.quantity}` : ''}
                      </td>
                    </tr>
                  ))
                )}
                {requestedExtraNames.map((name, i) => (
                  <tr key={`extra-${i}`}>
                    <td className="p-3 font-bold text-maroon-900" colSpan={2}>{name} <span className="text-[10px] uppercase font-bold text-amber-700">Pending Vendor Approval</span></td>
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
