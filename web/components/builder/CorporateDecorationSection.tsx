'use client';

import React, { useState } from 'react';
import { Building2, MessageSquarePlus, PartyPopper, Sparkles } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { getEventTypeLabel } from '@/lib/builder/enquiry';
import { GoldButton } from '@/components/ui/gold-button';
import { CorporateDecorationEnquiryModal } from '@/components/builder/CorporateDecorationEnquiryModal';

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

/** Enquiry-only Decoration: no browsable list of options, no photos,
 * nothing to add to Your Selections/cart - just one clear "Enquire Now"
 * that opens the enquiry form. Originally built for Corporate Event, now
 * shared by Get Together, Bachelor Party, Birthday and Other Events too -
 * same flow, same real delivery (WhatsApp + admin CRM), just without the
 * Corporate-only Company Name / Corporate Event Type fields (handled inside
 * CorporateDecorationEnquiryModal via eventTypeId). */
export function CorporateDecorationSection({ state }: CorporateDecorationSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const eventTypeId = state.eventTypeId || '';
  const eventTypeLabel = getEventTypeLabel(state.eventTypeId);
  const isCorporate = eventTypeId === 'corporate_event';
  const copy = COPY[eventTypeId] || DEFAULT_COPY;

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
          selectedOptions={[]}
          prefill={prefill}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
