const WORD_END_MARKER = 255;

/**
 * Turns the raw layout of one Mushaf page into typed lines.
 * Pure function: everything it needs is passed in.
 *
 * @param {object} args
 * @param {import('../repositories/QuranRepository.js').LayoutLine[]} args.layout
 * @param {(index: number) => import('../entities/Ayah.js').Ayah} args.ayahAt   sync lookup of already-loaded ayahs
 * @param {number} args.nextPageSurah  surah of the first ayah of the next page (fallback for a header at page end)
 */
export function buildPageLines({ layout, ayahAt, nextPageSurah }) {
  return layout.map((line, i) => {
    if (line === null) return { type: 'blank' };

    if (line === 'B') return { type: 'basmala' };

    if (line === 'S') {
      return { type: 'surah-header', surah: surahFollowing(layout, i, ayahAt, nextPageSurah) };
    }

    const tokens = line.w.map((code) => {
      const ayah = ayahAt(code >> 8);
      const wordIndex = code & 255;
      if (wordIndex === WORD_END_MARKER) {
        return { kind: 'end', ayah: ayah.key, number: ayah.number };
      }
      return { kind: 'word', ayah: ayah.key, index: wordIndex, text: ayah.words[wordIndex] };
    });
    return { type: 'text', scale: line.s ?? 1, centered: line.c === 1, tokens };
  });
}

function surahFollowing(layout, from, ayahAt, nextPageSurah) {
  for (let i = from + 1; i < layout.length; i++) {
    const line = layout[i];
    if (line && line.w) return ayahAt(line.w[0] >> 8).surah;
  }
  return nextPageSurah;
}
