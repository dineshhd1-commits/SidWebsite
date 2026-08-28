import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

/** Public, unauthenticated lookup for a customer revisiting their own
 * quotation link (e.g. /quotation/BK-XXXXXX shared via WhatsApp). Anyone
 * with the reference code can view it - same trust model as an order number
 * - so only the display-safe selection breakdown is returned here, never
 * customer_name/phone/email/address, which stay behind the admin-authenticated
 * /api/admin/quotes endpoint. */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkRateLimit(`quotation-lookup:${getClientIp(request)}`, 30, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  const { id } = await params;
  const refCode = (id || '').trim().slice(0, 60);
  if (!refCode) {
    return NextResponse.json({ error: 'Invalid reference code.' }, { status: 400 });
  }

  try {
    const admin = getSupabaseAdminClient();
    const { data, error } = await admin
      .from('quotations')
      .select('builder_state')
      .eq('id', refCode)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Quotation not found.' }, { status: 404 });
    }

    const builderState = data.builder_state || {};
    const fullDetails = builderState.fullDetails || null;

    return NextResponse.json({
      refCode,
      guestCount: builderState.guestCount ?? fullDetails?.guestCount ?? 0,
      sections: fullDetails?.sections || [],
      requestedExtras: fullDetails?.requestedExtras || [],
    });
  } catch (e) {
    console.error('Quotation lookup error:', e);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
