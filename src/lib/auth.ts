import 'server-only';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import type { AdminSession } from '@/types';

const SESSION_COOKIE_NAME = 'identi_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours

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
 * Create admin session
 */
export async function createAdminSession(username: string): Promise<void> {
  const cookieStore = await cookies();

  const session: AdminSession = {
    isAuthenticated: true,
    username,
  };

  const sessionData = Buffer.from(JSON.stringify(session)).toString('base64');

  cookieStore.set(SESSION_COOKIE_NAME, sessionData, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });

  logAuth('createSession', { username });
}

/**
 * Get admin session
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);

  if (!sessionCookie?.value) {
    return null;
  }

  try {
    const sessionData = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    const session = JSON.parse(sessionData) as AdminSession;

    if (!session.isAuthenticated) {
      return null;
    }

    return session;
  } catch {
    logAuth('getSession:parseError');
    return null;
  }
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
