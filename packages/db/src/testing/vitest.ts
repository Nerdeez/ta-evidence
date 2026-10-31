import { afterEach, beforeEach } from 'vitest';

import { resetDbForTesting, setDbForTesting } from '../client.js';
import { createPgLiteTestDb, type PgLiteTestContext } from './pglite.js';

export type PgLiteTestDbFixture = {
  /** Drizzle instance for the current test; available after `beforeEach`. */
  get db(): PgLiteTestContext['db'];
};

/**
 * Register Vitest hooks for an in-memory PGlite database wired to `db` from `@ta/db`.
 *
 * Call once at the top of a `describe` block:
 *
 * ```ts
 * describe('my routes', () => {
 *   const pglite = usePgLiteTestDb();
 *   // use pglite.db.insert(...) inside tests (not `const { db } = ...`)
 * });
 * ```
 */
export function usePgLiteTestDb(): PgLiteTestDbFixture {
  const state: { db?: PgLiteTestContext['db'] } = {};

  beforeEach(async () => {
    const { db, close } = await createPgLiteTestDb();
    state.db = db;
    setDbForTesting(db, close);
  });

  afterEach(async () => {
    await resetDbForTesting();
    delete state.db;
  });

  return {
    get db() {
      if (state.db === undefined) {
        throw new Error('usePgLiteTestDb: db is only available inside a test (after beforeEach)');
      }
      return state.db;
    },
  };
}
