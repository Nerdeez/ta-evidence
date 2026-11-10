import { apiKey } from '@better-auth/api-key';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from '@ta/db';
import { loadRepoDotenvFromModule } from '@ta/workspace';
import type { User } from 'better-auth';

const nonRuntimeAuthSecret = 'build-time-placeholder-not-used-at-runtime-32';

let repoDotenvLoaded = false;

/** Root `.env` for local dev when Better Auth reads secrets outside Next's config phase (e.g. Turbopack). */
function loadRepoDotenvIfNeeded(): void {
  if (repoDotenvLoaded) {
    return;
  }
  repoDotenvLoaded = true;
  loadRepoDotenvFromModule(import.meta.url);
}

function requireEnv(name: string): string {
  loadRepoDotenvIfNeeded();
  const value = process.env[name];
  if (value) {
    return value;
  }
  // `next build` loads API route modules when collecting page data; secrets are runtime-only.
  if (process.env['NEXT_PHASE'] === 'phase-production-build') {
    return nonRuntimeAuthSecret;
  }
  // Vitest (and CI) may import `@ta/auth` before `.env` is loaded; tests use PGlite / stubs, not real sessions.
  if (
    process.env['CI'] === 'true' ||
    process.env['VITEST'] === 'true' ||
    process.env['NODE_ENV'] === 'test'
  ) {
    return nonRuntimeAuthSecret;
  }
  throw new Error(`${name} is not set. See .env.example at the repository root.`);
}

/** Public origin of `@ta/web-iam` (Better Auth handler at `/api/auth/*`). */
export function getAuthBaseUrl(): string {
  const baseUrl = process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3001';
  return baseUrl.replace(/\/$/, '');
}

const webStrategiesUrl = process.env['NEXT_PUBLIC_WEB_STRATEGIES_URL'] ?? 'http://localhost:3000';

/** Shared Better Auth options (API keys, Drizzle, email/password). */
export function createAuthOptions() {
  return {
    secret: requireEnv('BETTER_AUTH_SECRET'),
    baseURL: getAuthBaseUrl(),
    database: drizzleAdapter(db, {
      provider: 'pg',
      transaction: true,
    }),
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      sendVerificationEmail: async ({ user, url }: { user: User; url: string }) => {
        // Replace with a transactional provider in production (see Better Auth email docs).
        console.log(`[better-auth] Verify email for ${user.email}: ${url}`);
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      autoSignIn: false,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user }: { user: User }) => {
        // TODO: Send reset email when transactional email is connected (see Better Auth email docs).
        console.log(`[better-auth] Reset password requested for ${user.email}`);
      },
    },
    trustedOrigins: [webStrategiesUrl, getAuthBaseUrl()],
    plugins: [
      // User-owned keys; default header `x-api-key`.
      apiKey(),
    ],
  };
}
