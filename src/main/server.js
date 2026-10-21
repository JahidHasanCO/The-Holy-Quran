import { config } from './config.js';
import { buildUseCases } from './container.js';
import { createApp } from '../infrastructure/http/createApp.js';

const useCases = await buildUseCases(config);
const app = createApp({ useCases, publicDir: config.publicDir });

app.listen(config.port, () => console.log(`Quran Reader on http://localhost:${config.port}`));
