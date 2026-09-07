import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { checkRateLimitAsync, getClientIp } from '@/lib/rate-limit';
import { cacheDel } from '@/lib/redis';
import { EnquiryDetails } from '@/lib/builder/enquiry';

/**
 * Server-side landing point for a submitted event enquiry.
 * Integrates Redis rate limiting and invalidates CRM quotes cache on insert/update.
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
  estimatedCost: z.number().min(0).max(100_000_000).optional().default(0),
  notes: z.string().trim().regex(/^[a-zA-Z0-9\s.,'"!?()\-:;&]*$/, 'Special requirements contains unsupported characters.').max(2000).optional().default(''),
  fullDetails: z.record(z.any()).optional(),
});

function generateRefCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let suffix = '';
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  for (const b of bytes) suffix += chars[b % chars.length];
  return `BK-${suffix}`;
}

export async function POST(request: NextRequest) {
  // 20 submissions per IP per 10 minutes - generous for a genuine customer
  if (!(await checkRateLimitAsync(`enquiry:${getClientIp(request)}`, 20, 10 * 60 * 1000))) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json({ error: firstIssue?.message || 'Invalid enquiry data.' }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot check
  if (typeof body === 'object' && body && typeof body.companyWebsite === 'string' && body.companyWebsite.trim() !== '') {
    return NextResponse.json({ refCode: generateRefCode(), savedToBackend: true });
  }

  const refCode = generateRefCode();

  try {
    const admin = getSupabaseAdminClient();
    const submittedAtIso = new Date().toISOString();

    // Generate and store the compressed PDF directly in the CRM's Supabase Storage
    let pdfUrl: string | null = null;
    try {
      const { generateEnquiryPdfBuffer } = await import('@/lib/builder/enquiry-pdf');
      const fullDetails: EnquiryDetails = (data.fullDetails as unknown as EnquiryDetails) || {
        eventTypeId: 'custom',
        eventTypeLabel: data.photographyTier || 'Custom Event',
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        eventDate: data.weddingDate,
        location: data.venueCity,
        guestCount: data.guestCount,
        specialRequirements: data.notes,
        sections: [],
        cateringMenus: [],
        requestedExtras: [],
        estimatedTotal: data.estimatedCost,
        totalSelectionsCount: data.selectedServicesCount,
      };

      const pdfBuffer = await generateEnquiryPdfBuffer(fullDetails, refCode, submittedAtIso);
      const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
      const objectPath = `${refCode}/${randomSuffix}.pdf`;

      const { error: uploadError } = await admin.storage.from('enquiry-pdfs').upload(objectPath, pdfBuffer, {
        contentType: 'application/pdf',
        cacheControl: '31536000',
        upsert: true,
      });

      if (!uploadError) {
        const { data: signData } = await admin.storage
          .from('enquiry-pdfs')
          .createSignedUrl(objectPath, 60 * 60 * 24 * 365);
        if (signData?.signedUrl) {
          pdfUrl = signData.signedUrl;
        }
      } else if (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === 404) {
        await admin.storage.createBucket('enquiry-pdfs', { public: false });
        const { error: retryError } = await admin.storage.from('enquiry-pdfs').upload(objectPath, pdfBuffer, {
          contentType: 'application/pdf',
          cacheControl: '31536000',
          upsert: true,
        });
        if (!retryError) {
          const { data: signData } = await admin.storage
            .from('enquiry-pdfs')
            .createSignedUrl(objectPath, 60 * 60 * 24 * 365);
          if (signData?.signedUrl) {
            pdfUrl = signData.signedUrl;
          }
        }
      }
    } catch (pdfErr) {
      console.warn('Server-side PDF generation/upload error:', pdfErr);
    }

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
          pdfUrl,
        },
        price_breakdown: { estimatedCost: data.estimatedCost },
        status: 'New',
      },
    ]);
    if (error) {
      console.error('Enquiry insert failed:', error.message);
      return NextResponse.json({ refCode, savedToBackend: false, pdfUrl });
    }

    // Invalidate CRM cache in Redis so quotes update immediately
    await cacheDel('admin:quotes:list').catch(() => {});

    return NextResponse.json({ refCode, savedToBackend: true, pdfUrl });
  } catch (e) {
    console.error('Enquiry submission error:', e);
    return NextResponse.json({ refCode, savedToBackend: false });
  }
}

const patchSchema = z.object({
  refCode: z.string().trim().min(1).max(60),
  pdfUrl: z.string().trim().url().max(2000),
});

/** Attaches the generated PDF's URL to an enquiry right after upload */
export async function PATCH(request: NextRequest) {
  if (!(await checkRateLimitAsync(`enquiry-patch:${getClientIp(request)}`, 20, 10 * 60 * 1000))) {
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

    // Invalidate CRM cache in Redis
    await cacheDel('admin:quotes:list').catch(() => {});

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Enquiry PDF attach error:', e);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

