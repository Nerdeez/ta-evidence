import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { config } from 'dotenv';

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
