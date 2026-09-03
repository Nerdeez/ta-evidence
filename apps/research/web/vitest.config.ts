import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createUiVitestConfig } from '@ta/test/vitest/ui';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default createUiVitestConfig({
  setupFiles: ['./vitest.setup.ts'],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
    },
  },
});
