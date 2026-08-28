import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

const patchSchema = z.object({
  isCatalogReady: z.boolean().optional(),
  active: z.boolean().optional(),
  name: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const row: Record<string, unknown> = {};
  if (parsed.data.isCatalogReady !== undefined) row.is_catalog_ready = parsed.data.isCatalogReady;
  if (parsed.data.active !== undefined) row.active = parsed.data.active;
  if (parsed.data.name !== undefined) row.name = parsed.data.name;
  if (parsed.data.shortDescription !== undefined) row.short_description = parsed.data.shortDescription;
  if (parsed.data.imageUrl !== undefined) row.image_url = parsed.data.imageUrl;

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('event_types').update(row).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ eventType: data });
}
