import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const testimonialPatchSchema = z
  .object({
    coupleNames: z.string().min(1).optional(),
    weddingDate: z.string().optional(),
    location: z.string().optional(),
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().min(1).optional(),
    imageUrl: z.string().optional(),
    isGoogleVerified: z.boolean().optional(),
    active: z.boolean().optional(),
    displayOrder: z.number().optional(),
  })
  .strict();

function toRowPatch(input: z.infer<typeof testimonialPatchSchema>) {
  const row: Record<string, unknown> = {};
  if (input.coupleNames !== undefined) row.couple_names = input.coupleNames;
  if (input.weddingDate !== undefined) row.wedding_date = input.weddingDate;
  if (input.location !== undefined) row.location = input.location;
  if (input.rating !== undefined) row.rating = input.rating;
  if (input.comment !== undefined) row.comment = input.comment;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl;
  if (input.isGoogleVerified !== undefined) row.is_google_verified = input.isGoogleVerified;
  if (input.active !== undefined) row.active = input.active;
  if (input.displayOrder !== undefined) row.display_order = input.displayOrder;
  return row;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('testimonials').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = testimonialPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const row = toRowPatch(parsed.data);
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('testimonials').update(row).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
