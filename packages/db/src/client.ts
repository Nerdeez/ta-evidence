import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from 'dotenv';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema/index.js';

const packageDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(packageDir, '../../../');

config({ path: resolve(repoRoot, '.env') });

let pool: pg.Pool | undefined;
let drizzleInstance: NodePgDatabase<typeof schema> | undefined;

/** @internal Test harness — inject a Drizzle instance (e.g. PGlite). Import from `@ta/db/testing`. */
let testDb: NodePgDatabase<typeof schema> | undefined;
let testDbClose: (() => Promise<void>) | undefined;

function getDatabaseUrl(): string {
  const databaseUrl = process.env['DATABASE_URL'];
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set. Copy .env.example to .env at the repository root.');
  }
  return databaseUrl;
}

function getDbInstance(): NodePgDatabase<typeof schema> {
  if (testDb) {
    return testDb;
  }
  if (!drizzleInstance) {
    pool = new pg.Pool({ connectionString: getDatabaseUrl() });
    drizzleInstance = drizzle(pool, { schema });
  }
  return drizzleInstance;
}

/** @internal */
export function setDbForTesting(
  instance: NodePgDatabase<typeof schema>,
  close?: () => Promise<void>,
): void {
  testDb = instance;
  testDbClose = close;
}

/** @internal */
export async function resetDbForTesting(): Promise<void> {
  if (testDbClose) {
    await testDbClose();
  }
  testDb = undefined;
  testDbClose = undefined;
}

/** Lazily connects on first use so Next.js can import routes during `next build` without `DATABASE_URL`. */
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_target, prop, receiver) {
    const instance = getDbInstance();
    const value = Reflect.get(instance as object, prop, receiver);
    if (typeof value === 'function') {
      return (value as (...args: unknown[]) => unknown).bind(instance);
    }
    return value;
  },
});

export async function closeDb(): Promise<void> {
  if (testDbClose) {
    await testDbClose();
    testDb = undefined;
    testDbClose = undefined;
    return;
  }
  if (pool) {
    await pool.end();
    pool = undefined;
    drizzleInstance = undefined;
  }
}
