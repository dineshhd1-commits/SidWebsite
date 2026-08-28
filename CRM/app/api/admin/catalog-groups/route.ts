import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const eventTypeId = request.nextUrl.searchParams.get('eventTypeId');
  const categoryKey = request.nextUrl.searchParams.get('categoryKey');
  const admin = getSupabaseAdminClient();
  let query = admin.from('catalog_groups').select('*').order('display_order', { ascending: true });
  if (eventTypeId) query = query.contains('supported_event_types', [eventTypeId]);
  if (categoryKey) query = query.eq('category_key', categoryKey);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ groups: data });
}
