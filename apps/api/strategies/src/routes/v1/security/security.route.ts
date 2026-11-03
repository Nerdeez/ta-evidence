import type { FastifyInstance } from 'fastify';
import { parseListSecuritiesQuery } from './security.query.js';
import { getSecurityById, listSecurities } from './security.service.js';

export async function registerSecurityRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get('/api/v1/security', async (request, reply) => {
    let query: ReturnType<typeof parseListSecuritiesQuery>;
    try {
      query = parseListSecuritiesQuery(request.query as Record<string, unknown>);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid query';
      return reply.code(400).send({ error: { message } });
    }

    return await listSecurities(query);
  });

  fastify.get<{ Params: { id: string } }>('/api/v1/security/:id(^\\d+)', async (request, reply) => {
    const id = Number.parseInt(request.params.id, 10);
    const security = await getSecurityById(id);
    if (!security) {
      return reply.code(404).send({ error: { message: 'Security not found' } });
    }
    return { data: security };
  });
}
