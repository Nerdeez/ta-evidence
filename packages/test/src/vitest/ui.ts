import path from 'node:path';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig, mergeConfig } from 'vitest/config';

import { loadFeatureVitestPlugins } from './feature-plugins.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const nextImageStubPath = path.resolve(dirname, 'next-image.js');

const defaultOptimizeDepsInclude = [
  'vitest-browser-react',
  'react',
  'react-dom',
  'next/link',
  '@tanstack/react-form',
  'zod',
  'lucide-react',
  '@ta/ui/button',
  '@ta/ui/input',
  '@ta/ui/field',
  '@ta/ui/card',
];

/**
 * Options for {@link createVitestConfig}.
 */
export type CreateVitestConfigOptions = {
  /**
   * Absolute path to the package root (directory containing `vitest.config.ts`).
   *
   * Sets `public/`, `src/` as the `@` alias, `vitest.setup.ts`, and scans `src` for colocated `*.vitest.ts` plugin files.
   */
  appRoot: string;
};

function createBaseVitestConfig(appRoot: string) {
  const srcDir = path.join(appRoot, 'src');

  return defineConfig({
    publicDir: path.join(appRoot, 'public'),
    define: {
      'process.env.NODE_ENV': JSON.stringify('test'),
    },
    resolve: {
      dedupe: ['react', 'react-dom'],
      alias: {
        'next/image': nextImageStubPath,
        '@': srcDir,
      },
    },
    ssr: {
      noExternal: ['@ta/ui', '@ta/theme'],
    },
    plugins: [react(), tailwindcss()],
    test: {
      setupFiles: ['./vitest.setup.ts'],
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        screenshotFailures: false,
        instances: [{ browser: 'chromium' }],
        isolate: false,
      },
    },
  });
}

/**
 * Vitest + Vite config for **browser** component tests (Next apps and `@ta/ui`).
 *
 * **Convention (per package)**
 * - `vitest.config.ts` and `vitest.setup.ts` at the package root
 * - `public/`, `src/` with `@/` → `src/`, `process.env.NODE_ENV` = `"test"`
 * - Colocated `*.vitest.ts` under `src` may export `vitestPlugins()` (e.g. stub server actions for browser tests)
 *
 * **App setup**
 * - `devDependencies`: `@ta/test`, `vitest`, `vitest-browser-react`
 * - `scripts`: `test` → `vitest run`, `test:browser` → `vitest --browser.headless=false`
 * - One-time: `pnpm --filter @ta/test setup-browsers`
 *
 * @example
 * ```ts
 * import path from 'node:path';
 * import { fileURLToPath } from 'node:url';
 * import { createVitestConfig } from '@ta/test/vitest/ui';
 *
 * const appRoot = path.dirname(fileURLToPath(import.meta.url));
 *
 * export default createVitestConfig({ appRoot });
 * ```
 */
export async function createVitestConfig(options: CreateVitestConfigOptions) {
  const srcDir = path.join(options.appRoot, 'src');
  const base = createBaseVitestConfig(options.appRoot);

  const featurePlugins = await loadFeatureVitestPlugins(srcDir);

  const config = mergeConfig(base, {
    optimizeDeps: {
      holdUntilCrawlEnd: true,
      include: defaultOptimizeDepsInclude,
    },
  });

  if (featurePlugins.length === 0) {
    return config;
  }

  return mergeConfig(config, {
    plugins: [...(config['plugins'] ?? []), ...featurePlugins],
  });
}
