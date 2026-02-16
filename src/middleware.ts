import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeSession } from '@/lib/adminAuthCookie';

const SESSION_COOKIE_NAME = 'identi_admin_session';

async function isSessionValid(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  const key = new TextEncoder().encode(secret);
  const session = await decodeSession(token, key);
  return session?.isAuthenticated === true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and login API
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }
  if (pathname === '/api/admin/login' && request.method === 'POST') {
    return NextResponse.next();
  }

  // Protect /admin and /api/admin/*
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    if (!token || !(await isSessionValid(token))) {
      const loginUrl = new URL('/admin/login', request.url);
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
