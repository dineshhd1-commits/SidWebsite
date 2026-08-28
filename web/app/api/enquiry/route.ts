import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

/**
 * Server-side landing point for a submitted event enquiry. Previously the
 * browser wrote straight into Supabase's `quotations` table with the public
 * anon key (see lib/store/admin-store.ts's old saveAdminQuote) - which meant
 * every "security" property of a submission (the guest-count cap, the
 * reference code, which fields even exist) was purely a frontend
 * convention that a direct API call could ignore entirely. This route is
 * the actual trust boundary: it validates every field server-side and
 * generates the reference code itself, then writes with the service-role
 * key - the browser never gets to assert either.
 */

const MAX_GUEST_COUNT = 5000;

const enquirySchema = z.object({
  customerName: z.string().trim().min(1).max(200),
  customerPhone: z.string().trim().regex(/^\d{10}$/, 'Phone number must be exactly 10 digits.'),
  customerEmail: z.string().trim().max(200).optional().default(''),
  weddingDate: z.string().trim().max(40).optional().default(''),
  venueCity: z.string().trim().max(120).optional().default(''),
  venueAddress: z.string().trim().max(300).optional().default(''),
  guestCount: z
    .number()
    .int()
    .min(0)
    .max(MAX_GUEST_COUNT, `Maximum guest capacity is ${MAX_GUEST_COUNT.toLocaleString('en-IN')}.`),
  cateringTier: z.string().trim().max(300).optional().default('custom'),
  photographyTier: z.string().trim().max(200).optional().default('custom'),
  purohitTier: z.string().trim().max(200).optional().default('custom'),
  selectedServicesCount: z.number().int().min(0).max(1000).optional().default(0),
  // Estimated total is display-only convenience data (this booking flow has
  // no payment/checkout step - final pricing is always manually confirmed
  // by the owner after enquiry, per the site's existing copy), so a
  // generous sanity ceiling rather than a server-recomputed value is
  // sufficient here; it is never treated as a binding price anywhere.
  estimatedCost: z.number().min(0).max(100_000_000).optional().default(0),
  notes: z.string().trim().regex(/^[a-zA-Z0-9\s.,'"!?()\-:;&]*$/, 'Special requirements contains unsupported characters.').max(2000).optional().default(''),
  // Free-form breakdown used for the PDF/owner view - validated for shape/size
  // only (not every nested field), capped so a malicious payload can't bloat
  // the database or the generated PDF.
  fullDetails: z.record(z.any()).optional(),
});

function generateRefCode(): string {
  // 6 random base36 characters (~2.1 billion combinations) instead of the
  // old client-generated 4-digit number (9,000 combinations) - reference
  // codes double as the lookup key for the enquiry PDF's storage path, so
  // low entropy there was effectively a guessable/enumerable PDF ID.
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) suffix += chars[b % chars.length];
  return `BK-${suffix}`;
}

export async function POST(request: NextRequest) {
  // 20 submissions per IP per 10 minutes - generous for a genuine customer
  // (who submits once), tight enough to blunt scripted spam.
  if (!checkRateLimit(`enquiry:${getClientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ error: firstIssue?.message || 'Invalid enquiry data.' }, { status: 400 });
  }
  const data = parsed.data;

  // Simple honeypot: a hidden form field named "companyWebsite" that real
  // customers never see or fill in - if it arrives non-empty, silently
  // report success without writing anything, which wastes a bot's time
  // without giving it a signal to adapt to.
  if (typeof body === 'object' && body && typeof body.companyWebsite === 'string' && body.companyWebsite.trim() !== '') {
    return NextResponse.json({ refCode: generateRefCode(), savedToBackend: true });
  }

  const refCode = generateRefCode();

  try {
    const admin = getSupabaseAdminClient();
    const { error } = await admin.from('quotations').insert([
      {
        id: refCode,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        wedding_date: data.weddingDate || null,
        venue_city: data.venueCity,
        builder_state: {
          venueAddress: data.venueAddress,
          guestCount: data.guestCount,
          notes: data.notes,
          cateringTier: data.cateringTier,
          photographyTier: data.photographyTier,
          purohitTier: data.purohitTier,
          selectedServicesCount: data.selectedServicesCount,
          fullDetails: data.fullDetails || null,
          pdfUrl: null,
        },
        price_breakdown: { estimatedCost: data.estimatedCost },
        status: 'New',
      },
    ]);
    if (error) {
      console.error('Enquiry insert failed:', error.message);
      return NextResponse.json({ refCode, savedToBackend: false });
    }
    return NextResponse.json({ refCode, savedToBackend: true });
  } catch (e) {
    console.error('Enquiry submission error:', e);
    // Never leak internal error details (DB host, stack trace, etc.) to the
    // client - a generic message plus the still-usable refCode so the
    // customer's WhatsApp fallback message can proceed regardless.
    return NextResponse.json({ refCode, savedToBackend: false });
  }
}

const patchSchema = z.object({
  refCode: z.string().trim().min(1).max(60),
  pdfUrl: z.string().trim().url().max(2000),
});

/** Attaches the generated PDF's URL to an enquiry right after upload - the
 * PDF has to be built client-side (see lib/builder/enquiry-pdf.tsx) after
 * the server-issued refCode comes back from POST above, so this is a
 * necessary second step rather than a single atomic write. */
export async function PATCH(request: NextRequest) {
  if (!checkRateLimit(`enquiry-patch:${getClientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });

  try {
    const admin = getSupabaseAdminClient();
    const { data: existing, error: fetchError } = await admin
      .from('quotations')
      .select('builder_state')
      .eq('id', parsed.data.refCode)
      .single();
    if (fetchError || !existing) {
      return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    }
    const { error } = await admin
      .from('quotations')
      .update({ builder_state: { ...(existing.builder_state || {}), pdfUrl: parsed.data.pdfUrl } })
      .eq('id', parsed.data.refCode);
    if (error) return NextResponse.json({ error: 'Failed to attach PDF.' }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Enquiry PDF attach error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
