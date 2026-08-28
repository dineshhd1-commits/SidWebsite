import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

const patchSchema = z.object({
  includedItemIds: z.array(z.string()),
  groupLimits: z.array(z.object({ groupId: z.string(), maxSelections: z.number().min(1), freeIncludedCount: z.number().min(0) })),
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

  const delIncluded = await admin.from('package_included_items').delete().eq('package_id', id);
  if (delIncluded.error) return NextResponse.json({ error: delIncluded.error.message }, { status: 500 });

  if (parsed.data.includedItemIds.length > 0) {
    const insertIncluded = await admin
      .from('package_included_items')
      .insert(parsed.data.includedItemIds.map((catalogItemId) => ({ package_id: id, catalog_item_id: catalogItemId, quantity: 1 })));
    if (insertIncluded.error) return NextResponse.json({ error: insertIncluded.error.message }, { status: 500 });
  }

  const delLimits = await admin.from('package_group_limits').delete().eq('package_id', id);
  if (delLimits.error) return NextResponse.json({ error: delLimits.error.message }, { status: 500 });

  if (parsed.data.groupLimits.length > 0) {
    const insertLimits = await admin.from('package_group_limits').insert(
      parsed.data.groupLimits.map((l) => ({ package_id: id, group_id: l.groupId, max_selections: l.maxSelections, free_included_count: l.freeIncludedCount }))
    );
    if (insertLimits.error) return NextResponse.json({ error: insertLimits.error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
