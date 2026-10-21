import { toArabicDigits as toAr } from '../lib/format.js';

/** Surah list (with search), juz list and bookmarks. */
export function buildContents(env, first) {
  const { s, data, lang, bookmarks, A } = env;
  const query = (s.query || '').trim().toLowerCase();
  const latin = query.replace(/[^a-z]/g, '');

  const surahRows = data.surahs
    .filter((S) => {
      if (!query) return true;
      return String(S.number) === query
        || (latin && S.name.transliterated.toLowerCase().replace(/[^a-z]/g, '').includes(latin))
        || S.name.english.toLowerCase().includes(query)
        || S.name.bengali.includes(query)
        || S.name.arabic.includes(query);
    })
    .map((S) => ({
      n: S.number, tr: S.name.transliterated, meaning: lang === 'bn' ? S.name.bengali : S.name.english, ar: S.name.arabic,
      meta: `${S.meccan ? 'Makki' : 'Madani'} · ${S.ayahCount} ayahs · p. ${S.startPage}`,
      go: () => A.go(S.startPage),
      rowStyle: S.number === first.surah ? 'background: var(--chip)' : '',
    }));

  const juzRows = data.juz.map((j) => ({
    n: j.juz, meta: `Page ${j.page} · ${data.surahs[j.surah - 1].name.transliterated} ${j.surah}:${j.ayah}`,
    ar: 'الجزء ' + toAr(j.juz), go: () => A.go(j.page), rowStyle: first.juz === j.juz ? 'background: var(--chip)' : '',
  }));

  const bookmarkRows = [...bookmarks].sort((a, b) => a - b).map((p) => {
    const S = data.surahs[data.pageIndex[p - 1].surah - 1];
    return { label: `Page ${p} · ${S.name.transliterated}`, ar: S.name.arabic, go: () => A.go(p) };
  });

  return { surahRows, noResults: surahRows.length === 0, juzRows, bookmarkRows, noBookmarks: bookmarkRows.length === 0 };
}
