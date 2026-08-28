import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const refCode = (formData.get('refCode') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    const admin = getSupabaseAdminClient();
    const randomSuffix = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
    const objectPath = `${refCode || 'quotes'}/${randomSuffix}.pdf`;

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await admin.storage.from('enquiry-pdfs').upload(objectPath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    });

    if (uploadError) {
      if (uploadError.message?.toLowerCase().includes('not found') || (uploadError as any).statusCode === 404) {
        await admin.storage.createBucket('enquiry-pdfs', { public: true });
        const { error: retryError } = await admin.storage.from('enquiry-pdfs').upload(objectPath, fileBuffer, {
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

    const { data: publicData } = admin.storage.from('enquiry-pdfs').getPublicUrl(objectPath);
    let pdfUrl = publicData?.publicUrl || null;

    if (!pdfUrl) {
      const { data: signedData } = await admin.storage.from('enquiry-pdfs').createSignedUrl(objectPath, 60 * 60 * 24 * 365);
      pdfUrl = signedData?.signedUrl || null;
    }

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
