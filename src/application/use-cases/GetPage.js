import { QuranRepository } from '../../domain/repositories/QuranRepository.js';
import { buildPageLines } from '../../domain/services/buildPageLines.js';
import { presentGlosses, presentSurah } from '../presenters.js';
import { requireInteger, requireLanguage } from '../validation.js';

/** One Mushaf page: typed lines for the Mushaf view, plus per-ayah text, translation and word glosses. */
export class GetPage {
  constructor({ quranRepository, translationRepository }) {
    this.quran = quranRepository;
    this.translations = translationRepository;
  }

  async execute({ page, language = 'en' }) {
    const number = requireInteger(page, 'page', 1, QuranRepository.PAGE_COUNT);
    const lang = requireLanguage(language);

    const [layout, pageAyahs] = await Promise.all([
      this.quran.getPageLayout(number),
      this.quran.getAyahsOnPage(number),
    ]);

    const loaded = new Map(pageAyahs.map((a) => [a.index, a]));
    const referenced = new Set(layout.flatMap((l) => (l && l.w ? l.w.map((c) => c >> 8) : [])));
    for (const index of referenced) {
      if (!loaded.has(index)) loaded.set(index, await this.quran.getAyahByIndex(index));
    }

    const nextPageAyahs =
      number < QuranRepository.PAGE_COUNT ? await this.quran.getAyahsOnPage(number + 1) : [];
    const lines = buildPageLines({
      layout,
      ayahAt: (index) => loaded.get(index),
      nextPageSurah: nextPageAyahs[0]?.surah ?? 1,
    });

    const surahs = new Map((await this.quran.getSurahs()).map((s) => [s.number, s]));
    for (const line of lines) {
      if (line.type === 'surah-header') line.surah = presentSurah(surahs.get(line.surah));
    }

    const ayahs = await Promise.all(
      pageAyahs.map(async (a) => ({
        key: a.key,
        surah: a.surah,
        number: a.number,
        text: a.text,
        translation: await this.translations.getTranslation(lang, a.index),
        words: presentGlosses(await this.translations.getWordGlosses(a.index), a.words.length).map(
          (g, i) => ({ text: a.words[i], ...g }),
        ),
      })),
    );

    const first = pageAyahs[0];
    return {
      number,
      language: lang,
      juz: first.juz,
      hizb: first.hizb,
      surahs: [...new Set(pageAyahs.map((a) => a.surah))],
      lines,
      ayahs,
    };
  }
}
