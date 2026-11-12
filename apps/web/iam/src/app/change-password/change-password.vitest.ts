import { type ErrorResponse, errorResponse } from '@ta/api/error';

import type { ChangePasswordValues } from './change-password.schema';

/** Stub used when Vite redirects `./change-password.action` here during browser tests. */
export async function changePasswordAction(
  _values: ChangePasswordValues,
): Promise<ErrorResponse> {
  return errorResponse([new Error('Change password is not available in component tests.')], {
    code: 'unavailable',
  });
}

export function vitestPlugins() {
  return [
    {
      name: 'resolve-change-password-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('change-password')) {
          return null;
        }
        if (
          source !== './change-password.action' &&
          !source.endsWith('/change-password/change-password.action')
        ) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}change-password.vitest.ts`;
      },
    },
  ];
}
