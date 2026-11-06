import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { config, parse } from 'dotenv';

function findMonorepoRoot(startDir: string): string {
  let dir = startDir;
  while (true) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      throw new Error(
        'Could not find monorepo root (pnpm-workspace.yaml). Run tests from the TA Evidence workspace.',
      );
    }
    dir = parent;
  }
}

/** Loads the repository root `.env` (does not override variables already in `process.env`). */
export function loadMonorepoDotenv(packageRoot: string): void {
  const repoRoot = findMonorepoRoot(packageRoot);
  config({ path: resolve(repoRoot, '.env') });
}

/**
 * Loads optional Playwright / e2e env files at the app root (next to `playwright.config.ts`):
 * - `.env.e2e` — committed defaults (e.g. local dev URL)
 * - `.env.e2e.local` — overrides for a machine or branch (gitignored)
 *
 * Precedence: variables already in `process.env` (shell / CI) win; then `.env.e2e.local`;
 * then `.env.e2e`.
 */
export function loadAppE2eDotenv(appRoot: string): void {
  const e2e = resolve(appRoot, '.env.e2e');
  const e2eLocal = resolve(appRoot, '.env.e2e.local');

  const fromFile: Record<string, string> = {};

  if (existsSync(e2e)) {
    Object.assign(fromFile, parse(readFileSync(e2e, 'utf8')));
  }
  if (existsSync(e2eLocal)) {
    Object.assign(fromFile, parse(readFileSync(e2eLocal, 'utf8')));
  }

  for (const [key, value] of Object.entries(fromFile)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
