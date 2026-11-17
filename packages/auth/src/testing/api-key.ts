import { apikey, db, user } from '@ta/db';
import { eq } from 'drizzle-orm';
import { auth } from '../better-auth/api.auth.js';
import { API_KEY_HEADER } from '../better-auth/api-key.js';

/** Drizzle handle from `@ta/db` (production `db` or PGlite injection in tests). */
type AuthTestDb = typeof db;

/**
 * Insert a user and create an API key via Better Auth (server `userId` body).
 * Requires auth tables on `db` (e.g. PGlite with full Drizzle migrations).
 */
export type CreateUserApiKeyInput = {
  name: string;
  expiresIn?: number;
};

/** Create an API key for an existing user (e2e / integration). Does not return the secret. */
export async function createUserApiKey(userId: string, input: CreateUserApiKeyInput) {
  const created = await auth.api.createApiKey({
    body: {
      userId,
      name: input.name,
      ...(input.expiresIn !== undefined ? { expiresIn: input.expiresIn } : {}),
    },
  });

  if (!created.id) {
    throw new Error('createApiKey did not return a key id');
  }

  return created;
}

/** Force a key into the expired state for dashboard e2e (Better Auth min `expiresIn` is one day). */
export async function expireUserApiKeyForE2e(keyId: string): Promise<void> {
  await db
    .update(apikey)
    .set({ expiresAt: new Date('2020-01-01T00:00:00.000Z') })
    .where(eq(apikey.id, keyId));
}

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
