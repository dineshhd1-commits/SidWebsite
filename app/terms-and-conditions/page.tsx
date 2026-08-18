'use client';

import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { TraditionalBorder } from '@/components/ui/traditional-border';

/** One numbered clause. Numbers are rendered exactly as given in the source
 * document, including its own gap after point 8 (a note sits where "9"
 * would be) - nothing here renumbers or reorders the provided content. An
 * optional `note` renders as a smaller italic clarification directly under
 * the point (e.g. point 3's delivery-timeline clarification), still inside
 * the same list item so the markup stays valid. */
function TermsPoint({ number, note, children }: { number: number; note?: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="shrink-0 w-7 h-7 rounded-full bg-maroon-800 text-gold-300 text-xs font-bold flex items-center justify-center mt-0.5">
        {number}
      </span>
      <div className="pt-0.5">
        <p className="text-sm text-maroon-900 leading-relaxed">{children}</p>
        {note && <p className="text-xs text-maroon-700/80 italic mt-1.5 pl-3 border-l-2 border-gold-300">{note}</p>}
      </div>
    </li>
  );
}

/** Standalone warning/note callout - used for the delayed-payments warning
 * and anywhere else the source content sets a note apart from the numbered
 * list rather than attaching it to one specific point. */
function TermsCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl px-4 py-3 text-sm">
      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
      <p className="leading-relaxed">{children}</p>
    </div>
  );
}

function TermsSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="space-y-4">
      <h2 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900 border-b border-gold-300 pb-3 flex items-center gap-2.5">
        <span aria-hidden>{icon}</span> {title}
      </h2>
      <ol className="space-y-4">{children}</ol>
    </GlassCard>
  );
}

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <span className="text-gold-600 font-semibold text-xs uppercase tracking-widest bg-gold-100 px-3 py-1 rounded-full border border-gold-300 inline-flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Must Read
        </span>
        <h1 className="font-playfair text-3xl sm:text-5xl font-bold text-maroon-900">
          Event Management Terms &amp; Conditions
        </h1>
        <p className="text-maroon-700/80 text-sm">
          Please read these terms carefully before confirming your booking with SID Events. Numbering follows the
          agreement exactly as issued.
        </p>
        <TraditionalBorder />
      </div>

      <TermsSection icon="📸" title="Photography & Data Delivery">
        <TermsPoint number={1}>
          A preview set of 10 edited photographs will be shared within <strong>10-15 days</strong>{' '}after the shoot is
          completed.
        </TermsPoint>
        <TermsPoint number={2}>
          Full RAW data will be delivered within <strong>30 days</strong>{' '}of the shoot. The client must provide a hard
          drive for data transfer.
        </TermsPoint>
        <TermsPoint
          number={3}
          note="Note: Client response time for feedback or revisions is not counted in this delivery timeline."
        >
          Final edited photos and videos, including the online album, will be delivered within{' '}
          <strong>3 months</strong>{' '}of the event date.
        </TermsPoint>
        <TermsPoint number={4}>
          The printed album will be designed and printed within <strong>30 days</strong>{' '}after the client selects the
          photographs. Photo selection is the client&apos;s responsibility.
        </TermsPoint>
        <TermsPoint number={5}>
          RAW data will be handed over via <strong>hard drive / pen drive (provided by the client)</strong>{' '}or shared
          via <strong>Google Drive (Photos only)</strong>.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="💳" title="Payment Terms">
        <TermsPoint number={6}>
          <strong>50% advance payment</strong>{' '}is required at the time of booking confirmation.
        </TermsPoint>
        <TermsPoint number={7}>
          <strong>49% payment</strong>{' '}should be cleared on the wedding/event day.
        </TermsPoint>
        <TermsPoint number={8}>
          <strong>1% payment</strong>{' '}upon RAW data delivery or taking printing delivery.
        </TermsPoint>
        <li>
          <TermsCallout>
            Note: Delayed payments beyond the due date will result in deliveries, editing, and printing being put on
            hold until cleared.
          </TermsCallout>
        </li>
      </TermsSection>

      <TermsSection icon="🗓️" title="Postponement & Cancellation Policy">
        <TermsPoint number={10}>
          If the event is postponed <strong>more than 40 days</strong>{' '}before the scheduled date, the entire advance
          amount will be adjusted for the new date.
        </TermsPoint>
        <TermsPoint number={11}>
          If postponed <strong>within 40 days</strong>, an additional charge of <strong>10-15%</strong>{' '}may apply.
        </TermsPoint>
        <TermsPoint number={12}>
          In the case of cancellation <strong>within 40 days</strong>, a cancellation charge of{' '}
          <strong>15%</strong>{' '}of the total invoice will be applicable and <strong>no tax refund</strong>{' '}will be
          made.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="📦" title="Delivery Timeline">
        <TermsPoint number={13}>Preview photos will be delivered within <strong>15 days</strong>{' '}from the shoot date.</TermsPoint>
        <TermsPoint number={14}>RAW photographs will be delivered within <strong>30 days</strong>.</TermsPoint>
        <TermsPoint number={15}>Final edited photos and digital album will be delivered within <strong>60 days</strong>.</TermsPoint>
        <TermsPoint number={16}>Edited videos will be delivered within <strong>90 days</strong>.</TermsPoint>
        <TermsPoint number={17}>
          Clients must collect RAW data within <strong>3 months</strong>{' '}from the shoot date. The agency will not be
          responsible for data loss beyond this period.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="⚖️" title="Copyright & Usage">
        <TermsPoint number={18}>
          All photographs, videos, and content produced are the <strong>intellectual property of the agency
          (L.I.F.)</strong>.
        </TermsPoint>
        <TermsPoint number={19}>
          The agency retains full copyright and may use content for <strong>marketing and promotional</strong>{' '}
          purposes on its website and social media platforms.
        </TermsPoint>
        <TermsPoint number={20}>
          Unauthorized reproduction or distribution without prior written permission will invite legal action under{' '}
          <strong>The Copyright Act, 1957</strong>.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="🍽️" title="Food & Meals Policy">
        <TermsPoint number={21}>
          Meals for the event team must be arranged by the client. If not, the team will require designated breaks
          for meals.
        </TermsPoint>
        <TermsPoint number={22}>
          <strong>Food menu changes must be communicated at least 15 days</strong>{' '}prior to the event for
          adjustments.
        </TermsPoint>
        <TermsPoint number={23}>
          Changes to the menu <strong>after final agreement</strong>{' '}will result in revised costs. Clients must
          approve these changes formally.
        </TermsPoint>
        <TermsPoint number={24}>
          If the <strong>guest count increases</strong>, the client must inform 15 days prior. If informed{' '}
          <strong>on the event day</strong>, extra charges apply starting from <strong>₹300 per plate</strong>.
        </TermsPoint>
        <TermsPoint number={25}>
          If the <strong>guest count decreases</strong>, no changes will be made to the agreed price; the charge will
          remain as per the original agreement.
        </TermsPoint>
        <TermsPoint number={26}>
          The client must confirm whether the meal system will be <strong>Buffet or Plate Service</strong>{' '}at least{' '}
          <strong>15 days prior</strong>{' '}to allow necessary arrangements.
        </TermsPoint>
        <TermsPoint number={27}>
          <strong>No one from the client&apos;s side is permitted to enter the kitchen</strong>{' '}without prior
          permission. The event team will fully manage serving and food handling.
        </TermsPoint>
        <TermsPoint number={28}><strong>Leftover raw materials/rations</strong>{' '}are not to be carried away by clients.</TermsPoint>
        <TermsPoint number={29}>
          If clients wish to take away <strong>leftover sweets</strong>, this must be pre-informed to the event
          manager. The client must provide appropriate packaging; the event team will not supply boxes.
        </TermsPoint>
        <TermsPoint number={30}>
          <strong>Extra water bottles</strong>{' '}beyond the pre-agreed meal plan will not be provided. However, two
          water filters will be arranged for general guest use.
        </TermsPoint>
        <TermsPoint number={31}>
          Any <strong>special items</strong>{' '}like Pan Beda, Ice Cream, or Specialty Sweets will be provided{' '}
          <strong>once</strong>{' '}as per the agreed menu. General food items will be served <strong>unlimited</strong>{' '}
          unless otherwise specified.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="🏛️" title="Venue, Cleaning & Infrastructure Policy">
        <TermsPoint number={32}>
          If the <strong>marriage hall is booked by the client</strong>, <strong>cleaning responsibilities</strong>{' '}
          fall entirely on the client. The event team will not provide manpower for this task.
        </TermsPoint>
        <TermsPoint number={33}>
          The client is responsible for arranging <strong>water, electricity, cylinder refills, and</strong>{' '}
          cleaning supplies for the venue, including grinder and vessel washing.
        </TermsPoint>
        <TermsPoint number={34}>
          <strong>Stage decoration, hall cleaning, and room cleaning</strong>{' '}are not the responsibility of the event
          management team.
        </TermsPoint>
        <TermsPoint number={35}>
          The event management team will also not be responsible for <strong>guests&apos; personal belongings or
          client&apos;s belongings during the event</strong>.
        </TermsPoint>
        <TermsPoint number={36}>
          <strong>Guest room arrangements are the sole responsibility of the client</strong>. The event management
          team will not handle or arrange guest accommodations.
        </TermsPoint>
        <TermsPoint number={37}>
          It is <strong>mandatory</strong>{' '}for the client to <strong>book one room</strong>{' '}exclusively for the event
          management team. <strong>This room should be located within the marriage hall premises</strong>{' '}for the
          convenience of the team.
        </TermsPoint>
        <TermsPoint number={38}>
          Dining hall setup, table arrangements, and chair arrangements will not be handled by the event management
          team. The client must make separate arrangements for these.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="🚚" title="Transportation & Liability">
        <TermsPoint number={39}>
          If transportation is included in the package, any <strong>accidents, legal fines, or medical
          emergencies</strong>{' '}will be at the client&apos;s expense. The event management team will not cover these
          costs.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="📢" title="Permissions & Noise Regulations">
        <TermsPoint number={40}>
          As per government rules, <strong>music systems will be turned off after 10:00 PM</strong>. If continued use
          leads to complaints, the client is solely responsible for resolving them.
        </TermsPoint>
        <TermsPoint number={41}>
          Any <strong>special permissions</strong>{' '}for fireworks, fog systems, or outdoor decor must be obtained by
          the client. Any <strong>property damage caused by these</strong>{' '}will be the client&apos;s liability.
        </TermsPoint>
        <TermsPoint number={42}>
          The client is responsible for <strong>shock circuit issues</strong>{' '}or electrical faults at the venue.
        </TermsPoint>
        <TermsPoint number={43}>
          Any <strong>physical damage</strong>{' '}to event property caused by the client or their guests will be the
          client&apos;s financial responsibility.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="🎀" title="Decor & Presentation Policy">
        <TermsPoint number={44}>
          Decorations will match the <strong>agreed concept with 70-80% accuracy</strong>, depending on the location.
        </TermsPoint>
      </TermsSection>

      <TermsSection icon="🔁" title="Event Changes Policy">
        <TermsPoint number={45}>
          Any changes to the event structure, design, or arrangements must be informed at least{' '}
          <strong>30 days before the event</strong>{' '}to allow time for adjustments.{' '}
          <strong>On-spot changes are not guaranteed</strong>{' '}and may incur extra charges.
        </TermsPoint>
      </TermsSection>

      <GlassCard variant="warm" className="space-y-4 text-center border-2 border-gold-400">
        <h2 className="font-playfair text-xl sm:text-2xl font-bold text-maroon-900 flex items-center justify-center gap-2.5">
          <span aria-hidden>✅</span> Client Confirmation
        </h2>
        <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
          Please carefully read and understand all terms and conditions before confirming the booking.
        </p>
        <p className="text-sm text-maroon-900 leading-relaxed max-w-2xl mx-auto">
          Acceptance of this agreement implies the client&apos;s acknowledgment and consent to the policies mentioned
          above.
        </p>
        <p className="text-xs text-maroon-700/80 italic">Signed copy required prior to the event.</p>
      </GlassCard>
    </div>
  );
}
