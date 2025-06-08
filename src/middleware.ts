
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE_NAME = 'admin-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow requests to the login page itself
  if (pathname === '/api/auth/admin/login') {
    return NextResponse.next();
  }

  // Protect all other /api/admin/* routes
  if (pathname.startsWith('/api/admin')) {
    const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE_NAME);

    if (!sessionCookie || sessionCookie.value !== 'true') { // Extremely basic check
      // Respond with 401 Unauthorized if not authenticated
      const url = request.nextUrl.clone();
      url.pathname = '/api/auth/unauthorized'; // Or redirect to a login page if you had one
      // return NextResponse.redirect(url); // If redirecting to a page
      return NextResponse.json({ message: 'Authentication required. Invalid or missing session.' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/admin/:path*', '/api/auth/admin/login'],
};
