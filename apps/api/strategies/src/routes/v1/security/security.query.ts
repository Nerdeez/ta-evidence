import { parseLimit, parsePage } from '@ta/api';

export type ListSecuritiesQuery = {
  ticker?: string;
  page: number;
  limit: number;
};

export function parseListSecuritiesQuery(query: Record<string, unknown>): ListSecuritiesQuery {
  const page = parsePage(query['page']);
  const limit = parseLimit(query['limit']);

  const ticker = optionalString(query['ticker']);

  const parsed: ListSecuritiesQuery = { page, limit };

  if (ticker !== undefined) {
    parsed.ticker = ticker;
  }

  return parsed;
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === '') {
    return undefined;
  }
  return String(value);
}
