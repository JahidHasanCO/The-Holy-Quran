/** HTTP client for the Quran Reader API. */
async function getJson(url) {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  surahs: () => getJson('/api/surahs'),
  juz: () => getJson('/api/juz'),
  pages: () => getJson('/api/pages'),
  page: (number, lang) => getJson(`/api/pages/${number}?lang=${lang}`),
  ayah: (key, lang) => {
    const [surah, ayah] = key.split(':');
    return getJson(`/api/ayahs/${surah}/${ayah}?lang=${lang}`);
  },
};
