// Writes public/firebase-config.js from .env so static hosting (Firebase Hosting) can serve it.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../src/main/config.js';

if (!config.firebase.apiKey) {
  console.error('Missing FIREBASE_* values: fill in .env (see .env.example).');
  process.exit(1);
}
const out = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'firebase-config.js');
fs.writeFileSync(out, `export default ${JSON.stringify(config.firebase, null, 2)};\n`);
console.log(`Wrote ${path.relative(process.cwd(), out)}`);
