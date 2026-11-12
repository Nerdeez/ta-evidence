/**
 * Playwright e2e helpers for email/password users: programmatic setup for login flows
 * (`createTestUser`) and UI signup flows (credentials + teardown).
 */
import { randomUUID } from 'node:crypto';

import { test } from '@playwright/test';
import { db, user, verification } from '@ta/db';
import { eq } from 'drizzle-orm';

import { type AuthUser, auth } from '../better-auth/api.auth.js';

/** DB user from Better Auth plus the plaintext password (stored on `account`, not `user`). */
type TestEmailPasswordUser = AuthUser & { password: string };

/** Default password for e2e users (login fixtures and signup UI tests). */
export const e2eSignupPassword = 'E2eTestPassword1!';

export type E2eSignupCredentials = {
  name: string;
  email: string;
  password: string;
};

function buildE2eSignupCredentials(workerIndex?: number): E2eSignupCredentials {
  const id = randomUUID();
  const workerPrefix = workerIndex === undefined ? '' : `w${workerIndex}+`;
  return {
    name: `E2E Signup ${id.slice(0, 8)}`,
    email: `e2e-signup+${workerPrefix}${id}@example.com`,
    password: e2eSignupPassword,
  };
}

export type E2eSignupCredentialsBinder = ((workerIndex?: number) => E2eSignupCredentials) & {
  trackCreatedUser: (email: string) => void;
};

/**
 * Binds signup credentials + DB teardown for users that were actually created.
 *
 * Credentials alone do not schedule cleanup. Call `trackCreatedUser(email)` once the user
 * row exists (e.g. after signup assertions confirm the DB state).
 */
export function e2eSignupCredentials(): E2eSignupCredentialsBinder {
  const pendingEmails = new Set<string>();

  test.afterEach(async () => {
    const emails = [...pendingEmails];
    pendingEmails.clear();
    for (const email of emails) {
      try {
        await cleanupE2eSignup(email);
      } catch (error) {
        console.warn(`[e2e] signup cleanup failed for ${email}:`, error);
      }
    }
  });

  const credentials = (workerIndex?: number) => buildE2eSignupCredentials(workerIndex);

  return Object.assign(credentials, {
    trackCreatedUser(email: string) {
      pendingEmails.add(email);
    },
  });
}

/**
 * Best-effort teardown for a signup e2e email. Safe when signup never created a `user` row
 * (verification delete is a no-op; user delete is skipped when missing).
 */
export async function cleanupE2eSignup(email: string): Promise<void> {
  await db.delete(verification).where(eq(verification.identifier, email));
  const [dbUser] = await db.select({ id: user.id }).from(user).where(eq(user.email, email));
  if (!dbUser) {
    return;
  }
  await db.delete(user).where(eq(user.id, dbUser.id));
}

/**
 * Creates a user with email/password via Better Auth, then marks the email verified
 * so sign-in works with `requireEmailVerification` enabled.
 */
async function createTestEmailPasswordUser(): Promise<TestEmailPasswordUser> {
  const id = randomUUID();
  const email = `e2e+${id}@example.com`;
  const password = e2eSignupPassword;
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
      await cleanupE2eSignup(testUser.email);
      testUser = undefined;
    }
  });

  return userPromise;
}
