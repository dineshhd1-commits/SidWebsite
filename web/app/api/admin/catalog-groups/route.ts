import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { cacheGet, cacheSet } from '@/lib/redis';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const eventTypeId = request.nextUrl.searchParams.get('eventTypeId') || 'all';
  const categoryKey = request.nextUrl.searchParams.get('categoryKey') || 'all';
  const cacheKey = `admin:catalog_groups:${eventTypeId}:${categoryKey}`;

  const cached = await cacheGet<unknown[]>(cacheKey);
  if (cached && Array.isArray(cached)) {
    return NextResponse.json({ groups: cached, cached: true });
  }

  const admin = getSupabaseAdminClient();
  let query = admin.from('catalog_groups').select('*').order('display_order', { ascending: true });
  if (eventTypeId !== 'all') query = query.contains('supported_event_types', [eventTypeId]);
  if (categoryKey !== 'all') query = query.eq('category_key', categoryKey);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await cacheSet(cacheKey, data, 120).catch(() => {});
  return NextResponse.json({ groups: data });
}
