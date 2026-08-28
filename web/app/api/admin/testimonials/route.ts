import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { requireAdminSession } from '@/lib/admin-auth';

const testimonialSchema = z.object({
  id: z.string().min(1),
  coupleNames: z.string().min(1),
  weddingDate: z.string().default(''),
  location: z.string().default(''),
  rating: z.number().min(1).max(5).default(5),
  comment: z.string().min(1),
  imageUrl: z.string().default(''),
  isGoogleVerified: z.boolean().default(true),
  active: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

export async function GET(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('testimonials').select('*').order('display_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin
    .from('testimonials')
    .upsert({
      id: parsed.data.id,
      couple_names: parsed.data.coupleNames,
      wedding_date: parsed.data.weddingDate,
      location: parsed.data.location,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
      image_url: parsed.data.imageUrl,
      is_google_verified: parsed.data.isGoogleVerified,
      active: parsed.data.active,
      display_order: parsed.data.displayOrder,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
