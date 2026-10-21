import { toArabicDigits as toAr } from '../lib/format.js';

const hasGloss = (g) => g && (g.transliteration || g.meaning);

/** Word-by-word and translation rows for the shown pages. */
export function buildLists(env) {
  const { data, mode, lang, shown, pl, sel, A } = env;
  const wbwRows = [];
  const transRows = [];
  if (mode === 'book') return { wbwRows, transRows };

  for (const p of shown) {
    for (const ayah of data.page(p, lang).ayahs) {
      const S = data.surahs[ayah.surah - 1];
      const playing = pl && pl.ayah === ayah.key;
      const common = {
        isHeader: false, isVerse: true, key: ayah.key, num: toAr(ayah.number), tr: ayah.translation,
        playAria: `Play ayah ${ayah.key}`, play: () => A.playAyah(ayah.key),
        cardStyle: playing ? 'background: var(--hl)' : '',
      };
      if (ayah.number === 1) {
        const head = {
          isHeader: true, isVerse: false, title: 'سورة ' + S.name.arabic,
          sub: `${S.number}. ${S.name.transliterated} · ${lang === 'bn' ? S.name.bengali : S.name.english} · ${S.meccan ? 'Makki' : 'Madani'} · ${S.ayahCount} ayahs`,
          basmala: ayah.surah !== 1 && ayah.surah !== 9,
        };
        wbwRows.push(head);
        transRows.push(head);
      }
      if (mode === 'wbw') {
        wbwRows.push({
          ...common,
          words: ayah.words.map((w, j) => ({
            ar: w.text, tr: hasGloss(w) ? w.transliteration : '', mean: hasGloss(w) ? w.meaning : '—',
            style: sel && sel.a === ayah.key && sel.j === j ? 'border-color: var(--accent); background: var(--sel)' : '',
            click: () => A.selectWord(ayah.key, j),
          })),
        });
      } else {
        transRows.push({ ...common, ar: ayah.text });
      }
    }
  }
  return { wbwRows, transRows };
}
