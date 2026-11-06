import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { createPlaywrightConfig } from '@ta/test/playwright';

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default createPlaywrightConfig({ appRoot });
