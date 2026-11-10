import { randomUUID } from 'node:crypto';
import { test } from '@playwright/test';
import { db, user } from '@ta/db';
import { eq } from 'drizzle-orm';
import { type AuthUser, auth } from '../better-auth/api.auth.js';

/** DB user from Better Auth plus the plaintext password (stored on `account`, not `user`). */
type TestEmailPasswordUser = AuthUser & { password: string };

const defaultTestPassword = 'E2eTestPassword1!';

/**
 * Creates a user with email/password via Better Auth, then marks the email verified
 * so sign-in works with `requireEmailVerification` enabled.
 */
async function createTestEmailPasswordUser(): Promise<TestEmailPasswordUser> {
  const id = randomUUID();
  const email = `e2e+${id}@example.com`;
  const password = defaultTestPassword;
  const name = `E2E User ${id.slice(0, 8)}`;

  const signedUp = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!signedUp.user?.id) {
    throw new Error('signUpEmail did not return a user id');
  }

  await db.update(user).set({ emailVerified: true }).where(eq(user.id, signedUp.user.id));

  return {
    ...signedUp.user,
    emailVerified: true,
    password,
  };
}

/**
 * Registers Playwright `beforeAll` / `afterAll` on the current `test.describe` block:
 * creates a verified email/password user per worker and deletes it afterward.
 *
 * Call once at the top of `test.describe` (synchronously). `await` the returned promise inside tests.
 */
export function createTestUser(): Promise<TestEmailPasswordUser> {
  let testUser: TestEmailPasswordUser | undefined;
  let resolveUser!: (value: TestEmailPasswordUser) => void;
  let rejectUser!: (reason?: unknown) => void;

  const userPromise = new Promise<TestEmailPasswordUser>((resolve, reject) => {
    resolveUser = resolve;
    rejectUser = reject;
  });

  test.beforeAll(async () => {
    try {
      testUser = await createTestEmailPasswordUser();
      resolveUser(testUser);
    } catch (error) {
      rejectUser(error);
    }
  });

  test.afterAll(async () => {
    if (testUser) {
      await db.delete(user).where(eq(user.id, testUser.id));
      testUser = undefined;
    }
  });

  return userPromise;
}
