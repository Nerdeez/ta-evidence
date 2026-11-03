import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createNodeVitestConfig } from '@ta/test/vitest/node';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));

export default createNodeVitestConfig({ packageRoot });
