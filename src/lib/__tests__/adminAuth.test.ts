import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { decodeSession } from '../adminAuthCookie';

/**
 * Session encode/decode round-trip is covered by E2E (admin login flow).
 * Here we test decodeSession validity for invalid inputs (jose SignJWT in Vitest
 * has environment-specific payload type requirements).
 */
describe('adminAuthCookie', () => {
  beforeEach(() => {
    process.env.ADMIN_SESSION_SECRET = 'a'.repeat(32);
  });

  afterEach(() => {
    delete process.env.ADMIN_SESSION_SECRET;
  });

  describe('decodeSession', () => {
    it('returns null for invalid token', async () => {
      const decoded = await decodeSession('invalid.jwt.token');
      expect(decoded).toBeNull();
    });

    it('returns null for empty string', async () => {
      const decoded = await decodeSession('');
      expect(decoded).toBeNull();
    });

    it('returns null for malformed JWT (no dots)', async () => {
      const decoded = await decodeSession('notajwt');
      expect(decoded).toBeNull();
    });
  });
});
