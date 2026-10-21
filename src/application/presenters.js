export function presentSurah(s) {
  return {
    number: s.number,
    name: {
      arabic: s.nameArabic,
      transliterated: s.nameTransliterated,
      english: s.nameEnglish,
      bengali: s.nameBengali,
    },
    ayahCount: s.ayahCount,
    meccan: s.meccan,
    revelationOrder: s.revelationOrder,
    rukuCount: s.rukuCount,
    startPage: s.startPage,
    startJuz: s.startJuz,
  };
}

export function presentGlosses(glosses, wordCount) {
  return Array.from({ length: wordCount }, (_, i) => ({
    transliteration: glosses?.[i]?.transliteration ?? null,
    meaning: glosses?.[i]?.meaning ?? null,
  }));
}
