import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { config } from '../src/main/config.js';
import { buildUseCases } from '../src/main/container.js';
import { createApp } from '../src/infrastructure/http/createApp.js';

let server;
let base;

before(async () => {
  const app = createApp({ useCases: await buildUseCases(config), publicDir: config.publicDir });
  await new Promise((resolve) => { server = app.listen(0, resolve); });
  base = `http://localhost:${server.address().port}`;
});

after(() => server.close());

const get = async (url) => {
  const res = await fetch(base + url);
  return { status: res.status, body: await res.json() };
};

test('lists 114 surahs', async () => {
  const { status, body } = await get('/api/surahs');
  assert.equal(status, 200);
  assert.equal(body.length, 114);
  assert.equal(body[0].name.transliterated, 'Al-Fatihah');
});

test('lists 30 juz starting on page 1', async () => {
  const { body } = await get('/api/juz');
  assert.equal(body.length, 30);
  assert.deepEqual(body[0], { juz: 1, page: 1, surah: 1, ayah: 1 });
});

test('page index has 604 entries with juz and hizb', async () => {
  const { body } = await get('/api/pages');
  assert.equal(body.length, 604);
  assert.deepEqual(body[0], { page: 1, juz: 1, hizb: 1, surah: 1, ayah: 1 });
  assert.equal(body[603].juz, 30);
});

test('page 1 has a surah header and the seven ayahs of Al-Fatihah', async () => {
  const { status, body } = await get('/api/pages/1?lang=en');
  assert.equal(status, 200);
  assert.equal(body.lines[0].type, 'surah-header');
  assert.equal(body.lines[0].surah.number, 1);
  assert.equal(body.ayahs.length, 7);
  assert.equal(body.ayahs[0].words.length, 4);
  assert.match(body.ayahs[0].translation, /Entirely Merciful/);
});

test('page 2 places the basmala after the Al-Baqarah header', async () => {
  const { body } = await get('/api/pages/2');
  assert.deepEqual(body.lines.slice(0, 2).map((l) => l.type), ['surah-header', 'basmala']);
  assert.equal(body.lines[0].surah.number, 2);
});

test('every ayah has exactly one end marker across the 604 pages', async () => {
  const ends = new Set();
  for (let p = 1; p <= 604; p++) {
    const { status, body } = await get(`/api/pages/${p}`);
    assert.equal(status, 200, `page ${p}`);
    for (const line of body.lines) {
      if (line.type !== 'text') continue;
      for (const t of line.tokens) if (t.kind === 'end') ends.add(t.ayah);
    }
  }
  assert.equal(ends.size, 6236);
});

test('ayah lookup returns neighbours', async () => {
  const { body } = await get('/api/ayahs/2/1?lang=bn');
  assert.equal(body.previous, '1:7');
  assert.equal(body.next, '2:2');
  const last = await get('/api/ayahs/114/6');
  assert.equal(last.body.next, null);
});

test('invalid input is a 400, unknown ayah or route a 404', async () => {
  assert.equal((await get('/api/pages/0')).status, 400);
  assert.equal((await get('/api/pages/605')).status, 400);
  assert.equal((await get('/api/pages/abc')).status, 400);
  assert.equal((await get('/api/pages/1?lang=fr')).status, 400);
  assert.equal((await get('/api/ayahs/1/8')).status, 404);
  assert.equal((await get('/api/nope')).status, 404);
});
