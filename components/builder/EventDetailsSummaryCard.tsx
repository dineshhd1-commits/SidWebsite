'use client';

import React from 'react';
import { Edit3, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react';
import { EventDetails } from '@/lib/types/event-builder';

interface EventDetailsSummaryCardProps {
  eventTypeName: string;
  eventDetails: EventDetails;
  onEdit: () => void;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function EventDetailsSummaryCard({ eventTypeName, eventDetails, onEdit }: EventDetailsSummaryCardProps) {
  return (
    <div className="bg-gold-50/70 border border-gold-300 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-maroon-900">
        <span className="font-playfair font-bold text-sm text-maroon-950">{eventTypeName}</span>
        {eventDetails.date && (
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-gold-600" /> {formatDate(eventDetails.date)}</span>
        )}
        {eventDetails.guestCount > 0 && (
          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5 text-gold-600" /> {eventDetails.guestCount} Guests</span>
        )}
        {eventDetails.location && (
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gold-600" /> {eventDetails.location}</span>
        )}
        {eventDetails.customerName && <span>{eventDetails.customerName}</span>}
        {eventDetails.customerPhone && (
          <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gold-600" /> {eventDetails.customerPhone}</span>
        )}
        {eventDetails.customerEmail && (
          <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-gold-600" /> {eventDetails.customerEmail}</span>
        )}
      </div>
      <button
        onClick={onEdit}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-gold-700 hover:text-maroon-900 shrink-0"
      >
        <Edit3 className="w-3.5 h-3.5" /> Edit
      </button>
    </div>
  );
}
