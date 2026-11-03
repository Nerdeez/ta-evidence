import { verifyApiKeyFromHeaders } from '@ta/auth/api-key';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export type RegisterApiKeyAuthOptions = {
  /** URL prefix that requires a valid `x-api-key` (default `/api/v1/`). */
  pathPrefix?: string;
};

function unauthorized(reply: FastifyReply, message: string) {
  return reply.code(401).send({ error: { message } });
}

async function verifyApiKeyRequest(request: FastifyRequest, reply: FastifyReply): Promise<boolean> {
  const result = await verifyApiKeyFromHeaders(request.headers);
  if (!result.ok) {
    await unauthorized(reply, result.message);
    return false;
  }
  return true;
}

/**
 * Require Better Auth API keys on routes under `pathPrefix` (stateless; uses `x-api-key`).
 */
export async function registerApiKeyAuth(
  fastify: FastifyInstance,
  options?: RegisterApiKeyAuthOptions,
): Promise<void> {
  const pathPrefix = options?.pathPrefix ?? '/api/v1/';

  fastify.addHook('onRequest', async (request, reply) => {
    if (!request.url.startsWith(pathPrefix)) {
      return;
    }
    const ok = await verifyApiKeyRequest(request, reply);
    if (!ok) {
      return reply;
    }
  });
}
