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

  // Menu → Category, never a single Category list merging every meal - the
  // same category name (Welcome Drinks, Pickles, ...) can hold different
  // picks in different meals and must not collapse together here either.
  const MENU_ORDER = ['morning', 'afternoon', 'evening'] as const;
  const byMenu = new Map<string, Map<string, string[]>>();
  for (const line of selections) {
    if (!byMenu.has(line.menuType)) byMenu.set(line.menuType, new Map());
    const byCategory = byMenu.get(line.menuType)!;
    const entry = `${line.itemName}${line.quantity > 1 ? ` x${line.quantity}` : ''}`;
    byCategory.set(line.categoryName, [...(byCategory.get(line.categoryName) || []), entry]);
  }

  const menuBlocks = MENU_ORDER.filter((menuType) => byMenu.has(menuType))
    .map((menuType) => {
      const guests = state.cateringGuestCounts[menuType];
      const heading = `*${CATERING_TIMING_LABELS[menuType]}*${guests ? ` (${guests} guests)` : ''}`;
      const menuLines = Array.from(byMenu.get(menuType)!.entries())
        .map(([label, items]) => `*${label}:* ${items.join(', ')}`)
        .join('\n');
      return `${heading}\n${menuLines}`;
    })
    .join('\n\n');

  return `\n--- *Catering Menu* ---\n${menuBlocks}\n`;
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
  phone: string = '918095408404',
  pdfUrl?: string | null
): string {
  const mergedState = mergeBookingFormIntoState(state, formData);
  const details = buildEnquiryDetails(mergedState);
  const submittedAtIso = new Date().toISOString();
  // When the PDF made it to storage, send the short-form summary with a
  // link instead of the full plain-text dump - all the detail now lives in
  // the PDF itself. If the upload didn't happen (offline dev, storage
  // hiccup), fall back to the original full-text message so the owner is
  // never left with nothing.
  const message = pdfUrl
    ? formatShortEnquiryNotification(details, refCode, submittedAtIso, pdfUrl)
    : formatEnquiryMessage(details, refCode, submittedAtIso);

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/** Short-form owner notification used once the Event Enquiry PDF has been
 * generated and uploaded - all the detailed breakdown (decoration photos,
 * catering menu, etc.) lives in the PDF; this is just enough for the owner
 * to triage at a glance and open the link. */
function formatShortEnquiryNotification(
  details: ReturnType<typeof buildEnquiryDetails>,
  refCode: string,
  submittedAtIso: string,
  pdfUrl: string
): string {
  const lines: string[] = [];
  lines.push('\u{1F389} NEW EVENT ENQUIRY – SID EVENTS'); // 🎉 ... –
  lines.push('');
  lines.push(`Customer: ${details.customerName || 'Not provided'}`);
  lines.push(`Event: ${details.eventTypeLabel}`);
  lines.push(`Date: ${details.eventDate ? new Date(details.eventDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Not set'}`);
  lines.push(`Location: ${details.location || 'Not provided'}`);
  lines.push(`Guests: ${details.guestCount || 'Not specified'}`);
  lines.push(`Reference: #${refCode}`);
  lines.push('');
  lines.push('\u{1F4CE} Event Enquiry PDF'); // 📎
  lines.push(`View/Download: ${pdfUrl}`);
  lines.push('');
  lines.push('Please contact the customer to confirm availability and finalize the booking.');
  return lines.join('\n');
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
