/** Next.js session helpers (Better Auth + App Router). */

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { type AuthSession, auth } from './next.auth.js';

const DEFAULT_LOGIN_PATH = '/login';
const DEFAULT_VERIFY_EMAIL_PATH = '/verify-email';

export type RequireSessionOptions = {
  loginPath?: string;
  verifyEmailPath?: string;
};

/** Current Better Auth session from request cookies, or `null` when absent or lookup fails. */
export async function getServerSession(): Promise<AuthSession | null> {
  try {
    return await auth.api.getSession({
      headers: await headers(),
    });
  } catch {
    return null;
  }
}

/**
 * Returns the session or redirects: no session → login, unverified email → verify-email.
 * For protected Next.js layouts and server actions.
 */
export async function requireSession(options: RequireSessionOptions = {}): Promise<AuthSession> {
  const loginPath = options.loginPath ?? DEFAULT_LOGIN_PATH;
  const verifyEmailPath = options.verifyEmailPath ?? DEFAULT_VERIFY_EMAIL_PATH;

  const session = await getServerSession();
  if (!session) {
    redirect(loginPath);
  }

  const { user } = session;
  if (!user.emailVerified) {
    redirect(verifyEmailPath);
  }

  return session;
}
