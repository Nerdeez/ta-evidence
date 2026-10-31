import { securities } from '@ta/db';
import { usePgLiteTestDb } from '@ta/db/testing';
import type { FastifyInstance } from 'fastify';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildApp } from '@/app.js';

describe('security routes', () => {
  const pglite = usePgLiteTestDb();
  let app: FastifyInstance;

  beforeEach(async () => {
    app = buildApp();
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/v1/security returns an empty paginated list', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/security',
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: [],
      meta: { page: 1, limit: 50, total: 0, totalPages: 0 },
    });
  });

  it('GET /api/v1/security filters by ticker', async () => {
    await pglite.db.insert(securities).values([
      { ticker: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.' },
      { ticker: 'MSFT', exchange: 'NASDAQ', name: 'Microsoft Corporation' },
    ]);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/security?ticker=AAPL',
    });

    expect(response.statusCode).toBe(200);
    const body = response.json() as {
      data: { ticker: string }[];
      meta: { total: number };
    };
    expect(body.meta.total).toBe(1);
    expect(body.data).toHaveLength(1);
    expect(body.data[0]?.ticker).toBe('AAPL');
  });

  it('GET /api/v1/security rejects invalid page', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/security?page=0',
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toEqual({
      error: { message: 'page must be a positive integer' },
    });
  });

  it('GET /api/v1/security/:id returns one security', async () => {
    const [row] = await pglite.db
      .insert(securities)
      .values({ ticker: 'AAPL', exchange: 'NASDAQ', name: 'Apple Inc.' })
      .returning();

    const response = await app.inject({
      method: 'GET',
      url: `/api/v1/security/${row?.id}`,
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      data: {
        id: row?.id,
        ticker: 'AAPL',
        exchange: 'NASDAQ',
        name: 'Apple Inc.',
        currency: 'USD',
        assetType: 'equity',
      },
    });
  });

  it('GET /api/v1/security/:id returns 404 when missing', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/security/999',
    });

    expect(response.statusCode).toBe(404);
    expect(response.json()).toEqual({ error: { message: 'Security not found' } });
  });

  it('GET /api/v1/security/:id does not match non-numeric ids', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/security/not-an-id',
    });

    expect(response.statusCode).toBe(404);
  });
});
