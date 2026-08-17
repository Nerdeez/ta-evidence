import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(packageDir, '../../');

config({ path: resolve(repoRoot, '.env') });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Copy .env.example to .env at the repository root.');
}

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/schema/index.ts',
  out: './drizzle',
  dbCredentials: {
    url: databaseUrl,
  },
});
