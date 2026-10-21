import { QuranRepository } from '../../domain/repositories/QuranRepository.js';
import { NotFoundError } from '../../domain/errors.js';
import { presentGlosses } from '../presenters.js';
import { requireInteger, requireLanguage } from '../validation.js';

export class GetAyah {
  constructor({ quranRepository, translationRepository }) {
    this.quran = quranRepository;
    this.translations = translationRepository;
  }

  async execute({ surah, ayah, language = 'en' }) {
    const s = requireInteger(surah, 'surah', 1, 114);
    const n = requireInteger(ayah, 'ayah', 1, 286);
    const lang = requireLanguage(language);

    const found = await this.quran.getAyah(s, n);
    if (!found) throw new NotFoundError(`Ayah ${s}:${n} not found`);

    const [previous, next, translation, glosses] = await Promise.all([
      found.index > 0 ? this.quran.getAyahByIndex(found.index - 1) : null,
      found.index < QuranRepository.AYAH_COUNT - 1 ? this.quran.getAyahByIndex(found.index + 1) : null,
      this.translations.getTranslation(lang, found.index),
      this.translations.getWordGlosses(found.index),
    ]);

    return {
      key: found.key,
      surah: found.surah,
      number: found.number,
      page: found.page,
      juz: found.juz,
      hizb: found.hizb,
      text: found.text,
      translation,
      words: presentGlosses(glosses, found.words.length).map((g, i) => ({ text: found.words[i], ...g })),
      previous: previous?.key ?? null,
      next: next?.key ?? null,
    };
  }
}
