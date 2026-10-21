/**
 * Port: read access to the Quran text, its structure and the Mushaf page layout.
 * Implementations live in the infrastructure layer.
 *
 * @typedef {import('../entities/Surah.js').Surah} Surah
 * @typedef {import('../entities/Ayah.js').Ayah} Ayah
 *
 * Raw layout line, as stored for a Madinah Mushaf page:
 * @typedef {'S' | 'B' | null | { w: number[], s?: number, c?: number }} LayoutLine
 */
export class QuranRepository {
  static PAGE_COUNT = 604;
  static AYAH_COUNT = 6236;

  /** @returns {Promise<Surah[]>} */
  async getSurahs() { throw new Error('not implemented'); }

  /** @returns {Promise<Surah | null>} */
  async getSurah(number) { throw new Error('not implemented'); }

  /** @returns {Promise<Ayah | null>} */
  async getAyahByIndex(index) { throw new Error('not implemented'); }

  /** @returns {Promise<Ayah | null>} */
  async getAyah(surah, number) { throw new Error('not implemented'); }

  /** @returns {Promise<Ayah[]>} ayahs that start on the given page, in reading order */
  async getAyahsOnPage(page) { throw new Error('not implemented'); }

  /** @returns {Promise<LayoutLine[]>} the 15 layout lines of a page */
  async getPageLayout(page) { throw new Error('not implemented'); }

  /** @returns {Promise<Array<{ juz: number, page: number, surah: number, ayah: number }>>} */
  async getJuzStarts() { throw new Error('not implemented'); }
}
