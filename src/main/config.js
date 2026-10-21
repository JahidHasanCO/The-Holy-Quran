import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const config = Object.freeze({
  port: Number(process.env.PORT) || 3000,
  dataDir: path.join(root, 'data'),
  publicDir: path.join(root, 'public'),
});
