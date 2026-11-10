import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from 'dotenv';

import { findMonorepoRoot } from './root.js';

/** Loads repository root `.env` walking up from the calling module’s directory (`import.meta.url`). */
export function loadRepoDotenvFromModule(moduleUrl: string): void {
  loadRepoDotenv(dirname(fileURLToPath(moduleUrl)));
}

/** Loads repository root `.env` when the file exists (does not override existing `process.env`). */
export function loadRepoDotenv(startDir: string): void {
  const repoRoot = findMonorepoRoot(startDir);
  if (!repoRoot) {
    return;
  }
  config({ path: resolve(repoRoot, '.env') });
}
