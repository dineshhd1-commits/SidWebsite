import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const gallerySchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  mediaType: z.enum(['image', 'video']).default('image'),
  url: z.string().min(1),
  thumbnailUrl: z.string().optional(),
  active: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export async function GET() {
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('gallery_items').select('*').order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = gallerySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from('gallery_items')
    .upsert({
      id: parsed.data.id,
      title: parsed.data.title,
      category: parsed.data.category,
      media_type: parsed.data.mediaType,
      url: parsed.data.url,
      thumbnail_url: parsed.data.thumbnailUrl || null,
      active: parsed.data.active,
      display_order: parsed.data.displayOrder,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
