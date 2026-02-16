import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  encodeSession,
  decodeSession,
  SESSION_MAX_AGE,
} from '@/lib/adminAuthCookie';
import type { AdminSession } from '@/types';

const SESSION_COOKIE_NAME = 'identi_admin_session';

/**
 * Read and validate admin session from httpOnly cookie.
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const value = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!value) return null;
  return decodeSession(value);
}

/**
 * Require admin auth; redirects to /admin/login if not authenticated.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session?.isAuthenticated) {
    redirect('/admin/login');
  }
  return session;
}

export { encodeSession, decodeSession, SESSION_COOKIE_NAME, SESSION_MAX_AGE };
