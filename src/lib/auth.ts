import 'server-only';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import type { AdminSession } from '@/types';
import {
  encodeSession,
  getAdminSession as getAdminSessionFromCookie,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE,
} from '@/lib/adminAuth';

// Logging helper
function logAuth(operation: string, details?: Record<string, unknown>) {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: 'auth',
      operation,
      ...details,
    })
  );
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const adminUser = process.env.ADMIN_USER;
  const adminPassHash = process.env.ADMIN_PASS_HASH;

  if (!adminUser || !adminPassHash) {
    logAuth('verifyCredentials:missingEnvVars');
    return false;
  }

  if (username !== adminUser) {
    logAuth('verifyCredentials:invalidUsername', { username });
    return false;
  }

  const isValid = await bcrypt.compare(password, adminPassHash);
  logAuth('verifyCredentials', { username, valid: isValid });

  return isValid;
}

/**
 * Create admin session (signed cookie via adminAuth)
 */
export async function createAdminSession(username: string): Promise<void> {
  const cookieStore = await cookies();
  const session: AdminSession = { isAuthenticated: true, username };
  const token = await encodeSession(session);

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  logAuth('createSession', { username });
}

/**
 * Get admin session (validates signed cookie)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  return getAdminSessionFromCookie();
}

/**
 * Check if admin is authenticated
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session?.isAuthenticated === true;
}

/**
 * Destroy admin session
 */
export async function destroyAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  logAuth('destroySession');
}

/**
 * Generate password hash (utility for creating ADMIN_PASS_HASH)
 */
export async function generatePasswordHash(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
