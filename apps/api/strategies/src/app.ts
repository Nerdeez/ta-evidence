import { closeDb } from '@ta/db';
import Fastify from 'fastify';
import { registerSecurityRoutes } from './routes/v1/security/security.route.js';

export function buildApp() {
  const fastify = Fastify({
    logger: true,
  });

  fastify.get('/health', async () => {
    return { status: 'ok' };
  });

  void registerSecurityRoutes(fastify);

  fastify.addHook('onClose', async () => {
    await closeDb();
  });

  return fastify;
}
