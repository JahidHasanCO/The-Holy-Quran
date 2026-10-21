export class Ayah {
  /**
   * @param {number} index  zero-based position in the whole Quran (0..6235)
   */
  constructor({ index, surah, number, page, juz, hizb, text }) {
    this.index = index;
    this.surah = surah;
    this.number = number;
    this.page = page;
    this.juz = juz;
    this.hizb = hizb;
    this.text = text;
    Object.freeze(this);
  }

  get key() {
    return `${this.surah}:${this.number}`;
  }

  get words() {
    return this.text.split(' ');
  }
}
