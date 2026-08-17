'use client';

import React, { useState } from 'react';
import { Building2, MessageSquarePlus, Sparkles } from 'lucide-react';
import { EventBuilderState } from '@/lib/types/event-builder';
import { GoldButton } from '@/components/ui/gold-button';
import { CorporateDecorationEnquiryModal } from '@/components/builder/CorporateDecorationEnquiryModal';

interface CorporateDecorationSectionProps {
  state: EventBuilderState;
}

/** Corporate Events -> Decoration is enquiry-only: no browsable list of
 * options, no photos, nothing to add to Your Selections/cart - just one
 * clear "Enquire Now" that opens the enquiry form, since corporate decor is
 * fully customised per client. The form itself still collects everything
 * (including what decoration they want, via Additional Requirements) and
 * reaches the concerned person the same real way every other enquiry does -
 * see CorporateDecorationEnquiryModal. */
export function CorporateDecorationSection({ state }: CorporateDecorationSectionProps) {
  const [modalOpen, setModalOpen] = useState(false);

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
          <Building2 className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-playfair text-xl font-bold text-maroon-900">Corporate Decoration, Fully Customised</h3>
          <p className="text-sm text-maroon-700/80">
            Every corporate decoration setup is designed around your brand and venue, so there&apos;s nothing to pick here. Tell us
            what you need and our concerned representative will reach out with a tailored plan and pricing.
          </p>
        </div>
        <GoldButton variant="copper" size="lg" icon={<MessageSquarePlus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
          Enquire Now
        </GoldButton>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-maroon-700/70">
          <Sparkles className="w-3.5 h-3.5 text-gold-600" /> Nothing is added to your package - this is an enquiry only.
        </p>
      </div>

      {modalOpen && (
        <CorporateDecorationEnquiryModal selectedOptions={[]} prefill={prefill} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}
