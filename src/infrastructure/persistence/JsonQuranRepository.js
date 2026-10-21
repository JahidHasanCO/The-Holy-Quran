import path from 'node:path';
import { QuranRepository } from '../../domain/repositories/QuranRepository.js';
import { Surah } from '../../domain/entities/Surah.js';
import { Ayah } from '../../domain/entities/Ayah.js';
import { readJson } from './readJson.js';

/** Reads data/quran-ar.json (structure + Uthmani text) and data/quran-lines.json (Mushaf layout). */
export class JsonQuranRepository extends QuranRepository {
  #surahs;
  #ayahs;
  #pageIndex;
  #layout;
  #juzStarts;
  #surahOffsets;

  static async load(dataDir) {
    const [quran, lines] = await Promise.all([
      readJson(path.join(dataDir, 'quran-ar.json')),
      readJson(path.join(dataDir, 'quran-lines.json')),
    ]);
    return new JsonQuranRepository(quran, lines);
  }

  constructor(quran, lines) {
    super();
    this.#surahs = quran.surahs.map((s) => new Surah(s));
    this.#ayahs = quran.ayahs.map(
      ([surah, number, page, juz, hizb], index) =>
        new Ayah({ index, surah, number, page, juz, hizb, text: quran.text[index] }),
    );
    this.#layout = lines.pages;

    // Ayahs are stored in reading order, so a surah starts at the sum of the previous surahs' counts.
    this.#surahOffsets = [];
    let offset = 0;
    for (const s of this.#surahs) {
      this.#surahOffsets.push(offset);
      offset += s.ayahCount;
    }

    this.#pageIndex = Array.from({ length: QuranRepository.PAGE_COUNT + 1 }, () => []);
    this.#juzStarts = [];
    for (const ayah of this.#ayahs) {
      this.#pageIndex[ayah.page].push(ayah);
      if (!this.#juzStarts[ayah.juz - 1]) {
        this.#juzStarts[ayah.juz - 1] = { juz: ayah.juz, page: ayah.page, surah: ayah.surah, ayah: ayah.number };
      }
    }
  }

  async getSurahs() {
    return this.#surahs;
  }

  async getSurah(number) {
    return this.#surahs[number - 1] ?? null;
  }

  async getAyahByIndex(index) {
    return this.#ayahs[index] ?? null;
  }

  async getAyah(surah, number) {
    const s = this.#surahs[surah - 1];
    if (!s || number < 1 || number > s.ayahCount) return null;
    return this.#ayahs[this.#surahOffsets[surah - 1] + number - 1];
  }

  async getAyahsOnPage(page) {
    return this.#pageIndex[page] ?? [];
  }

  async getPageLayout(page) {
    return this.#layout[page - 1];
  }

  async getJuzStarts() {
    return this.#juzStarts;
  }
}
