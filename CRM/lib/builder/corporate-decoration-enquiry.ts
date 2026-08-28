/** Decoration-as-enquiry-only event types (never added to the normal cart)
 * need their own small notification payload/formatter - separate from
 * EnquiryDetails/formatEnquiryMessage (lib/builder/enquiry.ts) which is
 * built from `state.cart` and doesn't have fields like Company Name or
 * Corporate Event Type. Everything else about how this reaches the owner
 * (WhatsApp deep link + Supabase `quotations` row for the admin CRM) reuses
 * that same existing architecture - see lib/store/admin-store.ts
 * saveCorporateDecorationEnquiry(). Started as Corporate-only, now shared by
 * Get Together, Bachelor Party, Birthday and Other Events too - the
 * Company Name / Corporate Event Type fields only apply (and only render)
 * for Corporate Event itself; every other event type submits a simpler
 * enquiry without them. */
export interface CorporateDecorationEnquiryDetails {
  eventTypeId: string;
  eventTypeLabel: string;
  customerName: string;
  phone: string;
  email: string;
  /** Only meaningful (and only ever populated) when eventTypeId is 'corporate_event'. */
  companyName: string;
  corporateEventType: string;
  eventDate: string;
  location: string;
  guestCount: string;
  message: string;
  /** Names of the decoration options the customer checked (e.g. "Stage
   * Decoration", "Garlands") - never catalog items, never added to cart. */
  selectedOptions: string[];
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Not set';
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

/** Plain-text notification body, opened as a pre-filled WhatsApp message to
 * the configured owner number (SITE.whatsappNumber) - same delivery
 * mechanism as the main event enquiry, just a distinct banner/shape so it's
 * unmistakably a decoration-only lead and not a full event enquiry. Corporate
 * Event keeps its own dedicated banner and Company/Corporate Event Type
 * lines; every other enquiry-only event type gets a generic banner with its
 * event type named instead. */
export function formatCorporateDecorationEnquiryMessage(
  details: CorporateDecorationEnquiryDetails,
  refCode: string,
  submittedAtIso: string
): string {
  const divider = '━━━━━━━━━━━━━━━━━━━━';
  const isCorporate = details.eventTypeId === 'corporate_event';

  const lines: string[] = [];
  lines.push(divider);
  lines.push(isCorporate ? '\u{1F3E2} NEW CORPORATE DECORATION ENQUIRY' : '\u{1F380} NEW DECORATION ENQUIRY'); // 🏢 / 🎀
  lines.push('SID EVENTS');
  lines.push(divider);
  lines.push('');
  lines.push('\u{1F464} CUSTOMER DETAILS'); // 👤
  lines.push(`Name: ${details.customerName || 'Not provided'}`);
  lines.push(`Phone: ${details.phone || 'Not provided'}`);
  lines.push(`Email: ${details.email || 'Not provided'}`);
  if (isCorporate) {
    lines.push(`Company: ${details.companyName || 'Not provided'}`);
  }
  lines.push('');
  lines.push('\u{1F4C5} EVENT DETAILS'); // 📅
  lines.push(`Event Type: ${details.eventTypeLabel}`);
  if (isCorporate) {
    lines.push(`Corporate Event Type: ${details.corporateEventType || 'Not specified'}`);
  }
  lines.push(`Date: ${formatDate(details.eventDate)}`);
  lines.push(`Location: ${details.location || 'Not provided'}`);
  if (details.guestCount) {
    lines.push(`Guests: ${details.guestCount}`);
  }
  if (details.selectedOptions.length > 0) {
    lines.push('');
    lines.push(divider);
    lines.push('\u{1F380} SELECTED DECORATION / SERVICES'); // 🎀
    lines.push(divider);
    for (const option of details.selectedOptions) {
      lines.push(`• ${option}`);
    }
  }
  lines.push('');
  lines.push('\u{1F4DD} DECORATION REQUIREMENTS'); // 📝
  lines.push(details.message || 'Not specified - please contact the customer to discuss.');

  lines.push('');
  lines.push(divider);
  lines.push(`Reference Code: #${refCode}`);
  lines.push(`Submitted: ${formatDateTime(submittedAtIso)}`);
  lines.push('');
  lines.push('This is a decoration enquiry only - please contact the customer to discuss requirements and pricing.');

  return lines.join('\n');
}
