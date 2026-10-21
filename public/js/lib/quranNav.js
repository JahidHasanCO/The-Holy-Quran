/** Ayah-key arithmetic ("surah:ayah") that only needs the surah list. */
export const LAST_PAGE = 604;
export const FIRST_KEY = '1:1';
export const LAST_KEY = '114:6';

export const parseKey = (key) => key.split(':').map(Number);

export function nextKey(key, surahs) {
  const [s, a] = parseKey(key);
  if (a < surahs[s - 1].ayahCount) return `${s}:${a + 1}`;
  return s < 114 ? `${s + 1}:1` : null;
}

export function previousKey(key, surahs) {
  const [s, a] = parseKey(key);
  if (a > 1) return `${s}:${a - 1}`;
  return s > 1 ? `${s - 1}:${surahs[s - 2].ayahCount}` : null;
}
