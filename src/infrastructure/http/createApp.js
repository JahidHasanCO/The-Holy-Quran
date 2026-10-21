import express from 'express';
import compression from 'compression';
import { quranRoutes } from './routes/quranRoutes.js';
import { errorHandler, notFoundHandler } from './errorHandler.js';

export function createApp({ useCases, publicDir }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api', quranRoutes(useCases), notFoundHandler);
  app.use(express.static(publicDir));

  app.use(errorHandler);
  return app;
}
