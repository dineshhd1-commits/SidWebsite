import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { generateEnquiryPdfBlob } from '@/lib/builder/enquiry-pdf';
import { uploadEnquiryPdf } from '@/lib/store/admin-store';
import { cacheDel } from '@/lib/redis';

export async function POST(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const admin = getSupabaseAdminClient();
  const { data: quotes, error } = await admin
    .from('quotations')
    .select('id, customer_name, builder_state, created_at')
    .order('created_at', { ascending: false });

  if (error || !quotes) {
    return NextResponse.json({ error: 'Failed to fetch quotations' }, { status: 500 });
  }

  const results: Array<{ id: string; success: boolean; pdfUrl?: string | null; error?: string }> = [];

  for (const q of quotes) {
    const builderState = q.builder_state || {};
    if (builderState.pdfUrl) {
      results.push({ id: q.id, success: true, pdfUrl: builderState.pdfUrl });
      continue;
    }

    try {
      const fullDetails = builderState.fullDetails || {
        customerName: q.customer_name || 'Valued Customer',
        customerPhone: '',
        customerEmail: '',
        weddingDate: '',
        venueCity: '',
        venueAddress: builderState.venueAddress || '',
        guestCount: builderState.guestCount || 0,
        specialRequirements: builderState.notes || '',
        sections: [],
        cateringMenus: [],
        requestedExtras: [],
        estimatedTotal: 0,
        totalSelectionsCount: 0,
      };

      const pdfBlob = await generateEnquiryPdfBlob(fullDetails, q.id, q.created_at || new Date().toISOString());
      const pdfUrl = await uploadEnquiryPdf(pdfBlob, q.id);

      if (pdfUrl) {
        await admin
          .from('quotations')
          .update({ builder_state: { ...builderState, pdfUrl } })
          .eq('id', q.id);

        results.push({ id: q.id, success: true, pdfUrl });
      } else {
        results.push({ id: q.id, success: false, error: 'Storage upload returned null' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      results.push({ id: q.id, success: false, error: message });
    }
  }

  // Invalidate Redis quotes cache so CRM sees the new pdfUrls immediately
  await cacheDel('admin:quotes:list').catch(() => {});

  const newlyGenerated = results.filter((r) => r.success && r.pdfUrl).length;
  return NextResponse.json({ success: true, total: quotes.length, newlyGenerated, results });
}

export async function GET(request: NextRequest) {
  return POST(request);
}
