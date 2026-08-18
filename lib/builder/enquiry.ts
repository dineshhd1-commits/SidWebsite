import { EventBuilderState } from '../types/event-builder';
import { CatalogCategoryKey } from '../types/catalog';
import { MOCK_EVENT_TYPES } from '../data/mock-catalog-data';
import { getCartLines, getEstimatedTotal, getRequestedExtraLines } from './selectors';

/** Human labels for whatever categoryKey values show up in the cart - kept
 * here as the single source of truth so the review step, WhatsApp message,
 * and admin CRM all describe categories the same way. Any category not
 * listed here still renders fine (falls back to the raw key). */
const CATEGORY_LABELS: Partial<Record<CatalogCategoryKey, string>> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

const CATEGORY_ICONS: Partial<Record<CatalogCategoryKey, string>> = {
  decoration: '\u{1F380}', // 🎀
  photography: '\u{1F4F8}', // 📸
  catering: '\u{1F37D}\u{FE0F}', // 🍽️
  venue: '\u{1F3DB}\u{FE0F}', // 🏛️
  additional_services: '\u{2728}', // ✨
};

const CATERING_TIMING_LABELS: Record<string, string> = {
  morning: 'Morning (Breakfast menu)',
  afternoon: 'Afternoon (Lunch menu)',
  evening: 'Evening (Dinner menu)',
};

export interface EnquirySelectionLine {
  name: string;
  quantity: number;
  imageUrl?: string;
  /** The catalog group this line came from (e.g. 'dec-home',
   * 'photo-prewedding-services', or 'decoration-inspiration' for the photo
   * gallery) - carried through so downstream consumers like the PDF
   * generator can sub-group a section (Home Decoration vs Venue Decoration,
   * Pre-Wedding Shoot vs Wedding Hall photography) without re-deriving it
   * from scratch. */
  groupId?: string | null;
}

export interface EnquiryCategorySection {
  categoryKey: string;
  label: string;
  icon: string;
  lines: EnquirySelectionLine[];
}

export interface EnquiryCateringSection {
  categoryName: string;
  lines: EnquirySelectionLine[];
}

/** Everything the customer picked, structured by whatever categories are
 * actually present in their cart right now - nothing here is hard-coded to
 * a fixed list of categories, so a new catalog category (or the catering
 * menu, which lives outside `cart` entirely) shows up automatically. */
export interface EnquiryDetails {
  eventTypeId: string | null;
  eventTypeLabel: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventDate: string;
  location: string;
  guestCount: number;
  specialRequirements: string;
  sections: EnquiryCategorySection[];
  cateringTiming: string | null;
  cateringGuestCount: number | null;
  cateringSections: EnquiryCateringSection[];
  requestedExtras: EnquirySelectionLine[];
  estimatedTotal: number;
  totalSelectionsCount: number;
}

export interface BookingFormOverrides {
  fullName: string;
  phone: string;
  email: string;
  weddingDate: string;
  venueCity: string;
  venueAddress: string;
  notes?: string;
}

/** The booking form re-collects/refines a couple of fields (venue address
 * isn't asked earlier in the builder) - this merges those confirmed values
 * over the builder's snapshot so the enquiry reflects exactly what the
 * customer just submitted, without mutating the live builder state. */
export function mergeBookingFormIntoState(state: EventBuilderState, formData: BookingFormOverrides): EventBuilderState {
  return {
    ...state,
    eventDetails: {
      ...state.eventDetails,
      customerName: formData.fullName || state.eventDetails.customerName,
      customerPhone: formData.phone || state.eventDetails.customerPhone,
      customerEmail: formData.email || state.eventDetails.customerEmail,
      date: formData.weddingDate || state.eventDetails.date,
      location: [formData.venueAddress, formData.venueCity].filter(Boolean).join(', ') || state.eventDetails.location,
      specialRequirements: formData.notes || state.eventDetails.specialRequirements,
    },
  };
}

export function getEventTypeLabel(eventTypeId: string | null): string {
  if (!eventTypeId) return 'Not specified';
  const match = MOCK_EVENT_TYPES.find((t) => t.id === eventTypeId);
  return match?.name || eventTypeId;
}

/** Builds the complete, dynamic enquiry payload from live builder state.
 * This is the single source of truth for what gets shown to the customer
 * in review, sent to the owner via WhatsApp, and stored for the admin CRM. */
export function buildEnquiryDetails(state: EventBuilderState): EnquiryDetails {
  const cartLines = getCartLines(state).filter((l) => l.origin !== 'requested_extra');
  const requestedExtras = getRequestedExtraLines(state);

  const sectionsByCategory = new Map<string, EnquiryCategorySection>();
  for (const line of cartLines) {
    const key = line.categoryKey;
    if (!sectionsByCategory.has(key)) {
      sectionsByCategory.set(key, {
        categoryKey: key,
        label: CATEGORY_LABELS[key] || key,
        icon: CATEGORY_ICONS[key] || '\u{1F4E6}', // 📦
        lines: [],
      });
    }
    sectionsByCategory.get(key)!.lines.push({ name: line.name, quantity: line.quantity, imageUrl: line.imageUrl, groupId: line.groupId });
  }

  const cateringSelections = Object.values(state.cateringSelections);
  const cateringSectionsByName = new Map<string, EnquiryCateringSection>();
  for (const line of cateringSelections) {
    if (!cateringSectionsByName.has(line.categoryName)) {
      cateringSectionsByName.set(line.categoryName, { categoryName: line.categoryName, lines: [] });
    }
    cateringSectionsByName.get(line.categoryName)!.lines.push({ name: line.itemName, quantity: line.quantity });
  }

  const cateringGuestCount = state.cateringTiming ? state.cateringGuestCounts[state.cateringTiming] ?? null : null;

  return {
    eventTypeId: state.eventTypeId,
    eventTypeLabel: getEventTypeLabel(state.eventTypeId),
    customerName: state.eventDetails.customerName,
    customerPhone: state.eventDetails.customerPhone,
    customerEmail: state.eventDetails.customerEmail,
    eventDate: state.eventDetails.date,
    location: state.eventDetails.location,
    guestCount: state.eventDetails.guestCount,
    specialRequirements: state.eventDetails.specialRequirements,
    sections: Array.from(sectionsByCategory.values()),
    cateringTiming: state.cateringTiming,
    cateringGuestCount,
    cateringSections: Array.from(cateringSectionsByName.values()),
    requestedExtras: requestedExtras.map((l) => ({ name: l.name, quantity: l.quantity })),
    estimatedTotal: getEstimatedTotal(state),
    totalSelectionsCount: cartLines.length + cateringSelections.length,
  };
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return 'Not set';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

/** Renders the full professional notification format (banner, sections,
 * total, timestamp) as plain text - used for the WhatsApp message body and
 * reusable anywhere else plain-text is needed. */
export function formatEnquiryMessage(details: EnquiryDetails, refCode: string, submittedAtIso: string): string {
  const divider = '━━━━━━━━━━━━━━━━━━━━'; // ━×20

  const lines: string[] = [];
  lines.push(divider);
  lines.push('\u{1F389} NEW EVENT ENQUIRY'); // 🎉
  lines.push('SID EVENTS');
  lines.push(divider);
  lines.push('');
  lines.push('\u{1F464} CUSTOMER DETAILS'); // 👤
  lines.push(`Name: ${details.customerName || 'Not provided'}`);
  lines.push(`Phone: ${details.customerPhone || 'Not provided'}`);
  lines.push(`Email: ${details.customerEmail || 'Not provided'}`);
  lines.push('');
  lines.push('\u{1F4C5} EVENT DETAILS'); // 📅
  lines.push(`Event Type: ${details.eventTypeLabel}`);
  lines.push(`Date: ${formatDate(details.eventDate)}`);
  lines.push(`Location: ${details.location || 'Not provided'}`);
  lines.push(`Guests: ${details.guestCount || 'Not specified'}`);
  if (details.specialRequirements) {
    lines.push(`Notes: ${details.specialRequirements}`);
  }
  lines.push('');
  lines.push(divider);
  lines.push('\u{1F4E6} SELECTED SERVICES'); // 📦
  lines.push(divider);

  if (details.sections.length === 0 && details.cateringSections.length === 0) {
    lines.push('');
    lines.push('No services selected yet.');
  }

  for (const section of details.sections) {
    lines.push('');
    lines.push(`${section.icon} ${section.label.toUpperCase()}`);
    for (const item of section.lines) {
      lines.push(`• ${item.name}${item.quantity > 1 ? ` x${item.quantity}` : ''}`);
    }
  }

  if (details.cateringSections.length > 0) {
    lines.push('');
    lines.push(`${CATEGORY_ICONS.catering} CATERING MENU`);
    if (details.cateringTiming) {
      const timingLabel = CATERING_TIMING_LABELS[details.cateringTiming] || details.cateringTiming;
      lines.push(`• Timing: ${timingLabel}${details.cateringGuestCount ? ` (${details.cateringGuestCount} guests)` : ''}`);
    }
    for (const section of details.cateringSections) {
      lines.push(`• ${section.categoryName}: ${section.lines.map((l) => `${l.name}${l.quantity > 1 ? ` x${l.quantity}` : ''}`).join(', ')}`);
    }
  }

  if (details.requestedExtras.length > 0) {
    lines.push('');
    lines.push('\u{23F3} PENDING APPROVAL REQUESTS'); // ⏳
    for (const item of details.requestedExtras) {
      lines.push(`• ${item.name}`);
    }
  }

  lines.push('');
  lines.push(divider);
  lines.push('\u{1F4B0} ESTIMATED TOTAL'); // 💰
  lines.push(`₹${details.estimatedTotal.toLocaleString('en-IN')} (confirmed after enquiry)`);
  lines.push(divider);

  lines.push('');
  lines.push(`Reference Code: #${refCode}`);
  lines.push(`Submitted: ${formatDateTime(submittedAtIso)}`);
  lines.push('');
  lines.push('Please contact the customer to confirm availability and finalize the booking.');

  return lines.join('\n');
}
