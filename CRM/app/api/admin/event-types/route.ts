import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('event_types').select('*').order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ eventTypes: data });
}
