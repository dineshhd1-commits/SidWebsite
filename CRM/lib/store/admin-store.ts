import { supabase, isSupabaseConfigured } from '../supabase';
import { MOCK_SERVICES, MOCK_STANDARD_PACKAGES } from '../mock-data';
import { Service, StandardPackage } from '../types/wedding';
import { EnquiryDetails } from '../builder/enquiry';
import { CorporateDecorationEnquiryDetails } from '../builder/corporate-decoration-enquiry';

export type AdminQuoteStatus = 'New' | 'Contacted' | 'Quoted' | 'Confirmed' | 'Cancelled';

export interface AdminQuoteRequest {
  id: string;
  refCode: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  weddingDate: string;
  venueCity: string;
  venueAddress: string;
  guestCount: number;
  cateringTier: string;
  photographyTier: string;
  purohitTier: string;
  selectedServicesCount: number;
  estimatedCost: number;
  notes?: string;
  /** Complete, category-by-category breakdown of everything the customer
   * selected in the builder - the source of truth for "view full details"
   * in the admin CRM. Optional only because older localStorage-only quote
   * records (created before this existed) won't have it. */
  fullDetails?: EnquiryDetails;
  /** Signed/secure URL to this enquiry's generated PDF, when the upload to
   * storage succeeded. Optional - older records and offline/dev submissions
   * won't have one, and the admin CRM should just hide the "View PDF" link
   * in that case rather than breaking. */
  pdfUrl?: string | null;
  status: AdminQuoteStatus;
  createdAt: string;
}

export interface AdminInquiry {
  id: string;
  fullName: string;
  phone: string;
  weddingDate: string;
  notes?: string;
  status: 'New' | 'In Progress' | 'Completed';
  createdAt: string;
}

const STORAGE_KEY_QUOTES = 'sid_events_admin_quotes_v1';
const STORAGE_KEY_INQUIRIES = 'sid_events_admin_inquiries_v1';
const STORAGE_KEY_SERVICES = 'sid_events_admin_services_v1';
const STORAGE_KEY_PACKAGES = 'sid_events_admin_packages_v1';

const INITIAL_QUOTES: AdminQuoteRequest[] = [
  {
    id: 'quote-101',
    refCode: 'BK-8492',
    customerName: 'Aditya & Soundarya',
    customerPhone: '+91 98452 12345',
    customerEmail: 'aditya.h@gmail.com',
    weddingDate: '2026-11-18',
    venueCity: 'Davanagere',
    venueAddress: 'Kamana Bhavana, PJ Extension',
    guestCount: 800,
    cateringTier: 'gold',
    photographyTier: 'gold',
    purohitTier: 'traditional_complete',
    selectedServicesCount: 8,
    estimatedCost: 385000,
    notes: 'Need special banana leaf arrangement and live Dosa counter.',
    status: 'New',
    createdAt: '2026-07-28T10:15:00Z',
  },
  {
    id: 'quote-102',
    refCode: 'BK-7319',
    customerName: 'Karthik & Ananya',
    customerPhone: '+91 97411 98765',
    customerEmail: 'karthik.a@yahoo.com',
    weddingDate: '2026-12-05',
    venueCity: 'Chitradurga',
    venueAddress: 'Sri Kanyaka Parameshwari Hall',
    guestCount: 500,
    cateringTier: 'silver',
    photographyTier: 'silver',
    purohitTier: 'standard',
    selectedServicesCount: 5,
    estimatedCost: 245000,
    notes: 'Require Chenda Melam troupe for bride entrance.',
    status: 'Contacted',
    createdAt: '2026-07-27T14:30:00Z',
  },
];

const INITIAL_INQUIRIES: AdminInquiry[] = [
  {
    id: 'inq-1',
    fullName: 'Meghana & Varun',
    phone: '+91 80954 11223',
    weddingDate: '2026-10-24',
    notes: 'Inquiring for traditional Engagement Ceremony decor in Davanagere.',
    status: 'New',
    createdAt: '2026-07-28T08:20:00Z',
  },
];

// --- 1. Quote Requests CRUD ---

/** Local-only cache (this browser's localStorage) - used as an offline/dev
 * fallback when Supabase isn't configured, and as an instant optimistic
 * mirror of whatever this browser has submitted. Not the source of truth
 * for the admin dashboard once Supabase is configured - see
 * getAdminQuotesFromBackend below, which is what actually needs to show
 * every customer's submission regardless of which device they used. */
export function getAdminQuotes(): AdminQuoteRequest[] {
  if (typeof window === 'undefined') return INITIAL_QUOTES;
  const data = localStorage.getItem(STORAGE_KEY_QUOTES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(INITIAL_QUOTES));
    return INITIAL_QUOTES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_QUOTES;
  }
}

function mapSupabaseQuoteRow(row: any): AdminQuoteRequest {
  const builderState = row.builder_state || {};
  return {
    id: row.id,
    refCode: row.id,
    customerName: row.customer_name || '',
    customerPhone: row.customer_phone || '',
    customerEmail: row.customer_email || '',
    weddingDate: row.wedding_date || '',
    venueCity: row.venue_city || '',
    venueAddress: builderState.venueAddress || '',
    guestCount: builderState.guestCount ?? builderState.fullDetails?.guestCount ?? 0,
    cateringTier: builderState.cateringTier || 'custom',
    photographyTier: builderState.photographyTier || 'custom',
    purohitTier: builderState.purohitTier || 'custom',
    selectedServicesCount: builderState.selectedServicesCount ?? builderState.fullDetails?.totalSelectionsCount ?? 0,
    estimatedCost: row.price_breakdown?.estimatedCost ?? 0,
    notes: builderState.notes || '',
    fullDetails: builderState.fullDetails,
    pdfUrl: builderState.pdfUrl || null,
    status: (row.status as AdminQuoteStatus) || 'New',
    createdAt: row.created_at,
  };
}

/** The real source of truth for the admin CRM: every enquiry submitted by
 * any customer, from any device, read straight from Supabase. Falls back to
 * the local browser cache only when Supabase isn't configured (matching the
 * fallback pattern used everywhere else in this codebase) or the request
 * fails, so the dashboard never just shows a blank screen. */
export async function getAdminQuotesFromBackend(): Promise<AdminQuoteRequest[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const res = await fetch('/api/admin/quotes', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Not authenticated as admin.');
    }
    if (!res.ok) throw new Error(`Failed to load quotes: ${res.status}`);
    const { items } = await res.json();
    return (items || []).map(mapSupabaseQuoteRow);
  } catch (e) {
    console.error('Failed to load quotes from backend, falling back to local cache:', e);
    return getAdminQuotes();
  }
}

/** Saves a newly-submitted enquiry. Always writes an optimistic local copy
 * immediately; when Supabase is configured, awaits the real insert so the
 * caller can confirm the owner's CRM actually received it before telling
 * the customer their request went through. */
export async function saveAdminQuote(
  quote: Omit<AdminQuoteRequest, 'id' | 'createdAt' | 'status'>
): Promise<{ record: AdminQuoteRequest; savedToBackend: boolean }> {
  const newRecord: AdminQuoteRequest = {
    ...quote,
    id: `quote-${Date.now()}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    const current = getAdminQuotes();
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify([newRecord, ...current]));
  }

  let savedToBackend = false;
  if (isSupabaseConfigured()) {
    const { error } = await supabase.from('quotations').insert([
      {
        id: newRecord.refCode,
        customer_name: newRecord.customerName,
        customer_email: newRecord.customerEmail,
        customer_phone: newRecord.customerPhone,
        wedding_date: newRecord.weddingDate || null,
        venue_city: newRecord.venueCity,
        builder_state: {
          venueAddress: newRecord.venueAddress,
          guestCount: newRecord.guestCount,
          notes: newRecord.notes || '',
          cateringTier: newRecord.cateringTier,
          photographyTier: newRecord.photographyTier,
          purohitTier: newRecord.purohitTier,
          selectedServicesCount: newRecord.selectedServicesCount,
          fullDetails: newRecord.fullDetails,
          pdfUrl: newRecord.pdfUrl || null,
        },
        price_breakdown: { estimatedCost: newRecord.estimatedCost },
        status: newRecord.status,
      },
    ]);
    if (error) {
      console.error('Supabase quote sync error:', error);
    } else {
      savedToBackend = true;
    }
  }

  return { record: newRecord, savedToBackend };
}

/** Decoration-as-enquiry-only submissions (Corporate Event, Get Together,
 * Bachelor Party, Birthday, Other Events) are enquiry-only - never touch
 * state.cart - so they don't go through buildEnquiryDetails/
 * mergeBookingFormIntoState. This builds an equivalent EnquiryDetails shape
 * directly from the form so the same admin CRM record structure (and "view
 * full details" in the admin dashboard) still works, and stores the
 * company/corporate-event-type fields (which only apply to Corporate Event,
 * and which EnquiryDetails has no dedicated slot for) in `notes` so nothing
 * is lost. Reuses saveAdminQuote - same Supabase `quotations` table, same
 * localStorage fallback, same everything. */
export async function saveCorporateDecorationEnquiry(
  details: CorporateDecorationEnquiryDetails,
  refCode: string
): Promise<{ savedToBackend: boolean }> {
  const isCorporate = details.eventTypeId === 'corporate_event';

  const fullDetails: EnquiryDetails = {
    eventTypeId: details.eventTypeId,
    eventTypeLabel: details.eventTypeLabel,
    customerName: details.customerName,
    customerPhone: details.phone,
    customerEmail: details.email,
    eventDate: details.eventDate,
    location: details.location,
    guestCount: Number(details.guestCount) || 0,
    specialRequirements: details.message,
    sections:
      details.selectedOptions.length > 0
        ? [
            {
              categoryKey: 'decoration',
              label: 'Decoration (Enquiry Only - Not Added to Cart)',
              icon: '\u{1F380}',
              lines: details.selectedOptions.map((name) => ({ name, quantity: 1 })),
            },
          ]
        : [],
    cateringMenus: [],
    requestedExtras: [],
    estimatedTotal: 0,
    totalSelectionsCount: details.selectedOptions.length,
  };

  const notes = [
    isCorporate ? '[CORPORATE DECORATION ENQUIRY]' : `[DECORATION ENQUIRY - ${details.eventTypeLabel.toUpperCase()}]`,
    isCorporate ? `Company: ${details.companyName || 'Not provided'}` : '',
    isCorporate ? `Corporate Event Type: ${details.corporateEventType || 'Not specified'}` : '',
    details.selectedOptions.length > 0 ? `Selected Decoration Options: ${details.selectedOptions.join(', ')}` : '',
    details.message ? `\nDecoration Requirements: ${details.message}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const { savedToBackend } = await saveAdminQuote({
    refCode,
    customerName: details.customerName,
    customerPhone: details.phone,
    customerEmail: details.email,
    weddingDate: details.eventDate,
    venueCity: details.location,
    venueAddress: '',
    guestCount: Number(details.guestCount) || 0,
    cateringTier: 'custom',
    photographyTier: 'Corporate Event',
    purohitTier: 'corporate-decoration-enquiry',
    selectedServicesCount: details.selectedOptions.length,
    estimatedCost: 0,
    notes,
    fullDetails,
  });

  return { savedToBackend };
}

/** Uploads a generated Event Enquiry PDF to Supabase Storage under a
 * cryptographically-random object key (never the reference code alone,
 * which is guessable/sequential) so the resulting URL can't be enumerated,
 * and returns a signed URL scoped to a private bucket rather than a public
 * one - satisfies "don't expose customer PDFs via a publicly guessable
 * URL" without needing any new backend infrastructure. Returns null on any
 * failure (offline dev sandbox, bucket not yet provisioned, network error)
 * so the caller can fall back to the existing full-text WhatsApp message -
 * this must never throw and block the actual enquiry submission. */
export async function uploadEnquiryPdf(pdfBlob: Blob, refCode: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const objectPath = `${refCode}/${randomSuffix}.pdf`;

    const { error: uploadError } = await supabase.storage.from('enquiry-pdfs').upload(objectPath, pdfBlob, {
      contentType: 'application/pdf',
      upsert: false,
    });
    if (uploadError) {
      console.error('Supabase PDF upload error:', uploadError);
      return null;
    }

    // 7-day signed URL on a private bucket - long enough for the owner to
    // action the enquiry, without making the file permanently public.
    const { data, error: signError } = await supabase.storage.from('enquiry-pdfs').createSignedUrl(objectPath, 60 * 60 * 24 * 7);
    if (signError || !data?.signedUrl) {
      console.error('Supabase PDF signed URL error:', signError);
      return null;
    }
    return data.signedUrl;
  } catch (e) {
    console.error('Failed to upload enquiry PDF:', e);
    return null;
  }
}

// All three mutations below go through the authenticated /api/admin/quotes
// endpoint (admin session + service-role key) instead of an anon-key
// Supabase call, for the same reason as getAdminQuotesFromBackend above -
// an anonymous visitor must never be able to edit, re-status, or delete
// another customer's enquiry record just by having the public anon key.

export function updateAdminQuote(updatedQuote: AdminQuoteRequest): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  fetch('/api/admin/quotes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refCode: updatedQuote.refCode,
      customerName: updatedQuote.customerName,
      customerEmail: updatedQuote.customerEmail,
      customerPhone: updatedQuote.customerPhone,
      status: updatedQuote.status,
    }),
  }).then((res) => {
    if (!res.ok) console.error('Admin quote update failed:', res.status);
  });
  return updated;
}

export function updateQuoteStatus(id: string, refCode: string, status: AdminQuoteStatus): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.map((q) => (q.id === id ? { ...q, status } : q));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  fetch('/api/admin/quotes', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refCode, status }),
  }).then((res) => {
    if (!res.ok) console.error('Admin quote status update failed:', res.status);
  });
  return updated;
}

export function deleteAdminQuote(id: string, refCode: string): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.filter((q) => q.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  fetch(`/api/admin/quotes?refCode=${encodeURIComponent(refCode)}`, { method: 'DELETE' }).then((res) => {
    if (!res.ok) console.error('Admin quote delete failed:', res.status);
  });
  return updated;
}

// --- 2. Inquiries CRUD ---
export function getAdminInquiries(): AdminInquiry[] {
  if (typeof window === 'undefined') return INITIAL_INQUIRIES;
  const data = localStorage.getItem(STORAGE_KEY_INQUIRIES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(INITIAL_INQUIRIES));
    return INITIAL_INQUIRIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_INQUIRIES;
  }
}

export function saveAdminInquiry(inquiry: Omit<AdminInquiry, 'id' | 'createdAt' | 'status'>): AdminInquiry {
  const current = getAdminInquiries();
  const newRecord: AdminInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    status: 'New',
    createdAt: new Date().toISOString(),
  };
  const updated = [newRecord, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  }

  // Routed through /api/contact (validated + rate-limited server-side) rather
  // than an anon-key insert straight from the browser - same reasoning as
  // the enquiry submission flow: an unauthenticated write endpoint should
  // still validate its input and not be trivially spammable.
  fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: newRecord.fullName,
      phone: newRecord.phone,
      weddingDate: newRecord.weddingDate || '',
      notes: newRecord.notes || '',
    }),
  }).catch((e) => console.error('Contact inquiry sync error:', e));

  return newRecord;
}

export function updateInquiryStatus(id: string, status: AdminInquiry['status']): AdminInquiry[] {
  const current = getAdminInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, status } : inq));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  }
  return updated;
}

export function deleteAdminInquiry(id: string): AdminInquiry[] {
  const current = getAdminInquiries();
  const updated = current.filter((inq) => inq.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_INQUIRIES, JSON.stringify(updated));
  }
  return updated;
}

// --- 3. Services Catalog CRUD ---
export function getAdminServices(): Service[] {
  if (typeof window === 'undefined') return MOCK_SERVICES;
  const data = localStorage.getItem(STORAGE_KEY_SERVICES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(MOCK_SERVICES));
    return MOCK_SERVICES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return MOCK_SERVICES;
  }
}

export function saveAdminService(newService: Omit<Service, 'id'>): Service[] {
  const current = getAdminServices();
  const created: Service = { ...newService, id: `svc-${Date.now()}` };
  const updated = [created, ...current];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  }
  return updated;
}

export function updateAdminService(service: Service): Service[] {
  const current = getAdminServices();
  const updated = current.map((s) => (s.id === service.id ? service : s));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  }
  return updated;
}

export function deleteAdminService(id: string): Service[] {
  const current = getAdminServices();
  const updated = current.filter((s) => s.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(updated));
  }
  return updated;
}

// --- 4. Wedding Packages CRUD ---
export function getAdminPackages(): StandardPackage[] {
  if (typeof window === 'undefined') return MOCK_STANDARD_PACKAGES;
  const data = localStorage.getItem(STORAGE_KEY_PACKAGES);
  if (!data) {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(MOCK_STANDARD_PACKAGES));
    return MOCK_STANDARD_PACKAGES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return MOCK_STANDARD_PACKAGES;
  }
}

export function saveAdminPackage(newPkg: Omit<StandardPackage, 'id'>): StandardPackage[] {
  const current = getAdminPackages();
  const created: StandardPackage = { ...newPkg, id: `pkg-${Date.now()}` };
  const updated = [...current, created];
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(updated));
  }
  return updated;
}

export function updateAdminPackage(pkg: StandardPackage): StandardPackage[] {
  const current = getAdminPackages();
  const updated = current.map((p) => (p.id === pkg.id ? pkg : p));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(updated));
  }
  return updated;
}

export function deleteAdminPackage(id: string): StandardPackage[] {
  const current = getAdminPackages();
  const updated = current.filter((p) => p.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_PACKAGES, JSON.stringify(updated));
  }
  return updated;
}
