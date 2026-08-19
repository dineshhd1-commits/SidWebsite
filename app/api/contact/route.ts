import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseAdminClient } from '@/lib/supabase-admin';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const contactSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  phone: z.string().trim().max(20),
  weddingDate: z.string().trim().max(40).optional().default(''),
  notes: z.string().trim().max(2000).optional().default(''),
});

export async function POST(request: NextRequest) {
  // 15 submissions per IP per 10 minutes - a real visitor submits this once.
  if (!checkRateLimit(`contact:${getClientIp(request)}`, 15, 10 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please check your name and phone number.' }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const admin = getSupabaseAdminClient();
    const { error } = await admin.from('inquiries').insert([
      {
        id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        full_name: data.fullName,
        phone: data.phone,
        wedding_date: data.weddingDate || null,
        notes: data.notes,
        status: 'New',
      },
    ]);
    if (error) {
      console.error('Contact inquiry insert failed:', error.message);
      return NextResponse.json({ success: false });
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Contact submission error:', e);
    return NextResponse.json({ success: false });
  }
}
