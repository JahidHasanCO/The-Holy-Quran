import { QuranRepository } from '../../domain/repositories/QuranRepository.js';

/** One entry per Mushaf page: where it starts. Small enough to load once and keep. */
export class ListPages {
  constructor({ quranRepository }) {
    this.quran = quranRepository;
  }

  async execute() {
    const pages = [];
    for (let page = 1; page <= QuranRepository.PAGE_COUNT; page++) {
      const [first] = await this.quran.getAyahsOnPage(page);
      pages.push({ page, juz: first.juz, hizb: first.hizb, surah: first.surah, ayah: first.number });
    }
    return pages;
  }
}
