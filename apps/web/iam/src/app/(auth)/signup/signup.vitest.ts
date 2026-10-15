import type { SignUpActionResult } from './signup.action';
import type { SignUpValues } from './signup.schema';

/** Stub used when Vite redirects `./signup.action` here during browser tests. */
export async function signUpAction(_values: SignUpValues): Promise<SignUpActionResult> {
  return { ok: false, error: 'Sign up is not available in component tests.' };
}

/**
 * Vite plugins for signup browser tests.
 *
 * `vi.mock` does not stop Vite from pre-bundling `./signup.action` (Better Auth, DB, etc.).
 * This redirect keeps the stub in this file; picked up via `featurePluginsSrc` in `vitest.config.ts`.
 */
export function vitestPlugins() {
  return [
    {
      name: 'resolve-signup-action-mock',
      enforce: 'pre' as const,
      resolveId(source: string, importer?: string) {
        if (!importer?.includes('signup')) {
          return null;
        }
        if (source !== './signup.action' && !source.endsWith('/signup/signup.action')) {
          return null;
        }
        const separator = importer.includes('\\') ? '\\' : '/';
        const dir = importer.slice(0, importer.lastIndexOf(separator) + 1);
        return `${dir}signup.vitest.ts`;
      },
    },
  ];
}
