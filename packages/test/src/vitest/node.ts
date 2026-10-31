import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const defaultNodeTestConfig = {
  environment: 'node' as const,
  include: ['src/**/*.test.ts'],
  fileParallelism: false,
};

/**
 * Options for {@link createNodeVitestConfig}.
 */
export type CreateNodeVitestConfigOptions = {
  /** Absolute path to the package root (directory containing `vitest.config.ts`). */
  packageRoot: string;
  /** Merged into the `test` block (e.g. override `include` or `fileParallelism`). */
  test?: Partial<typeof defaultNodeTestConfig>;
};

/**
 * Vitest config for **Node** tests (API apps, libraries with PGlite, `fastify.inject`, etc.).
 *
 * Applies `vite-tsconfig-paths` so `tsconfig.json` `paths` (e.g. `@/*`) work at runtime without
 * duplicating `resolve.alias` in each app.
 *
 * **Convention (per package)**
 * - `vitest.config.ts` at the package root calling `createNodeVitestConfig({ packageRoot })`
 * - `tsconfig.json` with `"paths": { "@/*": ["./src/*"] }` when using `@/` imports in tests
 * - `devDependencies`: `@ta/test`, `vitest`
 *
 * @example
 * ```ts
 * import path from 'node:path';
 * import { fileURLToPath } from 'node:url';
 * import { createNodeVitestConfig } from '@ta/test/vitest/node';
 *
 * const packageRoot = path.dirname(fileURLToPath(import.meta.url));
 *
 * export default createNodeVitestConfig({ packageRoot });
 * ```
 */
export function createNodeVitestConfig(options: CreateNodeVitestConfigOptions) {
  return defineConfig({
    plugins: [tsconfigPaths()],
    root: options.packageRoot,
    test: {
      ...defaultNodeTestConfig,
      ...options.test,
    },
  });
}
