'use client';

import React from 'react';
import Link from 'next/link';
import { Share2, CheckCircle, Edit3, AlertCircle } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { CatalogCategoryKey } from '@/lib/types/catalog';
import { getCartLines, getRequestedExtraLines } from '@/lib/builder/selectors';
import { getMissingRequiredFieldsForSubmit } from '@/lib/builder/validation';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { getWhatsAppShareUrl } from '@/lib/whatsapp';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  additional_services: 'Additional Services',
};

const CATEGORY_STEP_INDEX: Partial<Record<CatalogCategoryKey, number>> = {
  decoration: 1,
  photography: 2,
  catering: 3,
  additional_services: 4,
};

const CATERING_TIMING_LABELS: Record<string, string> = {
  morning: 'Morning (Breakfast menu)',
  afternoon: 'Afternoon (Lunch menu)',
  evening: 'Evening (Dinner menu)',
};

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Not set';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

interface ReviewCartStepProps {
  state: EventBuilderState;
  quoteId: string;
  onGoToStep: (index: number) => void;
}

export function ReviewCartStep({ state, quoteId, onGoToStep }: ReviewCartStepProps) {
  const cartLines = getCartLines(state);
  const requestedExtras = getRequestedExtraLines(state);
  const missingRequired = getMissingRequiredFieldsForSubmit(state);
  const { eventDetails } = state;

  const linesByCategory = cartLines
    .filter((l) => l.origin !== 'requested_extra')
    .reduce<Record<string, typeof cartLines>>((acc, line) => {
      acc[line.categoryKey] = [...(acc[line.categoryKey] || []), line];
      return acc;
    }, {});

  const cateringSelections = Object.values(state.cateringSelections);
  const cateringSelectionsByCategory = cateringSelections.reduce<Record<string, { categoryName: string; lines: typeof cateringSelections }>>(
    (acc, line) => {
      if (!acc[line.categoryId]) acc[line.categoryId] = { categoryName: line.categoryName, lines: [] };
      acc[line.categoryId].lines.push(line);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Review Your Package</h2>
        <p className="text-xs text-maroon-700/80">
          Check everything you&apos;ve chosen, then send it to us for a confirmed quote.
        </p>
      </div>

      {/* Event Details Section */}
      <GlassCard className="space-y-4">
        <div className="flex justify-between items-center border-b border-gold-300 pb-3">
          <h3 className="font-playfair text-lg font-bold text-maroon-900">Event Details</h3>
          <button
            onClick={() => onGoToStep(0)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-maroon-900"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-maroon-900">
          <div><span className="text-maroon-700/60 block font-semibold">Date</span>{formatDate(eventDetails.date)}</div>
          <div><span className="text-maroon-700/60 block font-semibold">Guests</span>{eventDetails.guestCount || 'Not set'}</div>
          <div><span className="text-maroon-700/60 block font-semibold">Location</span>{eventDetails.location || 'Not set'}</div>
          <div><span className="text-maroon-700/60 block font-semibold">Name</span>{eventDetails.customerName || 'Not set'}</div>
          <div><span className="text-maroon-700/60 block font-semibold">Phone</span>{eventDetails.customerPhone || 'Not set'}</div>
          <div><span className="text-maroon-700/60 block font-semibold">Email</span>{eventDetails.customerEmail || 'Not set'}</div>
        </div>
        {eventDetails.specialRequirements && (
          <div className="text-xs bg-gold-50/70 p-3 rounded-lg border border-gold-200 text-maroon-900">
            <span className="font-bold">Special Requirements:</span> {eventDetails.specialRequirements}
          </div>
        )}
      </GlassCard>

      {/* Selected Services Section */}
      <GlassCard className="space-y-4">
        <h3 className="font-playfair text-lg font-bold text-maroon-900 border-b border-gold-300 pb-3">Selected Services</h3>
        {Object.keys(linesByCategory).length === 0 ? (
          <p className="text-xs text-maroon-700/80">No services selected yet.</p>
        ) : (
          (Object.entries(linesByCategory) as [CatalogCategoryKey, typeof cartLines][]).map(([categoryKey, lines]) => (
            <div key={categoryKey} className="space-y-2 pb-3 border-b border-gold-200/60 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{CATEGORY_LABELS[categoryKey] || categoryKey}</span>
                <button
                  onClick={() => onGoToStep(CATEGORY_STEP_INDEX[categoryKey] ?? 0)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-gold-700 hover:text-maroon-900"
                >
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              </div>
              {lines.map((line) => (
                <div key={line.id} className="text-xs text-maroon-900">
                  <span>{line.name}{line.quantity > 1 ? ` x${line.quantity}` : ''}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </GlassCard>

      {/* Catering Menu Section */}
      {(state.cateringTiming || cateringSelections.length > 0) && (
        <GlassCard className="space-y-4">
          <div className="flex justify-between items-center border-b border-gold-300 pb-3">
            <h3 className="font-playfair text-lg font-bold text-maroon-900">Catering Menu</h3>
            <button
              onClick={() => onGoToStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-maroon-900"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          {state.cateringTiming && (
            <p className="text-xs text-maroon-900">
              <span className="font-semibold text-maroon-700/60">Timing: </span>
              {CATERING_TIMING_LABELS[state.cateringTiming]}
              {!!state.cateringGuestCounts[state.cateringTiming] && (
                <>
                  <span className="font-semibold text-maroon-700/60"> · Guests: </span>
                  {state.cateringGuestCounts[state.cateringTiming]}
                </>
              )}
            </p>
          )}
          {cateringSelections.length === 0 ? (
            <p className="text-xs text-maroon-700/80">No dishes selected yet.</p>
          ) : (
            Object.entries(cateringSelectionsByCategory).map(([categoryId, group]) => (
              <div key={categoryId} className="space-y-1.5 pb-2 border-b border-gold-200/60 last:border-b-0 last:pb-0">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-700">{group.categoryName}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 text-xs text-maroon-900">
                  {group.lines.map((line) => (
                    <div key={line.itemId}>
                      {line.itemName}
                      {line.quantity > 1 ? ` x${line.quantity}` : ''}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </GlassCard>
      )}

      {/* Cart Summary Section */}
      <GlassCard variant="warm" className="space-y-6">
        <div className="flex justify-between items-center border-b border-gold-300 pb-4">
          <div>
            <h3 className="font-playfair text-2xl font-bold text-maroon-900">Cart Summary</h3>
            <p className="text-xs text-maroon-700">Reference #: {quoteId}</p>
          </div>
          <span className="bg-maroon-800 text-gold-300 text-xs font-bold px-3 py-1 rounded-full border border-gold-400">
            Ready to Send
          </span>
        </div>

        <div className="space-y-3 text-xs text-maroon-900">
          {requestedExtras.map((line) => (
            <div key={line.id} className="border-b border-gold-200/60 pb-2 text-amber-800">
              <span>{line.name} (pending vendor approval)</span>
            </div>
          ))}
        </div>

        <div className="bg-maroon-900 text-ivory p-6 rounded-2xl border-2 border-gold-400 text-center space-y-1">
          <p className="text-sm font-bold text-gold-300">Ready To Send</p>
          <p className="text-xs text-gold-100/80">
            Send us this package and our team will confirm final pricing and availability.
          </p>
        </div>

        {missingRequired.length > 0 && (
          <div className="flex items-start gap-2 text-xs bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              Before you submit, we&apos;ll still need: <strong>{missingRequired.map((f) => f.label).join(', ')}</strong>.
              You can add these on the enquiry form next.
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <a href={getWhatsAppShareUrl(quoteId, state)} target="_blank" rel="noopener noreferrer" className="w-full">
            <GoldButton variant="dark" size="sm" fullWidth icon={<Share2 className="w-4 h-4" />}>
              WhatsApp Inquiry
            </GoldButton>
          </a>

          <Link href="/booking" className="w-full">
            <GoldButton variant="gold" size="sm" fullWidth icon={<CheckCircle className="w-4 h-4" />}>
              Request Quote
            </GoldButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
