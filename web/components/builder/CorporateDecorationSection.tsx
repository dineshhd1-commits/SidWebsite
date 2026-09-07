'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Building2, Check, Images, MessageSquarePlus, PartyPopper, Sparkles } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getEventTypeLabel } from '@/lib/builder/enquiry';
import { getDecorationPhotosByCategory, getWatermarkedDecorationSrc } from '@/lib/data/decoration-inspiration';
import { GoldButton } from '@/components/ui/gold-button';
import { CorporateDecorationEnquiryModal } from '@/components/builder/CorporateDecorationEnquiryModal';

/** Event types that are enquiry-only for decoration (no checklist, nothing
 * added to cart) but still have a real designated photo folder worth
 * showing as inspiration above the Enquire card. Maps to the decoration
 * category slug whose photos live only in that event's own /decotion/
 * subfolder - see lib/data/decoration-inspiration.ts. */
const INSPIRATION_CATEGORY_BY_EVENT: Record<string, string> = {
  corporate_event: 'corporate-events',
  haldi_function: 'haldi-decoration',
  traditional_home_function: 'naming-ceremony',
  housewarming: 'housewarming-decoration',
};

/** Cap on how many inspiration photos to show here - this is a quick taste
 * of the work, not the full browsable catalog (some of these folders run
 * to 100+ photos), so the enquiry card stays the focus of the page. */
const MAX_INSPIRATION_PHOTOS = 12;

/** Inspiration tile the customer can select as a design they like - nothing
 * is added to the cart (this event type is still enquiry-only), the pick is
 * just carried along as a named option on the enquiry (see selectedOptions
 * on CorporateDecorationEnquiryDetails) so the team knows which look to
 * quote for. Reuses the same watermarked source and drag/right-click
 * protection as the selectable gallery elsewhere in the builder. */
function InspirationPhotoTile({
  src,
  alt,
  selected,
  onToggle,
}: {
  src: string;
  alt: string;
  selected: boolean;
  onToggle: () => void;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <button
      type="button"
      onClick={onToggle}
      onContextMenu={(e) => e.preventDefault()}
      style={{ WebkitTouchCallout: 'none', WebkitUserDrag: 'none' } as React.CSSProperties}
      title={selected ? 'Click to deselect this design' : 'Click to select this design'}
      aria-pressed={selected}
      className={`group relative aspect-square rounded-xl overflow-hidden bg-maroon-950/5 select-none transition-all ${
        selected ? 'border-2 border-gold-500 ring-2 ring-gold-400/80 shadow-md' : 'border-2 border-gold-200 hover:border-gold-400'
      }`}
    >
      {failed ? (
        <div className="w-full h-full bg-gold-100 flex items-center justify-center text-gold-600/70">
          <Images className="w-6 h-6" />
        </div>
      ) : (
        <Image
          src={getWatermarkedDecorationSrc(src)}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
          loading="lazy"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          className="object-contain pointer-events-none"
          onError={() => setFailed(true)}
        />
      )}
      {selected && (
        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-maroon-800 border border-gold-400 text-gold-200 flex items-center justify-center shadow">
          <Check className="w-3 h-3" />
        </span>
      )}
    </button>
  );
}

interface CorporateDecorationSectionProps {
  state: EventBuilderState;
}

const COPY: Record<string, { title: string; body: string }> = {
  corporate_event: {
    title: 'Corporate Decoration, Fully Customised',
    body: "Every corporate decoration setup is designed around your brand and venue, so there's nothing to pick here. Tell us what you need and our concerned representative will reach out with a tailored plan and pricing.",
  },
};

const DEFAULT_COPY = {
  title: 'Decoration, Fully Customised',
  body: "This event's decoration is designed around what you have in mind, so there's nothing to pick here. Tell us what you need and our concerned representative will reach out with a tailored plan and pricing.",
};

/** Enquiry-only Decoration: no browsable/selectable list of options,
 * nothing to add to Your Selections/cart - just one clear "Enquire Now"
 * that opens the enquiry form. Originally built for Corporate Event, now
 * shared by Get Together, Bachelor Party, Birthday and Other Events too -
 * same flow, same real delivery (WhatsApp + admin CRM), just without the
 * Corporate-only Company Name / Corporate Event Type fields (handled inside
 * CorporateDecorationEnquiryModal via eventTypeId). Corporate Event, Haldi
 * Function and Traditional Home Function additionally get a read-only
 * inspiration gallery above the card (see INSPIRATION_CATEGORY_BY_EVENT) -
 * still enquiry-only, the photos are just a preview of past work, not a
 * picker. */
export function CorporateDecorationSection({ state }: CorporateDecorationSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhotoIds, setSelectedPhotoIds] = useState<Set<string>>(new Set());
  const eventTypeId = state.eventTypeId || '';
  const eventTypeLabel = getEventTypeLabel(state.eventTypeId);
  const isCorporate = eventTypeId === 'corporate_event';
  const copy = COPY[eventTypeId] || DEFAULT_COPY;

  const inspirationCategory = INSPIRATION_CATEGORY_BY_EVENT[eventTypeId];
  const inspirationPhotos = React.useMemo(
    () => (inspirationCategory ? getDecorationPhotosByCategory(inspirationCategory).slice(0, MAX_INSPIRATION_PHOTOS) : []),
    [inspirationCategory]
  );

  const togglePhoto = (photoId: string) => {
    setSelectedPhotoIds((prev) => {
      const next = new Set(prev);
      if (next.has(photoId)) next.delete(photoId);
      else next.add(photoId);
      return next;
    });
  };

  // Carried into the enquiry as named options (see CorporateDecorationEnquiryDetails.selectedOptions) -
  // numbered per photo since every photo in a category shares the same categoryLabel.
  const selectedPhotoLabels = inspirationPhotos
    .map((photo, i) => ({ photo, label: `${photo.categoryLabel} - Design #${i + 1}` }))
    .filter(({ photo }) => selectedPhotoIds.has(photo.id))
    .map(({ label }) => label);

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
      {inspirationPhotos.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-playfair text-lg font-bold text-maroon-900">Past Work &amp; Inspiration</h3>
            <span className="text-[10px] font-bold text-maroon-700/60 uppercase tracking-wide shrink-0">
              {inspirationPhotos.length} photo{inspirationPhotos.length === 1 ? '' : 's'}
            </span>
          </div>
          <p className="text-[11px] text-maroon-700/70 -mt-1.5">
            Tap any design you like - we&apos;ll note it on your enquiry so the team knows the look to quote for.
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {inspirationPhotos.map((photo) => (
              <InspirationPhotoTile
                key={photo.id}
                src={photo.src}
                alt={photo.categoryLabel}
                selected={selectedPhotoIds.has(photo.id)}
                onToggle={() => togglePhoto(photo.id)}
              />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-3xl border-2 border-gold-300 bg-gold-50/60 px-6 py-10 sm:py-14 text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-maroon-800 text-gold-300 flex items-center justify-center mx-auto shadow-md">
          {isCorporate ? <Building2 className="w-7 h-7" /> : <PartyPopper className="w-7 h-7" />}
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-playfair text-xl font-bold text-maroon-900">{copy.title}</h3>
          <p className="text-sm text-maroon-700/80">{copy.body}</p>
        </div>
        <GoldButton variant="copper" size="lg" icon={<MessageSquarePlus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Enquire Now
        </GoldButton>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-maroon-700/70">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Nothing is added to your package - this is an enquiry only.
        </p>
      </div>

      {modalOpen && (
        <CorporateDecorationEnquiryModal
          eventTypeId={eventTypeId}
          eventTypeLabel={eventTypeLabel}
          selectedOptions={selectedPhotoLabels}
          prefill={prefill}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
