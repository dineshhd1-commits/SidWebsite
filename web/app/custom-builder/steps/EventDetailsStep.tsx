'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { EventDetails } from '@/lib/types/event-builder';
import { EventType } from '@/lib/types/catalog';
import { EventTypeSelectField } from '@/components/builder/EventTypeSelectField';
import { LocationAutocompleteField } from '@/components/builder/LocationAutocompleteField';
import { isValidCustomerEmail, MAX_GUEST_COUNT } from '@/lib/builder/validation';
import { sanitizeAlphanumericOnly } from '@/lib/text-validation';

import { ANNIVERSARY_TYPES } from '@/lib/builder/event-rules';

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
  // Email is optional, so only complain about what has actually been typed.
  const showEmailError = !isValidCustomerEmail(eventDetails.customerEmail);

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

        {/* Anniversary Type (Conditional for Anniversary events) */}
        {selectedEventTypeId === 'anniversary' && (
          <div className="bg-gold-50/60 p-4 rounded-xl border border-gold-300 space-y-1">
            <label htmlFor="anniversary-type-select" className="block text-xs font-bold text-maroon-900">
              Anniversary Type <span className="text-rose-600">*</span>
            </label>
            <select
              id="anniversary-type-select"
              value={eventDetails.anniversaryType || ''}
              onChange={(e) => onChange({ anniversaryType: e.target.value })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30 font-medium"
            >
              <option value="">-- Select Anniversary Type --</option>
              {ANNIVERSARY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-maroon-700/80 mt-1">
              Note: Couple Anniversaries proceed to the custom event builder. Other anniversary types are custom-tailored through our dedicated team inquiry.
            </p>
          </div>
        )}

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
              max={MAX_GUEST_COUNT}
              placeholder="e.g. 300"
              value={eventDetails.guestCount || ''}
              onChange={(e) => onChange({ guestCount: Math.max(0, Math.min(MAX_GUEST_COUNT, parseInt(e.target.value) || 0)) })}
              className="w-full bg-white border border-gold-300 rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:border-gold-500 focus:ring-2 focus:ring-gold-400/30"
            />
            <p className="text-[10px] text-maroon-700/60 mt-1">Maximum guest capacity is {MAX_GUEST_COUNT.toLocaleString('en-IN')}.</p>
          </div>
        </div>

        {/* Row 3: Event Location */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">Event Location <span className="text-rose-600">*</span></label>
          <LocationAutocompleteField
            value={eventDetails.location}
            onChange={(location) => onChange({ location })}
            placeholder="e.g. Davanagere"
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
            placeholder="aditya100@gmail.com"
            value={eventDetails.customerEmail}
            onChange={(e) => onChange({ customerEmail: e.target.value })}
            aria-invalid={showEmailError}
            className={`w-full bg-white border rounded-xl px-4 py-2.5 text-sm text-maroon-900 focus:outline-none focus:ring-2 ${
              showEmailError
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-400/30'
                : 'border-gold-300 focus:border-gold-500 focus:ring-gold-400/30'
            }`}
          />
          {showEmailError && (
            <p className="text-[11px] text-rose-600 font-bold mt-1">
              Please enter a valid email like aditya100@gmail.com - letters and numbers only, ending in @gmail.com.
            </p>
          )}
        </div>

        {/* Row 6: Special Requirements */}
        <div>
          <label className="block text-xs font-bold text-maroon-900 mb-1">
            Special Requirements <span className="text-[10px] text-maroon-700/60 font-normal">(Alphanumeric only)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Anything specific we should know (letters and numbers only)..."
            value={eventDetails.specialRequirements}
            onChange={(e) => onChange({ specialRequirements: sanitizeAlphanumericOnly(e.target.value) })}
            onPaste={(e) => {
              e.preventDefault();
              const pasted = e.clipboardData.getData('text');
              onChange({ specialRequirements: sanitizeAlphanumericOnly(eventDetails.specialRequirements + pasted) });
            }}
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
