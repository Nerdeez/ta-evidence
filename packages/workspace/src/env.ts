import { resolve } from 'node:path';

import { config } from 'dotenv';

import { findMonorepoRoot } from './root.js';

/** Loads repository root `.env` when the file exists (does not override existing `process.env`). */
export function loadRepoDotenv(startDir: string): void {
  const repoRoot = findMonorepoRoot(startDir);
  if (!repoRoot) {
    return;
  }
  config({ path: resolve(repoRoot, '.env') });
}
