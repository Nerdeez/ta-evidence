import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** Walks up from `startDir` until `pnpm-workspace.yaml` is found. */
export function findMonorepoRoot(startDir: string): string | undefined {
  let dir = startDir;
  while (true) {
    if (existsSync(resolve(dir, 'pnpm-workspace.yaml'))) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) {
      return undefined;
    }
    dir = parent;
  }
}

export function requireMonorepoRoot(startDir: string): string {
  const root = findMonorepoRoot(startDir);
  if (!root) {
    throw new Error(
      'Could not find monorepo root (pnpm-workspace.yaml). Run from the TA Evidence workspace.',
    );
  }
  return root;
}
