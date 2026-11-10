import nextEnv from '@next/env';
import { findMonorepoRoot } from '@ta/workspace';
import type { NextConfig } from 'next';

export type CreateNextConfigOptions = NextConfig;

/**
 * Loads repo-root `.env*` for local dev when files exist. Walks up from `process.cwd()` (the app
 * when you `pnpm --filter <app> dev`). Deployed builds rely on env vars; missing files are ignored.
 */
function loadMonorepoEnv(): void {
  const repoRoot = findMonorepoRoot(process.cwd());
  if (!repoRoot) {
    return;
  }

  const dev = process.env['NODE_ENV'] !== 'production';
  nextEnv.loadEnvConfig(repoRoot, dev);
}

const defaultTranspilePackages = ['@ta/ui'] as const;

let monorepoEnvLoaded = false;

/** Loads repo-root env when present, then returns your `NextConfig`. */
export function createNextConfig(options: CreateNextConfigOptions = {}): NextConfig {
  if (!monorepoEnvLoaded) {
    loadMonorepoEnv();
    monorepoEnvLoaded = true;
  }

  const { transpilePackages, ...rest } = options;

  return {
    ...rest,
    transpilePackages: [...new Set([...defaultTranspilePackages, ...(transpilePackages ?? [])])],
  };
}
