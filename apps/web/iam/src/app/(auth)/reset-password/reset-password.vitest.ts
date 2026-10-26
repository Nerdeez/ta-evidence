import { type ErrorResponse, errorResponse } from '@ta/api';

import type { ResetPasswordValues } from './reset-password.schema';

/** Stub used when Vite redirects `./reset-password.action` here during browser tests. */
export async function resetPasswordAction(_values: ResetPasswordValues): Promise<ErrorResponse> {
  return errorResponse([new Error('Password reset is not available in component tests.')], {
    code: 'unavailable',
  });
}

export function vitestPlugins() {
  return [
    {
      name: 'resolve-reset-password-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('reset-password')) {
          return null;
        }
        if (
          source !== './reset-password.action' &&
          !source.endsWith('/reset-password/reset-password.action')
        ) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}reset-password.vitest.ts`;
      },
    },
  ];
}
