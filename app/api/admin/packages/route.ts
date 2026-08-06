import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

export async function GET() {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from('wedding_packages')
    .select('*')
    .not('package_level', 'is', null)
    .order('base_price', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ packages: data });
}
