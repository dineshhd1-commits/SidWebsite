import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const catalogItemSchema = z.object({
  id: z.string().min(1).max(120),
  supportedEventTypes: z.array(z.string()).min(1),
  categoryKey: z.enum(['decoration', 'photography', 'catering', 'venue', 'additional_services']),
  groupId: z.string().nullable().optional(),
  name: z.string().min(1).max(200),
  description: z.string().default(''),
  imageUrl: z.string().default(''),
  images: z.array(z.string()).default([]),
  packageLevel: z.enum(['normal', 'standard', 'silver', 'gold', 'premium', 'luxury']),
  price: z.number().min(0),
  unit: z.string().default('item'),
  quantityMode: z.enum(['single', 'stepper', 'team_size']).default('single'),
  maxQuantity: z.number().nullable().optional(),
  maxSelectionsOverride: z.number().nullable().optional(),
  metadata: z.record(z.any()).default({}),
  active: z.boolean().default(true),
  displayOrder: z.number().default(0),
});

function toRow(input: z.infer<typeof catalogItemSchema>) {
  return {
    id: input.id,
    supported_event_types: input.supportedEventTypes,
    category_key: input.categoryKey,
    group_id: input.groupId || null,
    name: input.name,
    description: input.description,
    image_url: input.imageUrl,
    images: input.images,
    package_level: input.packageLevel,
    price: input.price,
    unit: input.unit,
    quantity_mode: input.quantityMode,
    max_quantity: input.maxQuantity ?? null,
    max_selections_override: input.maxSelectionsOverride ?? null,
    metadata: input.metadata,
    active: input.active,
    display_order: input.displayOrder,
  };
}

export async function GET(request: NextRequest) {
  const eventTypeId = request.nextUrl.searchParams.get('eventTypeId');
  const admin = getSupabaseAdminClient();
  let query = admin.from('catalog_items').select('*').order('display_order', { ascending: true });
  if (eventTypeId) query = query.contains('supported_event_types', [eventTypeId]);
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = catalogItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('catalog_items').upsert(toRow(parsed.data)).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
