import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, getExpectedAdminToken } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isLoginApi = pathname === '/api/admin/login';
  const isPublicStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icon.png');

  if (isLoginPage || isLoginApi || isPublicStatic) {
    return NextResponse.next();
  }

  const expectedToken = await getExpectedAdminToken();
  const cookieToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = !!expectedToken && cookieToken === expectedToken;

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in as admin.' }, { status: 401 });
  }

  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
