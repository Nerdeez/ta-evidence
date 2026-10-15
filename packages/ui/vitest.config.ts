import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createVitestConfig } from '@ta/test/vitest/ui';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default createVitestConfig({ appRoot });
