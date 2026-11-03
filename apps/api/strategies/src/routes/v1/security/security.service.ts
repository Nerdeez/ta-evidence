import { buildPaginationMeta, type PaginationMeta, pageToOffset } from '@ta/api';
import { db, securities } from '@ta/db';
import { and, asc, count, eq, getTableColumns, type SQL } from 'drizzle-orm';
import type { ListSecuritiesQuery } from './security.query.js';

/** Internal-only securities columns — omitted from GET /api/v1/security JSON. */
const SECURITY_API_EXCLUDED_COLUMNS =
  [] as const satisfies readonly (keyof typeof securities.$inferSelect)[];

type SecurityDto = Omit<
  typeof securities.$inferSelect,
  (typeof SECURITY_API_EXCLUDED_COLUMNS)[number]
>;

export type { SecurityDto };

function buildSecurityPublicSelection() {
  const columns = getTableColumns(securities);
  if (SECURITY_API_EXCLUDED_COLUMNS.length === 0) {
    return columns;
  }

  const excluded = new Set<string>(SECURITY_API_EXCLUDED_COLUMNS);
  const selection: Record<string, (typeof columns)[keyof typeof columns]> = {};

  for (const [key, column] of Object.entries(columns)) {
    if (!excluded.has(key)) {
      selection[key] = column;
    }
  }

  return selection as typeof columns;
}

const securityPublicSelection = buildSecurityPublicSelection();

function buildListFilters(query: ListSecuritiesQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.ticker !== undefined) {
    conditions.push(eq(securities.ticker, query.ticker));
  }

  if (conditions.length === 0) {
    return undefined;
  }

  return and(...conditions);
}

export async function listSecurities(
  query: ListSecuritiesQuery,
): Promise<{ data: SecurityDto[]; meta: PaginationMeta }> {
  const where = buildListFilters(query);
  const offset = pageToOffset(query.page, query.limit);

  const [countRow] = await db.select({ total: count() }).from(securities).where(where);

  const total = countRow?.total ?? 0;

  const data = await db
    .select(securityPublicSelection)
    .from(securities)
    .where(where)
    .orderBy(asc(securities.id))
    .limit(query.limit)
    .offset(offset);

  return {
    data,
    meta: buildPaginationMeta(query.page, query.limit, total),
  };
}

export async function getSecurityById(id: number): Promise<SecurityDto | null> {
  const [row] = await db
    .select(securityPublicSelection)
    .from(securities)
    .where(eq(securities.id, id))
    .limit(1);

  return row ?? null;
}
