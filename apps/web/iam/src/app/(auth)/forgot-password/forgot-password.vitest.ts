import { type ErrorResponse, errorResponse } from '@ta/api';

import type { ForgotPasswordValues } from './forgot-password.schema';

/** Stub used when Vite redirects `./forgot-password.action` here during browser tests. */
export async function forgotPasswordAction(
  _values: ForgotPasswordValues,
): Promise<ErrorResponse> {
  return errorResponse([new Error('Password reset is not available in component tests.')], {
    code: 'unavailable',
  });
}

export function vitestPlugins() {
  return [
    {
      name: 'resolve-forgot-password-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('forgot-password')) {
          return null;
        }
        if (
          source !== './forgot-password.action' &&
          !source.endsWith('/forgot-password/forgot-password.action')
        ) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}forgot-password.vitest.ts`;
      },
    },
  ];
}
