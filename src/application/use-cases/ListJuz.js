export class ListJuz {
  constructor({ quranRepository }) {
    this.quran = quranRepository;
  }

  async execute() {
    return this.quran.getJuzStarts();
  }
}
