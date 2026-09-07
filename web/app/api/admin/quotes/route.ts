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

import { cacheGet, cacheSet, cacheDel } from '@/lib/redis';

// Separate, unfiltered aggregate (counts + pipeline value) so the dashboard's
// summary cards don't need every row's full builder_state (which carries the
// entire selection breakdown + photo URLs, the actual weight behind the old
// unbounded `select('*')` over the whole table) - just two small columns.
const CACHE_KEY_STATS = 'admin:quotes:stats';

const DEFAULT_PAGE_SIZE = 20;
const MAX_PAGE_SIZE = 100;

async function getQuotesStats() {
  const cached = await cacheGet<{ total: number; pending: number; confirmed: number; pipelineValue: number }>(CACHE_KEY_STATS);
  if (cached) return cached;

  const admin = getSupabaseAdminClient();
  const { data } = await admin.from('quotations').select('status, price_breakdown');
  const rows = data || [];
  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === 'New').length,
    confirmed: rows.filter((r) => r.status === 'Confirmed').length,
    pipelineValue: rows.reduce((acc, r) => acc + (r.price_breakdown?.estimatedCost || 0), 0),
  };
  await cacheSet(CACHE_KEY_STATS, stats, 60);
  return stats;
}

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10) || 1);
  const pageSize = Math.min(MAX_PAGE_SIZE, Math.max(1, parseInt(request.nextUrl.searchParams.get('pageSize') || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE));
  const search = (request.nextUrl.searchParams.get('search') || '').trim();
  const status = (request.nextUrl.searchParams.get('status') || '').trim();
  const stats = await getQuotesStats();

  const admin = getSupabaseAdminClient();
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = admin.from('quotations').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
  // ilike, not eq - the status filter dropdown sends lowercase values
  // ('new', 'confirmed') while the DB column stores them capitalized.
  if (status) query = query.ilike('status', status);
  if (search) {
    const like = `%${search.replace(/[%,]/g, '')}%`;
    query = query.or(`customer_name.ilike.${like},id.ilike.${like},customer_phone.ilike.${like},venue_city.ilike.${like}`);
  }
  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: 'Failed to load quotes.' }, { status: 500 });

  return NextResponse.json({ items: data, total: count ?? data.length, page, pageSize, stats });
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
  await cacheDel(CACHE_KEY_STATS).catch(() => {});
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
  await cacheDel(CACHE_KEY_STATS).catch(() => {});
  return NextResponse.json({ success: true });
}
