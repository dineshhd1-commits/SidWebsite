import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';

const catalogItemPatchSchema = z
  .object({
    supportedEventTypes: z.array(z.string()).min(1).optional(),
    categoryKey: z.enum(['decoration', 'photography', 'catering', 'venue', 'additional_services']).optional(),
    groupId: z.string().nullable().optional(),
    name: z.string().min(1).max(200).optional(),
    description: z.string().optional(),
    imageUrl: z.string().optional(),
    images: z.array(z.string()).optional(),
    packageLevel: z.enum(['normal', 'standard', 'silver', 'gold', 'premium', 'luxury']).optional(),
    price: z.number().min(0).optional(),
    unit: z.string().optional(),
    quantityMode: z.enum(['single', 'stepper', 'team_size']).optional(),
    maxQuantity: z.number().nullable().optional(),
    maxSelectionsOverride: z.number().nullable().optional(),
    metadata: z.record(z.any()).optional(),
    active: z.boolean().optional(),
    displayOrder: z.number().optional(),
  })
  .strict();

function toRowPatch(input: z.infer<typeof catalogItemPatchSchema>) {
  const row: Record<string, unknown> = {};
  if (input.supportedEventTypes !== undefined) row.supported_event_types = input.supportedEventTypes;
  if (input.categoryKey !== undefined) row.category_key = input.categoryKey;
  if (input.groupId !== undefined) row.group_id = input.groupId;
  if (input.name !== undefined) row.name = input.name;
  if (input.description !== undefined) row.description = input.description;
  if (input.imageUrl !== undefined) row.image_url = input.imageUrl;
  if (input.images !== undefined) row.images = input.images;
  if (input.packageLevel !== undefined) row.package_level = input.packageLevel;
  if (input.price !== undefined) row.price = input.price;
  if (input.unit !== undefined) row.unit = input.unit;
  if (input.quantityMode !== undefined) row.quantity_mode = input.quantityMode;
  if (input.maxQuantity !== undefined) row.max_quantity = input.maxQuantity;
  if (input.maxSelectionsOverride !== undefined) row.max_selections_override = input.maxSelectionsOverride;
  if (input.metadata !== undefined) row.metadata = input.metadata;
  if (input.active !== undefined) row.active = input.active;
  if (input.displayOrder !== undefined) row.display_order = input.displayOrder;
  return row;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const admin = getSupabaseAdminClient();
  const { error } = await admin.from('catalog_items').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const parsed = catalogItemPatchSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const row = toRowPatch(parsed.data);
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const admin = getSupabaseAdminClient();
  const { data, error } = await admin.from('catalog_items').update(row).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
