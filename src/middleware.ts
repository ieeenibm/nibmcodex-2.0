import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const pathname = request.nextUrl.pathname;

  if (
    (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) ||
    pathname.startsWith('/api/admin')
  ) {
    if (!token) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const payload = await verifyToken(token);
    if (!payload) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // If host has mustChangePass flag set, force them to change password first
    if (
      payload.mustChangePass &&
      !pathname.startsWith('/admin/change-password') &&
      !pathname.startsWith('/api/auth/change-password') &&
      !pathname.startsWith('/api/auth/logout')
    ) {
      if (pathname.startsWith('/api/admin')) {
        return NextResponse.json({ error: 'Password change required' }, { status: 403 });
      }
      return NextResponse.redirect(new URL('/admin/change-password', request.url));
    }

    // Pass the user info via headers for downstream API routes
    const response = NextResponse.next();
    response.headers.set('x-user-id', payload.id as string);
    response.headers.set('x-user-role', payload.role as string);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
