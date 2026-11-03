import type { SchemaCheck } from '@better-auth/core/db/internal';
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import type { $strip } from 'zod/v4/core';

import { createAuthOptions } from './config.js';

export { getAuthBaseUrl } from './config.js';

const baseOptions = createAuthOptions();

/** Better Auth instance for Next.js apps (`@ta/auth/next`, e.g. `@ta/web-iam`). */
export const auth = betterAuth({
  ...baseOptions,
  plugins: [...(baseOptions.plugins ?? []), nextCookies()],
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];

type _PortableAuthSchemaCheck = SchemaCheck;
type _PortableZodStrip = $strip;
