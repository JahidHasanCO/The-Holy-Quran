import { createEnv } from './env.js';
import { buildChrome } from './chrome.js';
import { buildMushaf } from './mushaf.js';
import { buildLists } from './lists.js';
import { buildContents } from './contents.js';
import { buildInfo, buildPlayer, buildPractice, buildWord } from './panels.js';

/**
 * Turns controller state + loaded data into the object the reader template reads.
 * Pure: it never fetches; the controller requests whatever `Q` (data ready) is still missing.
 */
export function buildViewModel(input) {
  const env = createEnv(input);
  const { data, isOpen, Q, shown, lang, bookmarks, single, A } = env;
  const base = buildChrome(env);

  if (!Q || !isOpen) {
    return {
      ...base,
      loading: isOpen && !Q, ready: false, leafOn: false,
      topArShort: 'القرآن الكريم', topLine: isOpen ? 'Opening…' : 'Madinah Mushaf · 604 pages',
      pageShort: '', bookmarkLabel: 'Bookmark', isBookmarked: false, bookmarkFill: 'none',
      pages: [], wbwRows: [], transRows: [], surahRows: [], juzRows: [], bookmarkRows: [], noBookmarks: true,
      info: {}, wd: {}, pr: {}, pl: {}, topAr: 'القرآن الكريم', topArOne: '', topTr: 'Quran', topMeta: 'Loading…',
      topMetaShort: 'Loading…', juzNum: 1, sideOpen: false, playerOn: false,
    };
  }

  const f0 = data.pageIndex[shown[0] - 1];
  const S0 = data.surahs[f0.surah - 1];
  const names = [];
  for (const p of shown) {
    for (const s of data.page(p, lang).ayahs.map((a) => data.surahs[a.surah - 1].name.arabic)) {
      if (!names.includes(s)) names.push(s);
    }
  }
  const topAr = names.length > 2 ? `${names[0]} … ${names[names.length - 1]}` : names.join(' · ');

  const mushaf = buildMushaf(env);
  const lists = buildLists(env);
  const contents = buildContents(env, f0);
  const isBm = bookmarks.includes(env.right);
  const firstKeyOnPage = `${f0.surah}:${f0.ayah}`;

  return {
    ...base, ...mushaf, ...lists, ...contents,
    loading: false, ready: true,
    topArShort: single ? S0.name.arabic : topAr,
    topLine: single
      ? `p. ${shown[0]} · Juz ${f0.juz}`
      : `${S0.name.transliterated} · Juz ${f0.juz} · Hizb ${f0.hizb} · ${shown.length > 1 ? 'Pages ' + shown.join('–') : 'Page ' + shown[0]}`,
    topAr, topArOne: S0.name.arabic, topTr: S0.name.transliterated,
    topMeta: `Juz ${f0.juz} · Hizb ${f0.hizb} · ${shown.length > 1 ? `Pages ${shown[0]}–${shown[1]}` : `Page ${shown[0]}`}`,
    topMetaShort: `Page ${shown[0]} · Juz ${f0.juz}`, juzNum: f0.juz,
    info: buildInfo(env, f0),
    wd: buildWord(env),
    pr: buildPractice(env, firstKeyOnPage),
    pl: buildPlayer(env),
    bookmarkLabel: isBm ? 'Remove this page' : 'Bookmark this page',
    isBookmarked: isBm, bookmarkFill: isBm ? 'currentColor' : 'none',
    toggleBookmark() {
      const list = [...bookmarks];
      const at = list.indexOf(env.right);
      if (at >= 0) { list.splice(at, 1); A.set({ bookmarks: list }); A.say('Bookmark removed'); }
      else { list.push(env.right); A.set({ bookmarks: list }); A.say(`Page ${env.right} bookmarked`); }
    },
  };
}
