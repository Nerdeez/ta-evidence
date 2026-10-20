import { type ErrorResponse, errorResponse } from '@ta/api';

import type { LoginValues } from './login.schema';

/** Stub used when Vite redirects `./login.action` here during browser tests. */
export async function loginAction(_values: LoginValues): Promise<ErrorResponse> {
  return errorResponse([new Error('Sign in is not available in component tests.')], {
    code: 'unavailable',
  });
}

/**
 * Vite plugins for login browser tests.
 *
 * `vi.mock` does not stop Vite from pre-bundling `./login.action` (Better Auth, DB, etc.).
 * This redirect keeps the stub in this file; picked up via `featurePluginsSrc` in `vitest.config.ts`.
 */
export function vitestPlugins() {
  return [
    {
      name: 'resolve-login-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('login')) {
          return null;
        }
        if (source !== './login.action' && !source.endsWith('/login/login.action')) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}login.vitest.ts`;
      },
    },
  ];
}
