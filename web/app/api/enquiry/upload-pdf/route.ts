import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB - generous for a generated quote PDF
const PDF_MAGIC_BYTES = Buffer.from('%PDF-');
const ENQUIRY_PDFS_BUCKET = 'enquiry-pdfs';
// 1 year - these are viewed occasionally from the admin CRM, not embedded
// publicly, so a long-lived signed URL is a reasonable tradeoff against
// re-signing on every read while still not being a permanently public link.
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  // Unauthenticated by necessity (called mid-booking by anonymous
  // customers), so it gets the same blunt rate limiting as /api/enquiry
  // instead of none at all.
  if (!checkRateLimit(`enquiry-pdf-upload:${getClientIp(request)}`, 20, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const rawRefCode = (formData.get('refCode') as string) || '';
    // Reference codes are always `BK-XXXXXX`/`CDE-XXXXXX`-shaped (see
    // generateRefCode in app/api/enquiry/route.ts) - strip anything else so
    // a crafted refCode can't inject "/" or ".." into the storage path.
    const refCode = rawRefCode.replace(/[^A-Za-z0-9-]/g, '').slice(0, 60);

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: 'File exceeds 10MB limit' }, { status: 400 });
    }
    if (file.type && file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are accepted' }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // Magic-byte check - a browser-supplied `file.type` is only a claim, not
    // a guarantee, so confirm the bytes actually start with the PDF header
    // before trusting/storing them as `application/pdf`.
    if (!fileBuffer.subarray(0, 5).equals(PDF_MAGIC_BYTES)) {
      return NextResponse.json({ error: 'File is not a valid PDF' }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    const objectPath = `${refCode || 'quotes'}/${randomSuffix}.pdf`;

    const { error: uploadError } = await admin.storage.from(ENQUIRY_PDFS_BUCKET).upload(objectPath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (uploadError) {
      if (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === 404) {
        // Private bucket: enquiry PDFs contain full customer PII (name,
        // phone, email, address, order breakdown), so this must never be
        // public: true - every read goes through a signed URL below instead.
        await admin.storage.createBucket(ENQUIRY_PDFS_BUCKET, { public: false });
        const { error: retryError } = await admin.storage.from(ENQUIRY_PDFS_BUCKET).upload(objectPath, fileBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        });
        if (retryError) {
          console.error('Retry PDF upload failed:', retryError);
          return NextResponse.json({ error: retryError.message }, { status: 500 });
        }
      } else {
        console.error('Service-role PDF upload error:', uploadError);
        return NextResponse.json({ error: uploadError.message }, { status: 500 });
      }
    }

    const { data: signedData, error: signError } = await admin.storage
      .from(ENQUIRY_PDFS_BUCKET)
      .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);
    if (signError || !signedData?.signedUrl) {
      console.error('Failed to sign enquiry PDF URL:', signError);
      return NextResponse.json({ error: 'Upload succeeded but failed to generate a link.' }, { status: 500 });
    }
    const pdfUrl = signedData.signedUrl;

    // Attach pdfUrl to quotation in database if refCode is provided
    if (pdfUrl && refCode) {
      const { data: existing } = await admin.from('quotations').select('builder_state').eq('id', refCode).single();
      if (existing) {
        await admin.from('quotations').update({
          builder_state: { ...(existing.builder_state || {}), pdfUrl },
        }).eq('id', refCode);
      }
    }

    return NextResponse.json({ success: true, pdfUrl });
  } catch (err: any) {
    console.error('API PDF upload failed:', err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
