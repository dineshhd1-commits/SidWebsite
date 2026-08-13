import { EventBuilderState } from './types/event-builder';
import { getCartLines, getRequestedExtraLines } from './builder/selectors';

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

export function getWhatsAppBookingRequestUrl(
  formData: {
    fullName: string;
    phone: string;
    email: string;
    weddingDate: string;
    venueCity: string;
    venueAddress: string;
    notes?: string;
  },
  state: EventBuilderState,
  refCode: string,
  phone: string = '918095408404'
): string {
  const requestedExtras = getRequestedExtraLines(state);
  const message = `
Namaste! New Custom Quote Request for *SID Events*.

*Reference Code:* #${refCode}
*Customer Name:* ${formData.fullName}
*Contact Phone:* ${formData.phone}
*Email Address:* ${formData.email}
*Event Date:* ${formData.weddingDate}
*Venue City:* ${formData.venueCity}
*Venue Address:* ${formData.venueAddress}
${formData.notes ? `*Special Notes:* ${formData.notes}\n` : ''}
--- *Package Selections Breakdown* ---
*Guest Capacity:* ${state.eventDetails.guestCount} Guests
${buildSelectionsBlock(state)}
${buildCateringMenuBlock(state)}${requestedExtras.length > 0 ? `\n*Pending Approval Requests:* ${requestedExtras.map((l) => l.name).join(', ')}` : ''}

Please send me the customized price quotation and confirm date availability!
  `.trim();

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
