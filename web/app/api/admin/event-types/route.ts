import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('event_types').select('*').order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ eventTypes: data });
}
