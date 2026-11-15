import express from 'express';
import compression from 'compression';
import { quranRoutes } from './routes/quranRoutes.js';
import { errorHandler, notFoundHandler } from './errorHandler.js';

export function createApp({ useCases, publicDir, firebaseConfig = {} }) {
  const app = express();
  app.disable('x-powered-by');
  app.use(compression());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  // Web config built from .env; served as a module so no keys are hard-coded in client files.
  app.get('/firebase-config.js', (_req, res) => {
    res.type('js').set('Cache-Control', 'no-cache').send(`export default ${JSON.stringify(firebaseConfig)};`);
  });
  app.use('/api', quranRoutes(useCases), notFoundHandler);
  app.use(express.static(publicDir));

  app.use(errorHandler);
  return app;
}
