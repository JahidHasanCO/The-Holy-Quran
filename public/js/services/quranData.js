import { api } from './api.js';

const PENDING_TRANSLATION = 'Loading translation…';

/**
 * Client-side cache of Quran data. Reads are synchronous (`page`, `ayah`) so rendering can stay synchronous;
 * `load*` methods fetch what is missing.
 */
export class QuranData {
  surahs = null;
  juz = null;
  pageIndex = null; // [{ page, juz, hizb, surah, ayah }]
  #pages = new Map(); // `${lang}:${n}` -> page DTO
  #ayahs = new Map(); // `${lang}:${key}` -> ayah DTO
  #inflight = new Map();

  get ready() {
    return !!(this.surahs && this.juz && this.pageIndex);
  }

  loadCatalog() {
    return this.#once('catalog', async () => {
      [this.surahs, this.juz, this.pageIndex] = await Promise.all([api.surahs(), api.juz(), api.pages()]);
    });
  }

  loadPage(number, lang) {
    return this.#once(`page:${lang}:${number}`, async () => {
      this.#pages.set(`${lang}:${number}`, await api.page(number, lang));
    });
  }

  loadAyah(key, lang) {
    return this.#once(`ayah:${lang}:${key}`, async () => {
      this.#ayahs.set(`${lang}:${key}`, await api.ayah(key, lang));
    });
  }

  hasPage(number, lang) {
    return this.#pages.has(`${lang}:${number}`);
  }

  /**
   * The page in `lang`; while another language's copy is all we have, its translations show a placeholder
   * so the layout never waits on a translation.
   */
  page(number, lang) {
    const exact = this.#pages.get(`${lang}:${number}`);
    if (exact) return exact;
    const other = this.#pages.get(`${lang === 'bn' ? 'en' : 'bn'}:${number}`);
    return other && { ...other, ayahs: other.ayahs.map((a) => ({ ...a, translation: PENDING_TRANSLATION })) };
  }

  /** An ayah with words, glosses and translation - from a loaded page when possible. */
  ayah(key, lang) {
    const exact = this.#ayahs.get(`${lang}:${key}`);
    if (exact) return exact;
    for (const n of this.pagesFor(key)) {
      const found = this.page(n, lang)?.ayahs.find((a) => a.key === key);
      if (found) return found;
    }
    return undefined;
  }

  /** Candidate pages for an ayah, from the page index (the ayah is on the last page that starts at or before it). */
  pagesFor(key) {
    if (!this.pageIndex) return [];
    const [s, a] = key.split(':').map(Number);
    let found = 0;
    for (const p of this.pageIndex) {
      if (p.surah < s || (p.surah === s && p.ayah <= a)) found = p.page;
      else break;
    }
    return found ? [found] : [];
  }

  #once(id, load) {
    if (!this.#inflight.has(id)) {
      this.#inflight.set(id, load().catch((err) => {
        this.#inflight.delete(id);
        throw err;
      }));
    }
    return this.#inflight.get(id);
  }
}
