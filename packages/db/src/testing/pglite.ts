import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PGlite } from '@electric-sql/pglite';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/pglite';

import * as schema from '../schema/index.js';

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const drizzleDir = resolve(packageRoot, 'drizzle');
const journalPath = resolve(packageRoot, 'drizzle/meta/_journal.json');

function splitMigrationStatements(sql: string): string[] {
  return sql
    .split(/^--> statement-breakpoint$/m)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

function listMigrationPaths(): string[] {
  const journal = JSON.parse(readFileSync(journalPath, 'utf8')) as {
    entries: { tag: string }[];
  };
  return journal.entries.map((entry) => resolve(drizzleDir, `${entry.tag}.sql`));
}

export type PgLiteTestContext = {
  db: NodePgDatabase<typeof schema>;
  close: () => Promise<void>;
};

async function applyMigrationFile(client: PGlite, migrationPath: string): Promise<void> {
  const migrationSql = readFileSync(migrationPath, 'utf8');
  for (const statement of splitMigrationStatements(migrationSql)) {
    await client.exec(statement);
  }
}

/** In-memory Postgres (PGlite) with Drizzle and all Drizzle journal migrations applied. */
export async function createPgLiteTestDb(): Promise<PgLiteTestContext> {
  const client = new PGlite();

  for (const migrationPath of listMigrationPaths()) {
    await applyMigrationFile(client, migrationPath);
  }

  const db = drizzle(client, { schema }) as unknown as NodePgDatabase<typeof schema>;

  return {
    db,
    close: async () => {
      await client.close();
    },
  };
}
