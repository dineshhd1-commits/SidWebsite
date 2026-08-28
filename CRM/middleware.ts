import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/login';
  const isLoginApi = pathname === '/api/admin/login';
  // Any static file under /public (images, PDFs used by the CRM's own PDF
  // generation, etc.) - not just _next's own assets - must stay reachable
  // without a session cookie, or server-side consumers (e.g. the enquiry PDF
  // renderer loading the logo) get redirected/401'd instead of the asset.
  const isPublicStatic =
    pathname.startsWith('/_next') ||
    /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isLoginPage || isLoginApi || isPublicStatic) {
    return NextResponse.next();
  }

  const isAuthenticated = await requireAdminSession(request);

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
