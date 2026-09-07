import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { cacheGet, cacheSet, cacheDel } from '@/lib/redis';

/**
 * Every enquiry contains customer PII (name, phone, email, event details).
 * This must only ever be read/written through the service-role key on the
 * server, behind an admin session check - never directly from the browser
 * with the public anon key.
 *
 * Uses Redis caching (admin:quotes:list) with 60s TTL to reduce Supabase database load.
 */

const CACHE_KEY_QUOTES = 'admin:quotes:list';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check Redis cache first to reduce Supabase server load
  const cached = await cacheGet<unknown[]>(CACHE_KEY_QUOTES);
  if (cached && Array.isArray(cached)) {
    return NextResponse.json({ items: cached, cached: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('quotations').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: 'Failed to load quotes.' }, { status: 500 });

  // Store in Redis cache for 60 seconds
  await cacheSet(CACHE_KEY_QUOTES, data, 60);

  return NextResponse.json({ items: data });
}

const patchSchema = z
  .object({
    refCode: z.string().min(1).max(60),
    status: z.enum(['New', 'Contacted', 'Quoted', 'Confirmed', 'Cancelled']).optional(),
    customerName: z.string().max(200).optional(),
    customerEmail: z.string().max(200).optional(),
    customerPhone: z.string().max(40).optional(),
    pdfUrl: z.string().url().max(2000).optional(),
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

  const admin = getSupabaseAdminClient();

  if (parsed.data.pdfUrl !== undefined) {
    const { data: existing } = await admin
      .from('quotations')
      .select('builder_state')
      .eq('id', parsed.data.refCode)
      .single();
    if (existing) {
      row.builder_state = { ...(existing.builder_state || {}), pdfUrl: parsed.data.pdfUrl };
    }
  }

  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { error } = await admin.from('quotations').update(row).eq('id', parsed.data.refCode);
  if (error) return NextResponse.json({ error: 'Failed to update quote.' }, { status: 500 });

  // Invalidate Redis cache so next fetch reflects the update
  await cacheDel(CACHE_KEY_QUOTES);

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

  // Invalidate Redis cache on delete
  await cacheDel(CACHE_KEY_QUOTES);

  return NextResponse.json({ success: true });
}

