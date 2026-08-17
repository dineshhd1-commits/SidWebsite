'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { Check, MessageSquarePlus, Sparkles, UtensilsCrossed } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getDecorationCategoriesForEventType, getDecorationPhotosByCategory } from '@/lib/data/decoration-inspiration';
import { GoldButton } from '@/components/ui/gold-button';
import { CorporateDecorationEnquiryModal } from '@/components/builder/CorporateDecorationEnquiryModal';

/** Small thumbnail for a decoration option - falls back to a plain icon tile
 * if the representative photo 404s, same convention as the rest of the
 * builder's dish/photo cards. */
function OptionThumbnail({ src, alt }: { src: string | undefined; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="w-16 h-16 rounded-xl bg-gold-100 border border-gold-300 flex items-center justify-center shrink-0 text-gold-600/70">
        <UtensilsCrossed className="w-5 h-5" />
      </div>
    );
  }
  return (
    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gold-300 shrink-0 bg-gold-50">
      <Image src={src} alt={alt} fill sizes="64px" className="object-cover" onError={() => setFailed(true)} />
    </div>
  );
}

interface CorporateDecorationSectionProps {
  state: EventBuilderState;
}

/** Corporate Events -> Decoration is enquiry-only: customers can't add these
 * to Your Selections/cart because corporate decor is fully customised. Each
 * decoration option gets its own "Enquire Now" (a quick single-option
 * enquiry) plus a checkbox so multiple options can be bundled into one
 * consolidated enquiry via the section-level "Enquire Now" bar - preferred
 * per spec since the concerned person then gets one complete enquiry instead
 * of several separate messages. */
export function CorporateDecorationSection({ state }: CorporateDecorationSectionProps) {
  const categories = useMemo(() => getDecorationCategoriesForEventType('corporate_event'), []);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [modalOptions, setModalOptions] = useState<string[] | null>(null);

  const toggle = (label: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const prefill = {
    name: state.eventDetails.customerName,
    phone: state.eventDetails.customerPhone,
    email: state.eventDetails.customerEmail,
    date: state.eventDetails.date,
    location: state.eventDetails.location,
    guestCount: state.eventDetails.guestCount,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 text-xs bg-gold-50 border border-gold-300 text-maroon-900 rounded-xl px-4 py-3">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-gold-600" />
        <span>
          Corporate decoration is fully customised, so pricing isn&apos;t shown here. Select what you&apos;re interested in and{' '}
          <strong>Enquire Now</strong> - our concerned representative will follow up with a tailored quote. Nothing here is added to
          your package automatically.
        </span>
      </div>

      <div className="rounded-2xl border border-gold-300 bg-white overflow-hidden shadow-sm">
        {categories.map(({ slug, label }) => {
          const photos = getDecorationPhotosByCategory(slug);
          const isChecked = checked.has(label);
          return (
            <div
              key={slug}
              className={`flex items-center gap-4 px-4 py-3.5 transition-colors border-b border-gold-200/60 last:border-b-0 ${
                isChecked ? 'bg-gold-50' : 'hover:bg-gold-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggle(label)}
                className="flex-1 min-w-0 flex items-center gap-4 text-left"
                aria-pressed={isChecked}
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-maroon-800 border-maroon-800' : 'border-gold-400 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 text-gold-200" />}
                </span>
                <OptionThumbnail src={photos[0]?.src} alt={label} />
                <span className="flex-1 min-w-0">
                  <span className="block text-sm font-bold text-maroon-900">{label}</span>
                  <span className="block text-xs text-maroon-700/70">
                    {photos.length} example{photos.length === 1 ? '' : 's'} from our past corporate events
                  </span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setModalOptions([label])}
                className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[10px] font-bold uppercase tracking-wide border border-gold-400 text-maroon-900 hover:bg-maroon-800 hover:text-gold-200 hover:border-maroon-800 transition-colors"
              >
                <MessageSquarePlus className="w-3.5 h-3.5" /> Enquire Now
              </button>
            </div>
          );
        })}
      </div>

      {checked.size > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between gap-3 bg-maroon-950 text-gold-100 rounded-2xl border border-gold-400/50 shadow-2xl px-4 py-3">
          <span className="text-xs font-bold">
            {checked.size} option{checked.size === 1 ? '' : 's'} selected
          </span>
          <GoldButton variant="copper" size="sm" onClick={() => setModalOptions(Array.from(checked))}>
            Enquire Now
          </GoldButton>
        </div>
      )}

      {modalOptions && (
        <CorporateDecorationEnquiryModal selectedOptions={modalOptions} prefill={prefill} onClose={() => setModalOptions(null)} />
      )}
    </div>
  );
}
