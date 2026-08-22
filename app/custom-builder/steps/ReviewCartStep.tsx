'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Share2, CheckCircle, Edit3, AlertCircle, Loader2 } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { CatalogCategoryKey } from '@/lib/types/catalog';
import { getCartLines, getRequestedExtraLines } from '@/lib/builder/selectors';
import { getMissingRequiredFieldsForSubmit } from '@/lib/builder/validation';
import { GlassCard } from '@/components/ui/glass-card';
import { GoldButton } from '@/components/ui/gold-button';
import { getWhatsAppShareUrl } from '@/lib/whatsapp';
import { buildEnquiryDetails } from '@/lib/builder/enquiry';
import { uploadEnquiryPdf } from '@/lib/store/admin-store';
import { getWatermarkedDecorationSrc } from '@/lib/data/decoration-inspiration';

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
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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
  // Menu → Category, in a fixed Morning/Afternoon/Evening order - matches the
  // Catering step's own cart so nothing merges together here that was kept
  // separate there.
  const MENU_ORDER = ['morning', 'afternoon', 'evening'] as const;
  const cateringByMenu = cateringSelections.reduce<
    Record<string, { lines: typeof cateringSelections; byCategory: Record<string, { categoryName: string; lines: typeof cateringSelections }> }>
  >((acc, line) => {
    if (!acc[line.menuType]) acc[line.menuType] = { lines: [], byCategory: {} };
    acc[line.menuType].lines.push(line);
    if (!acc[line.menuType].byCategory[line.categoryId]) {
      acc[line.menuType].byCategory[line.categoryId] = { categoryName: line.categoryName, lines: [] };
    }
    acc[line.menuType].byCategory[line.categoryId].lines.push(line);
    return acc;
  }, {});
  const cateringMenusInOrder = MENU_ORDER.filter((menuType) => cateringByMenu[menuType]);

  const handleWhatsAppInquiry = async () => {
    setIsGeneratingPdf(true);
    let pdfUrl: string | null = null;
    try {
      const fullDetails = buildEnquiryDetails(state);
      const submittedAtIso = new Date().toISOString();
      const { generateEnquiryPdfBlob } = await import('@/lib/builder/enquiry-pdf');
      const pdfBlob = await generateEnquiryPdfBlob(fullDetails, quoteId, submittedAtIso);

      // Trigger instant browser download so user has the generated PDF file directly
      const blobUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `SID-Events-Quotation-${quoteId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

      // Upload to storage if configured
      pdfUrl = await uploadEnquiryPdf(pdfBlob, quoteId);
    } catch (err) {
      console.error('PDF generation/upload failed; falling back to standard WhatsApp message.', err);
    } finally {
      setIsGeneratingPdf(false);
    }

    const waUrl = getWhatsAppShareUrl(quoteId, state, undefined, pdfUrl);
    window.open(waUrl, '_blank');
  };

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
          {eventDetails.anniversaryType && (
            <div><span className="text-maroon-700/60 block font-semibold">Anniversary Type</span>{eventDetails.anniversaryType}</div>
          )}
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
              <div className="space-y-2">
                {lines.map((line) => {
                  const isDec = categoryKey === 'decoration';
                  const imgUrl = line.imageUrl ? getWatermarkedDecorationSrc(line.imageUrl) : null;

                  return (
                    <div key={line.id} className="flex items-center gap-3 text-xs text-maroon-900 py-1">
                      {isDec && imgUrl && (
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gold-300 shrink-0 bg-gold-50 shadow-xs">
                          <img
                            src={imgUrl}
                            alt={line.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="font-semibold text-maroon-950 block">{line.name}</span>
                        {line.quantity > 1 && (
                          <span className="text-[11px] text-maroon-700/80 font-medium">Quantity: {line.quantity}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </GlassCard>

      {/* Catering Menu Section */}
      {(state.cateringTiming || cateringSelections.length > 0 || state.cateringSkipped) && (
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
          {state.cateringSkipped && cateringSelections.length === 0 ? (
            <p className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200">
              Catering has been skipped for this event package.
            </p>
          ) : cateringSelections.length === 0 ? (
            <p className="text-xs text-maroon-700/80">No dishes selected yet.</p>
          ) : (
            cateringMenusInOrder.map((menuType) => (
              <div key={menuType} className="space-y-2 pb-3 border-b border-gold-300/60 last:border-b-0 last:pb-0">
                <p className="text-xs font-bold text-maroon-900">
                  {CATERING_TIMING_LABELS[menuType]}
                  {!!state.cateringGuestCounts[menuType] && (
                    <>
                      <span className="font-semibold text-maroon-700/60"> · Guests: </span>
                      {state.cateringGuestCounts[menuType]}
                    </>
                  )}
                </p>
                {Object.entries(cateringByMenu[menuType].byCategory).map(([categoryId, group]) => (
                  <div key={categoryId} className="space-y-1.5 pb-2 last:pb-0">
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
                ))}
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
          <button
            type="button"
            onClick={handleWhatsAppInquiry}
            disabled={isGeneratingPdf}
            className="w-full"
          >
            <GoldButton variant="dark" size="sm" fullWidth icon={isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}>
              {isGeneratingPdf ? 'Generating PDF...' : 'WhatsApp Inquiry'}
            </GoldButton>
          </button>

          <Link href="/booking" className="w-full">
            <GoldButton variant="gold" size="sm" fullWidth icon={<CheckCircle className="w-4 h-4" />}>
              Submit Event Request
            </GoldButton>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
