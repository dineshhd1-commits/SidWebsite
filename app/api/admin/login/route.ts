import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_COOKIE_OPTIONS, getExpectedAdminToken, isValidAdminPassword } from '@/lib/admin-auth';

const loginSchema = z.object({ password: z.string().min(1) });

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin login is not configured. Set ADMIN_PASSWORD on the server.' }, { status: 503 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
  }

  const valid = await isValidAdminPassword(parsed.data.password);
  if (!valid) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 });
  }

  const token = await getExpectedAdminToken();
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token!, ADMIN_SESSION_COOKIE_OPTIONS);
  return res;
}
