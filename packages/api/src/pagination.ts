/**
 * Limit/offset paging for HTTP list endpoints (query params, response `meta`, SQL offset).
 *
 * @see https://orm.drizzle.team/docs/guides/limit-offset-pagination
 */

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 50;
export const MAX_LIMIT = 100;

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PageParams = {
  page: number;
  limit: number;
};

/** SQL OFFSET from 1-based page and page size: `(page - 1) * limit`. */
export function pageToOffset(page: number, limit: number): number;
export function pageToOffset(params: PageParams): number;
export function pageToOffset(pageOrParams: number | PageParams, limit?: number): number {
  if (typeof pageOrParams === 'object') {
    return (pageOrParams.page - 1) * pageOrParams.limit;
  }
  if (limit === undefined) {
    throw new Error('limit is required when page is a number');
  }
  return (pageOrParams - 1) * limit;
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);
  return { page, limit, total, totalPages };
}

/** Parse `page` query param (1-based). Uses {@link DEFAULT_PAGE} when omitted. */
export function parsePage(value: unknown): number {
  if (value === undefined || value === '') {
    return DEFAULT_PAGE;
  }
  const page = Number.parseInt(String(value), 10);
  if (!Number.isFinite(page) || page < 1) {
    throw new Error('page must be a positive integer');
  }
  return page;
}

/** Parse `limit` query param. Uses {@link DEFAULT_LIMIT} and {@link MAX_LIMIT} when omitted. */
export function parseLimit(value: unknown): number {
  if (value === undefined || value === '') {
    return DEFAULT_LIMIT;
  }
  const limit = Number.parseInt(String(value), 10);
  if (!Number.isFinite(limit) || limit < 1 || limit > MAX_LIMIT) {
    throw new Error(`limit must be between 1 and ${MAX_LIMIT}`);
  }
  return limit;
}
