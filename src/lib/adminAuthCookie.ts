/**
 * Session cookie encode/decode helpers (no server-only so testable and usable in middleware).
 * Used by adminAuth.ts and middleware.
 */
import { SignJWT, jwtVerify } from 'jose';
import type { AdminSession } from '@/types';

const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function getSessionSecret(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 32 characters');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Encode session payload into a signed JWT string.
 * @param secret - optional; if not provided, uses getSessionSecret()
 */
export async function encodeSession(
  session: AdminSession,
  secret?: Uint8Array
): Promise<string> {
  const key = secret ?? getSessionSecret();
  return new SignJWT({ ...session })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE)
    .sign(key);
}

/**
 * Decode and verify cookie value; returns session or null if invalid/expired.
 * @param secret - optional; if not provided, uses getSessionSecret()
 */
export async function decodeSession(
  token: string,
  secret?: Uint8Array
): Promise<AdminSession | null> {
  try {
    const key = secret ?? getSessionSecret();
    const { payload } = await jwtVerify(token, key);
    if (!payload.isAuthenticated || !payload.username) return null;
    return {
      isAuthenticated: true,
      username: String(payload.username),
    };
  } catch {
    return null;
  }
}

export { SESSION_MAX_AGE };
