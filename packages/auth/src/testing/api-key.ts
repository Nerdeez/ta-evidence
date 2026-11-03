import type { db } from '@ta/db';
import { user } from '@ta/db';
import { auth } from '../better-auth/api.auth.js';
import { API_KEY_HEADER } from '../better-auth/api-key.js';

/** Drizzle handle from `@ta/db` (production `db` or PGlite injection in tests). */
type AuthTestDb = typeof db;

/**
 * Insert a user and create an API key via Better Auth (server `userId` body).
 * Requires auth tables on `db` (e.g. PGlite with full Drizzle migrations).
 */
export async function createTestApiKey(database: AuthTestDb): Promise<string> {
  const userId = 'test-user-api-key';
  await database.insert(user).values({
    id: userId,
    name: 'API Test User',
    email: 'api-test@example.com',
    emailVerified: true,
  });

  const created = await auth.api.createApiKey({
    body: {
      userId,
      name: 'test',
    },
  });

  if (!created.key) {
    throw new Error('createApiKey did not return a key');
  }

  return created.key;
}

export function apiKeyHeaders(key: string): { [K in typeof API_KEY_HEADER]: string } {
  return { [API_KEY_HEADER]: key };
}
