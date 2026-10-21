import { NotFoundError, ValidationError } from '../../domain/errors.js';

export function notFoundHandler(_req, res) {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ValidationError) return res.status(400).json({ error: err.message });
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
}
