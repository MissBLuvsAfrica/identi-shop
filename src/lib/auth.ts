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

export type VerifyCredentialsResult =
  | { ok: true }
  | { ok: false; reason: 'missing_env' | 'username' | 'password' };

/**
 * Verify admin credentials. When ADMIN_LOGIN_DEBUG=true, returns reason for failure.
 */
export async function verifyAdminCredentials(
  username: string,
  password: string
): Promise<boolean> {
  const result = await verifyAdminCredentialsWithReason(username, password);
  return result.ok;
}

export async function verifyAdminCredentialsWithReason(
  username: string,
  password: string
): Promise<VerifyCredentialsResult> {
  const adminUser = process.env.ADMIN_USER?.trim();
  const adminPassHash = process.env.ADMIN_PASS_HASH?.trim();

  if (!adminUser || !adminPassHash) {
    logAuth('verifyCredentials:missingEnvVars');
    return { ok: false, reason: 'missing_env' };
  }

  const usernameNorm = username.trim();
  if (usernameNorm !== adminUser) {
    logAuth('verifyCredentials:invalidUsername', { username: usernameNorm });
    return { ok: false, reason: 'username' };
  }

  const isValid = await bcrypt.compare(password, adminPassHash);
  logAuth('verifyCredentials', { username: usernameNorm, valid: isValid });
  if (!isValid) return { ok: false, reason: 'password' };

  return { ok: true };
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
