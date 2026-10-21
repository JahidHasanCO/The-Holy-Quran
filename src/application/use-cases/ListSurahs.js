import { presentSurah } from '../presenters.js';

export class ListSurahs {
  constructor({ quranRepository }) {
    this.quran = quranRepository;
  }

  async execute() {
    return (await this.quran.getSurahs()).map(presentSurah);
  }
}
