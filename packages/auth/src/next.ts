/**
 * Public entry for `@ta/auth/next` (Next.js apps, e.g. `@ta/web-iam`).
 * Better Auth lives under `better-auth/`; add other Next-only helpers alongside over time.
 */
export { getAuthBaseUrl } from './better-auth/config.js';
export { type AuthSession, type AuthUser, auth } from './better-auth/next.auth.js';
export {
  getServerSession,
  type RequireSessionOptions,
  requireSession,
} from './better-auth/session.js';
