import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
// Same depth from `src/vitest` and `dist/vitest`.
const uiPackageRoot = path.resolve(dirname, '../../../ui');

const baseUiImportPattern = /['"](@base-ui\/react\/[\w-]+)['"]/g;

function findSourceFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findSourceFiles(fullPath));
      continue;
    }
    if (/\.tsx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

function findTaUiSubpaths(): string[] {
  const { exports } = JSON.parse(
    readFileSync(path.join(uiPackageRoot, 'package.json'), 'utf8'),
  ) as {
    exports: Record<string, unknown>;
  };

  return Object.entries(exports)
    .filter(([, target]) => typeof target === 'object' && target !== null && 'import' in target)
    .map(([subpath]) => `@ta/ui${subpath.slice(1)}`);
}

function findBaseUiSubpaths(): string[] {
  const subpaths = new Set<string>();

  for (const file of findSourceFiles(path.join(uiPackageRoot, 'src'))) {
    for (const [, subpath] of readFileSync(file, 'utf8').matchAll(baseUiImportPattern)) {
      if (subpath) {
        subpaths.add(subpath);
      }
    }
  }

  // Apps don't depend on `@base-ui/react` directly, so resolve it through `@ta/ui`.
  return [...subpaths].sort().map((subpath) => `@ta/ui > ${subpath}`);
}

/**
 * `@ta/ui` component entry points (from its `exports` map) and the `@base-ui/react/*` subpaths its source imports,
 * so new components are pre-bundled without editing the Vitest config.
 *
 * @internal Used by {@link createVitestConfig} in `vitest/ui.ts`.
 */
export function findTaUiOptimizeDeps(): string[] {
  return [...findTaUiSubpaths(), ...findBaseUiSubpaths()];
}
