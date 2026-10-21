export class Surah {
  constructor({ n, ar, tr, en, bn, ayahs, meccan, order, rukus, page, juz }) {
    this.number = n;
    this.nameArabic = ar;
    this.nameTransliterated = tr;
    this.nameEnglish = en;
    this.nameBengali = bn;
    this.ayahCount = ayahs;
    this.meccan = meccan;
    this.revelationOrder = order;
    this.rukuCount = rukus;
    this.startPage = page;
    this.startJuz = juz;
    Object.freeze(this);
  }
}
