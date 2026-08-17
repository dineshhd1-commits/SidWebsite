/** Corporate Decoration is enquiry-only (never added to the normal cart), so
 * it needs its own small notification payload/formatter - separate from
 * EnquiryDetails/formatEnquiryMessage (lib/builder/enquiry.ts) which is
 * built from `state.cart` and doesn't have fields like Company Name or
 * Corporate Event Type. Everything else about how this reaches the owner
 * (WhatsApp deep link + Supabase `quotations` row for the admin CRM) reuses
 * that same existing architecture - see lib/store/admin-store.ts
 * saveCorporateDecorationEnquiry(). */
export interface CorporateDecorationEnquiryDetails {
  customerName: string;
  phone: string;
  email: string;
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
 * unmistakably a corporate decoration lead and not a full event enquiry. */
export function formatCorporateDecorationEnquiryMessage(
  details: CorporateDecorationEnquiryDetails,
  refCode: string,
  submittedAtIso: string
): string {
  const divider = '━━━━━━━━━━━━━━━━━━━━';

  const lines: string[] = [];
  lines.push(divider);
  lines.push('\u{1F3E2} NEW CORPORATE DECORATION ENQUIRY'); // 🏢
  lines.push('SID EVENTS');
  lines.push(divider);
  lines.push('');
  lines.push('\u{1F464} CUSTOMER DETAILS'); // 👤
  lines.push(`Name: ${details.customerName || 'Not provided'}`);
  lines.push(`Phone: ${details.phone || 'Not provided'}`);
  lines.push(`Email: ${details.email || 'Not provided'}`);
  lines.push(`Company: ${details.companyName || 'Not provided'}`);
  lines.push('');
  lines.push('\u{1F4C5} EVENT DETAILS'); // 📅
  lines.push(`Corporate Event Type: ${details.corporateEventType || 'Not specified'}`);
  lines.push(`Date: ${formatDate(details.eventDate)}`);
  lines.push(`Location: ${details.location || 'Not provided'}`);
  if (details.guestCount) {
    lines.push(`Guests: ${details.guestCount}`);
  }
  lines.push('');
  lines.push(divider);
  lines.push('\u{1F380} SELECTED DECORATION / SERVICES'); // 🎀
  lines.push(divider);
  for (const option of details.selectedOptions) {
    lines.push(`• ${option}`);
  }
  if (details.message) {
    lines.push('');
    lines.push('\u{1F4DD} ADDITIONAL REQUIREMENTS'); // 📝
    lines.push(details.message);
  }

  lines.push('');
  lines.push(divider);
  lines.push(`Reference Code: #${refCode}`);
  lines.push(`Submitted: ${formatDateTime(submittedAtIso)}`);
  lines.push('');
  lines.push('This is a corporate decoration enquiry only - please contact the customer to discuss requirements and pricing.');

  return lines.join('\n');
}
