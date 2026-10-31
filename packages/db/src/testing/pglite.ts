import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PGlite } from '@electric-sql/pglite';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from '../schema/index.js';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const baselineMigrationPath = resolve(packageRoot, 'drizzle/0000_curved_boomer.sql');

function splitMigrationStatements(sql: string): string[] {
  return sql
    .split(/^--> statement-breakpoint$/m)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

export type PgLiteTestContext = {
  db: NodePgDatabase<typeof schema>;
  close: () => Promise<void>;
};

/** In-memory Postgres (PGlite) with Drizzle and the baseline market-data migration applied. */
export async function createPgLiteTestDb(): Promise<PgLiteTestContext> {
  const client = new PGlite();
  const migrationSql = readFileSync(baselineMigrationPath, 'utf8');

  for (const statement of splitMigrationStatements(migrationSql)) {
    await client.exec(statement);
  }

  const db = drizzle(client, { schema }) as unknown as NodePgDatabase<typeof schema>;

  return {
    db,
    close: async () => {
      await client.close();
    },
  };
}
