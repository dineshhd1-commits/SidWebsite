import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';
import { cacheGet, cacheSet } from '@/lib/redis';

const CACHE_KEY_PACKAGES = 'admin:packages:list';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cached = await cacheGet<unknown[]>(CACHE_KEY_PACKAGES);
  if (cached && Array.isArray(cached)) {
    return NextResponse.json({ packages: cached, cached: true });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from('wedding_packages')
    .select('*')
    .not('package_level', 'is', null)
    .order('base_price', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await cacheSet(CACHE_KEY_PACKAGES, data, 300).catch(() => {});
  return NextResponse.json({ packages: data });
}
