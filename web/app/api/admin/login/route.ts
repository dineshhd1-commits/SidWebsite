import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_COOKIE_OPTIONS, getExpectedAdminToken, isValidAdminPassword } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const loginSchema = z.object({ password: z.string().min(1) });

export async function POST(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Admin login is not configured. Set ADMIN_PASSWORD on the server.' }, { status: 503 });
  }

  // Blunt brute-force protection: 10 attempts per IP per 15 minutes.
  if (!checkRateLimit(`admin-login:${getClientIp(request)}`, 10, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
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
