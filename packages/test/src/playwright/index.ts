import { defineConfig, devices } from '@playwright/test';
import { loadAppE2eDotenv, loadMonorepoDotenv } from '../dotenv.js';

/** Env var for the app-under-test origin (no trailing slash). */
export const E2E_BASE_URL_ENV = 'E2E_BASE_URL';

function resolveE2eBaseURL(): string {
  const raw = process.env[E2E_BASE_URL_ENV]?.trim();
  if (!raw) {
    throw new Error(
      `Set ${E2E_BASE_URL_ENV} (export in CI, or add apps/<name>/.env.e2e; use .env.e2e.local for gitignored overrides).`,
    );
  }
  return raw.replace(/\/$/, '');
}

/**
 * Options for {@link createPlaywrightConfig}.
 */
export type CreatePlaywrightConfigOptions = {
  /**
   * Absolute path to the app root (directory containing `playwright.config.ts`).
   *
   * Tests are collected from `src/`.
   */
  appRoot: string;
};

/**
 * Playwright config for **e2e** tests of the web apps.
 *
 * **Convention (per app)**
 * - `playwright.config.ts` at the app root
 * - Colocated `*.e2e.ts` files under `src`
 * - Optional committed `E2E_BASE_URL` in `.env.e2e`; optional gitignored overrides in `.env.e2e.local`
 * - Start the app yourself (e.g. `pnpm dev` in that app) before `playwright test` when targeting localhost; this config does not spawn a server
 *
 * **App setup**
 * - `devDependencies`: `@ta/test`, `@playwright/test`
 * - `scripts`: `test:e2e` → `playwright test`
 * - One-time: `pnpm --filter <app> exec playwright install chromium`
 *
 * @example
 * ```ts
 * import path from 'node:path';
 * import { fileURLToPath } from 'node:url';
 * import { createPlaywrightConfig } from '@ta/test/playwright';
 *
 * const appRoot = path.dirname(fileURLToPath(import.meta.url));
 *
 * export default createPlaywrightConfig({ appRoot });
 * ```
 */
export function createPlaywrightConfig(options: CreatePlaywrightConfigOptions) {
  loadMonorepoDotenv(options.appRoot);
  loadAppE2eDotenv(options.appRoot);

  const isCI = Boolean(process.env['CI']);
  const baseURL = resolveE2eBaseURL();

  return defineConfig({
    testDir: `${options.appRoot}/src`,
    testMatch: '**/*.e2e.ts',
    // Traces/screenshots/videos; keep names in sync with repo-root `.gitignore`.
    outputDir: `${options.appRoot}/test-results`,
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 2 : 0,
    ...(isCI && { workers: 1 }),
    reporter: [['html', { outputFolder: `${options.appRoot}/playwright-report`, open: 'never' }]],
    use: {
      baseURL,
      trace: 'on-first-retry',
    },
    projects: [
      {
        name: 'chromium',
        use: { ...devices['Desktop Chrome'] },
      },
    ],
  });
}
