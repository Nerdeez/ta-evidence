import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { db } from '@ta/db';
import { betterAuth } from 'better-auth';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set. See .env.example at the repository root.`);
  }
  return value;
}

/** Public origin of `@ta/iam-web` (Better Auth handler at `/api/auth/*`). */
function getAuthBaseUrl(): string {
  return process.env['BETTER_AUTH_URL'] ?? 'http://localhost:3001';
}

const researchWebUrl = process.env['NEXT_PUBLIC_RESEARCH_WEB_URL'] ?? 'http://localhost:3000';

export const auth = betterAuth({
  secret: requireEnv('BETTER_AUTH_SECRET'),
  baseURL: getAuthBaseUrl(),
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [researchWebUrl, getAuthBaseUrl()],
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];
