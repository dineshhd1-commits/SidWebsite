import { NextRequest, NextResponse } from 'next/server';
import { requireAdminSession } from '@/lib/admin-auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isLoginPage = pathname === '/admin/login';
  const isLoginApi = pathname === '/api/admin/login';
  const isProtectedPage = pathname.startsWith('/admin') && !isLoginPage;
  const isProtectedApi = pathname.startsWith('/api/admin') && !isLoginApi && pathname !== '/api/admin/logout';

  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const isAuthenticated = await requireAdminSession(request);

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (isProtectedApi) {
    return NextResponse.json({ error: 'Unauthorized. Please sign in as admin.' }, { status: 401 });
  }

  const loginUrl = new URL('/admin/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
