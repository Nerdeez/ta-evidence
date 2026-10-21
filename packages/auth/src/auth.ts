import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from '@ta/db';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value) {
    return value;
  }
  // `next build` loads API route modules when collecting page data; secrets are runtime-only.
  if (process.env['NEXT_PHASE'] === 'phase-production-build') {
    return 'build-time-placeholder-not-used-at-runtime-32';
  }
  throw new Error(`${name} is not set. See .env.example at the repository root.`);
}

/** Public origin of `@ta/web-iam` (Better Auth handler at `/api/auth/*`). */
function getAuthBaseUrl(): string {
  return process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3001';
}

const webStrategiesUrl = process.env['NEXT_PUBLIC_WEB_STRATEGIES_URL'] ?? 'http://localhost:3000';

export const auth = betterAuth({
  secret: requireEnv('BETTER_AUTH_SECRET'),
  baseURL: getAuthBaseUrl(),
  database: drizzleAdapter(db, {
    provider: 'pg',
    transaction: true,
  }),
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      // Replace with a transactional provider in production (see Better Auth email docs).
      console.log(`[better-auth] Verify email for ${user.email}: ${url}`);
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    revokeSessionsOnPasswordReset: true,
    sendResetPassword: async ({ user, url, token }) => {
      // TODO: Send reset email when transactional email is connected (see Better Auth email docs).
      void user;
      void url;
      void token;
    },
  },
  trustedOrigins: [webStrategiesUrl, getAuthBaseUrl()],
  plugins: [nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];
