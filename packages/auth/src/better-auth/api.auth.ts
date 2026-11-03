import type { SchemaCheck } from '@better-auth/core/db/internal';
import { betterAuth } from 'better-auth';
import type { $strip } from 'zod/v4/core';

import { createAuthOptions } from './config.js';

/** Better Auth instance for Node API apps (`@ta/auth`). */
export const auth = betterAuth(createAuthOptions());

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = AuthSession['user'];

// Referenced so `auth` declaration emit stays portable with the API Key plugin (TS2883).
type _PortableAuthSchemaCheck = SchemaCheck;
type _PortableZodStrip = $strip;
