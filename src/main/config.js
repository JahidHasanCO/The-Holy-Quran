import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

const env = process.env;

export const config = Object.freeze({
  port: Number(env.PORT) || 3000,
  dataDir: path.join(root, 'data'),
  publicDir: path.join(root, 'public'),
  firebase: Object.freeze({
    apiKey: env.FIREBASE_API_KEY,
    authDomain: env.FIREBASE_AUTH_DOMAIN,
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.FIREBASE_MESSAGING_SENDER_ID,
    appId: env.FIREBASE_APP_ID,
    measurementId: env.FIREBASE_MEASUREMENT_ID,
  }),
});
