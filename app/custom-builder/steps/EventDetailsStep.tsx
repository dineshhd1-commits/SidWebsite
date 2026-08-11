'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { EventDetails } from '@/lib/types/event-builder';
import { EventType } from '@/lib/types/catalog';
import { EventTypeSelectField } from '@/components/builder/EventTypeSelectField';

interface EventDetailsStepProps {
  eventTypes: EventType[];
  selectedEventTypeId: string | null;
  onEventTypeChange: (eventTypeId: string) => void;
  eventDetails: EventDetails;
  onChange: (partial: Partial<EventDetails>) => void;
  /** Bumped by the page's "Change Event Type" shortcut to open the picker. */
  autoOpenEventTypeToken?: number;
}

function todayISODate(): string {
  return new Date().toISOString().split('T')[0];
}

export function EventDetailsStep({ eventTypes, selectedEventTypeId, onEventTypeChange, eventDetails, onChange, autoOpenEventTypeToken }: EventDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-gold-300/40 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-maroon-900">Event Details</h2>
        <p className="text-xs text-maroon-700/80">
          Share what you already know - you can keep browsing services and fill in the rest before you submit.
        </p>
      </div>

      <GlassCard className="space-y-5">
        {/* Row 1: Event Type */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">
            What Type of Event Are You Planning? <span className="text-rose-600">*</span>
          </label>
          <EventTypeSelectField
            eventTypes={eventTypes}
            value={selectedEventTypeId}
            onChange={onEventTypeChange}
            autoOpenToken={autoOpenEventTypeToken}
          />
        </div>

        {/* Row 2: Event Date | Number of Guests */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1">Event Date <span className="text-rose-600">*</span></label>
            <input
              type="date"
              min={todayISODate()}
              value={eventDetails.date}
              onChange={(e) => onChange({ date: e.target.value })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1">Number of Guests <span className="text-rose-600">*</span></label>
            <input
              type="number"
              min={1}
              placeholder="e.g. 300"
              value={eventDetails.guestCount || ''}
              onChange={(e) => onChange({ guestCount: Math.max(0, parseInt(e.target.value) || 0) })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            />
          </div>
        </div>

        {/* Row 3: Event Location */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">Event Location <span className="text-rose-600">*</span></label>
          <input
            type="text"
            required
            placeholder="e.g. Davanagere"
            value={eventDetails.location}
            onChange={(e) => onChange({ location: e.target.value })}
            className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>

        {/* Row 4: Name | Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1">Your Name <span className="text-rose-600">*</span></label>
            <input
              type="text"
              placeholder="e.g. Aditya Hegde"
              value={eventDetails.customerName}
              onChange={(e) => onChange({ customerName: e.target.value })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-maroon-900 mb-1">Phone Number <span className="text-rose-600">*</span></label>
            <input
              type="tel"
              inputMode="numeric"
              maxLength={10}
              placeholder="98765 43210"
              value={eventDetails.customerPhone}
              onChange={(e) => onChange({ customerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            />
          </div>
        </div>

        {/* Row 5: Email Address */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">Email Address (optional)</label>
          <input
            type="email"
            placeholder="aditya@example.com"
            value={eventDetails.customerEmail}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>

        {/* Row 6: Special Requirements */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">Special Requirements</label>
          <textarea
            rows={3}
            placeholder="Anything specific we should know..."
            value={eventDetails.specialRequirements}
            onChange={(e) => onChange({ specialRequirements: e.target.value })}
            className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
          />
        </div>

        <p className="text-[11px] text-maroon-700/70">
          You don&apos;t need to fill everything in now - feel free to move on and browse decoration, photography, catering and more first.
        </p>
      </GlassCard>
    </div>
  );
}
