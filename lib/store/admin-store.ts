import { supabase, isSupabaseConfigured } from '../supabase';
import { MOCK_SERVICES, MOCK_STANDARD_PACKAGES } from '../mock-data';
import { Service, StandardPackage } from '../types/wedding';
import { EnquiryDetails } from '../builder/enquiry';

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
  if (!isSupabaseConfigured()) return getAdminQuotes();
  try {
    const { data, error } = await supabase
      .from('quotations')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []).map(mapSupabaseQuoteRow);
  } catch (e) {
    console.error('Failed to load quotes from Supabase, falling back to local cache:', e);
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

export function updateAdminQuote(updatedQuote: AdminQuoteRequest): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.map((q) => (q.id === updatedQuote.id ? updatedQuote : q));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  if (isSupabaseConfigured()) {
    supabase
      .from('quotations')
      .update({
        customer_name: updatedQuote.customerName,
        customer_email: updatedQuote.customerEmail,
        customer_phone: updatedQuote.customerPhone,
        status: updatedQuote.status,
      })
      .eq('id', updatedQuote.refCode)
      .then(({ error }) => {
        if (error) console.error('Supabase quote update error:', error);
      });
  }
  return updated;
}

export function updateQuoteStatus(id: string, refCode: string, status: AdminQuoteStatus): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.map((q) => (q.id === id ? { ...q, status } : q));
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  if (isSupabaseConfigured()) {
    supabase
      .from('quotations')
      .update({ status })
      .eq('id', refCode)
      .then(({ error }) => {
        if (error) console.error('Supabase quote status update error:', error);
      });
  }
  return updated;
}

export function deleteAdminQuote(id: string, refCode: string): AdminQuoteRequest[] {
  const current = getAdminQuotes();
  const updated = current.filter((q) => q.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY_QUOTES, JSON.stringify(updated));
  }
  if (isSupabaseConfigured()) {
    supabase
      .from('quotations')
      .delete()
      .eq('id', refCode)
      .then(({ error }) => {
        if (error) console.error('Supabase quote delete error:', error);
      });
  }
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

  if (isSupabaseConfigured()) {
    supabase.from('inquiries').insert([
      {
        id: newRecord.id,
        full_name: newRecord.fullName,
        phone: newRecord.phone,
        wedding_date: newRecord.weddingDate || null,
        notes: newRecord.notes || '',
        status: newRecord.status,
      },
    ]).then(({ error }) => {
      if (error) console.error('Supabase inquiry sync error:', error);
    });
  }

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
