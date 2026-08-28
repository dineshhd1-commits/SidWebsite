import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

/**
 * Every enquiry contains customer PII (name, phone, email, event details).
 * This must only ever be read/written through the service-role key on the
 * server, behind an admin session check - never directly from the browser
 * with the public anon key, which previously let anyone with the anon key
 * (visible in the client bundle by design) query every customer's contact
 * details straight out of Supabase.
 */

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('quotations').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Failed to load quotes.' }, { status: 500 });
  return NextResponse.json({ items: data });
}

const patchSchema = z
  .object({
    refCode: z.string().min(1).max(60),
    status: z.enum(['New', 'Contacted', 'Quoted', 'Confirmed', 'Cancelled']).optional(),
    customerName: z.string().max(200).optional(),
    customerEmail: z.string().max(200).optional(),
    customerPhone: z.string().max(40).optional(),
  })
  .strict();

export async function PATCH(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const row: Record<string, unknown> = {};
  if (parsed.data.status !== undefined) row.status = parsed.data.status;
  if (parsed.data.customerName !== undefined) row.customer_name = parsed.data.customerName;
  if (parsed.data.customerEmail !== undefined) row.customer_email = parsed.data.customerEmail;
  if (parsed.data.customerPhone !== undefined) row.customer_phone = parsed.data.customerPhone;
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('quotations').update(row).eq('id', parsed.data.refCode);
  if (error) return NextResponse.json({ error: 'Failed to update quote.' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const refCode = request.nextUrl.searchParams.get('refCode');
  if (!refCode) return NextResponse.json({ error: 'refCode is required' }, { status: 400 });

  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('quotations').delete().eq('id', refCode);
  if (error) return NextResponse.json({ error: 'Failed to delete quote.' }, { status: 500 });
  return NextResponse.json({ success: true });
}
