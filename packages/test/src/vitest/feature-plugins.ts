import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

type FeatureVitestModule = {
  vitestPlugins?: () => unknown[];
};

function findVitestFiles(directory: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...findVitestFiles(fullPath));
      continue;
    }
    if (entry.name.endsWith('.vitest.ts')) {
      files.push(fullPath);
    }
  }

  return files;
}

/** @internal Used by {@link createVitestConfig} in `vitest/ui.ts`. */
export async function loadFeatureVitestPlugins(srcDirectory: string): Promise<unknown[]> {
  const plugins: unknown[] = [];

  for (const file of findVitestFiles(srcDirectory)) {
    const module = (await import(pathToFileURL(file).href)) as FeatureVitestModule;
    if (module.vitestPlugins) {
      plugins.push(...module.vitestPlugins());
    }
  }

  return plugins;
}
