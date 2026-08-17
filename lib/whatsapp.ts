import { EventBuilderState } from './types/event-builder';
import { getCartLines, getRequestedExtraLines } from './builder/selectors';
import { BookingFormOverrides, buildEnquiryDetails, formatEnquiryMessage, mergeBookingFormIntoState } from './builder/enquiry';
import { CorporateDecorationEnquiryDetails, formatCorporateDecorationEnquiryMessage } from './builder/corporate-decoration-enquiry';

const CATEGORY_LABELS: Record<string, string> = {
  decoration: 'Decoration',
  photography: 'Photography & Videography',
  catering: 'Catering',
  venue: 'Venue',
  additional_services: 'Additional Services',
};

const CATERING_TIMING_LABELS: Record<string, string> = {
  morning: 'Morning (Breakfast menu)',
  afternoon: 'Afternoon (Lunch menu)',
  evening: 'Evening (Dinner menu)',
};

function buildSelectionsBlock(state: EventBuilderState): string {
  const lines = getCartLines(state).filter((l) => l.origin !== 'requested_extra');
  if (lines.length === 0) return 'No selections yet.';

  const byCategory = new Map<string, string[]>();
  for (const line of lines) {
    const label = CATEGORY_LABELS[line.categoryKey] || line.categoryKey;
    const entry = `${line.name}${line.quantity > 1 ? ` x${line.quantity}` : ''}`;
    byCategory.set(label, [...(byCategory.get(label) || []), entry]);
  }

  return Array.from(byCategory.entries())
    .map(([label, items]) => `*${label}:* ${items.join(', ')}`)
    .join('\n');
}

function buildCateringMenuBlock(state: EventBuilderState): string {
  const selections = Object.values(state.cateringSelections);
  if (selections.length === 0) return '';

  const byCategory = new Map<string, string[]>();
  for (const line of selections) {
    const entry = `${line.itemName}${line.quantity > 1 ? ` x${line.quantity}` : ''}`;
    byCategory.set(line.categoryName, [...(byCategory.get(line.categoryName) || []), entry]);
  }

  const cateringGuests = state.cateringTiming ? state.cateringGuestCounts[state.cateringTiming] : undefined;
  const timingLine = state.cateringTiming
    ? `*Catering Timing:* ${CATERING_TIMING_LABELS[state.cateringTiming]}${cateringGuests ? ` (${cateringGuests} guests)` : ''}\n`
    : '';
  const menuLines = Array.from(byCategory.entries())
    .map(([label, items]) => `*${label}:* ${items.join(', ')}`)
    .join('\n');

  return `\n--- *Catering Menu* ---\n${timingLine}${menuLines}\n`;
}

export function getWhatsAppShareUrl(quoteId: string, state: EventBuilderState, phone: string = '918095408404'): string {
  const requestedExtras = getRequestedExtraLines(state);
  const message = `
Namaste! I built a Custom Event Package on *SID Events*.

*Quote Reference:* #${quoteId}
*Guest Count:* ${state.eventDetails.guestCount} Guests
${buildSelectionsBlock(state)}
${buildCateringMenuBlock(state)}${requestedExtras.length > 0 ? `\n*Pending Approval Requests:* ${requestedExtras.map((l) => l.name).join(', ')}` : ''}

I would like to receive a detailed quote for this package and check date availability. Please guide me with the next steps!
  `.trim();

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * The real owner-facing notification for a final event enquiry submission.
 * Builds the complete, dynamic breakdown (every category currently in the
 * cart, plus the catering menu) via buildEnquiryDetails/formatEnquiryMessage
 * so nothing selected is ever left out, then opens it as a pre-filled
 * WhatsApp message to the configured owner number - the customer's own
 * WhatsApp app sends it, which is the existing notification channel this
 * project already relies on (see SITE.whatsappNumber).
 */
export function getWhatsAppBookingRequestUrl(
  formData: BookingFormOverrides,
  state: EventBuilderState,
  refCode: string,
  phone: string = '918095408404'
): string {
  const mergedState = mergeBookingFormIntoState(state, formData);
  const details = buildEnquiryDetails(mergedState);
  const message = formatEnquiryMessage(details, refCode, new Date().toISOString());

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Same delivery mechanism as getWhatsAppBookingRequestUrl - a pre-filled
 * wa.me deep link to the configured owner number, opened by the customer's
 * own WhatsApp app - just carrying the Corporate Decoration enquiry payload
 * instead of the full cart-based one. */
export function getCorporateDecorationEnquiryWhatsAppUrl(
  details: CorporateDecorationEnquiryDetails,
  refCode: string,
  phone: string = '918095408404'
): string {
  const message = formatCorporateDecorationEnquiryMessage(details, refCode, new Date().toISOString());
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
