import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

const galleryPatchSchema = z
  .object({
    title: z.string().min(1).optional(),
    category: z.string().min(1).optional(),
    mediaType: z.enum(['image', 'video']).optional(),
    url: z.string().min(1).optional(),
    thumbnailUrl: z.string().optional(),
    active: z.boolean().optional(),
    displayOrder: z.number().optional(),
  })
  .strict();

function toRowPatch(input: z.infer<typeof galleryPatchSchema>) {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.category !== undefined) row.category = input.category;
  if (input.mediaType !== undefined) row.media_type = input.mediaType;
  if (input.url !== undefined) row.url = input.url;
  if (input.thumbnailUrl !== undefined) row.thumbnail_url = input.thumbnailUrl;
  if (input.active !== undefined) row.active = input.active;
  if (input.displayOrder !== undefined) row.display_order = input.displayOrder;
  return row;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('gallery_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json();
  const parsed = galleryPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const row = toRowPatch(parsed.data);
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('gallery_items').update(row).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
