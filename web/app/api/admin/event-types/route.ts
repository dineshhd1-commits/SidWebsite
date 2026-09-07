import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { cacheGet, cacheSet } from '@/lib/redis';

const CACHE_KEY_EVENT_TYPES = 'admin:event_types:list';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cached = await cacheGet<unknown[]>(CACHE_KEY_EVENT_TYPES);
  if (cached && Array.isArray(cached)) {
    return NextResponse.json({ eventTypes: cached, cached: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('event_types').select('*').order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await cacheSet(CACHE_KEY_EVENT_TYPES, data, 300).catch(() => {});
  return NextResponse.json({ eventTypes: data });
}
