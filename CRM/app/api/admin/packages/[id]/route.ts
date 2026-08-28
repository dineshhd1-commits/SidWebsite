import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

const patchSchema = z.object({
  includedItemIds: z.array(z.string()),
  groupLimits: z.array(z.object({ groupId: z.string(), maxSelections: z.number().min(1), freeIncludedCount: z.number().min(0) })),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const [includedRes, limitsRes] = await Promise.all([
    admin.from('package_included_items').select('catalog_item_id, quantity').eq('package_id', id),
    admin.from('package_group_limits').select('*').eq('package_id', id),
  ]);
  if (includedRes.error) return NextResponse.json({ error: includedRes.error.message }, { status: 500 });
  if (limitsRes.error) return NextResponse.json({ error: limitsRes.error.message }, { status: 500 });
  return NextResponse.json({
    includedItemIds: (includedRes.data || []).map((r) => r.catalog_item_id),
    groupLimits: (limitsRes.data || []).map((r) => ({ groupId: r.group_id, maxSelections: r.max_selections, freeIncludedCount: r.free_included_count })),
  });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const admin = getSupabaseAdminClient();

  // Runs as a single Postgres transaction (see
  // supabase/migrations/20260828000200_replace_package_items_transaction.sql
  // in the web app - both apps share the same Supabase project/database)
  // instead of four separate delete/insert calls - a failure partway through
  // used to leave the package's included items deleted with nothing
  // reinserted until the admin manually retried.
  const { error } = await admin.rpc('replace_package_items', {
    p_package_id: id,
    p_included_items: parsed.data.includedItemIds.map((catalogItemId) => ({ catalogItemId, quantity: 1 })),
    p_group_limits: parsed.data.groupLimits.map((l) => ({
      groupId: l.groupId,
      maxSelections: l.maxSelections,
      freeIncludedCount: l.freeIncludedCount,
    })),
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
