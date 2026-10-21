import { ordinal as ord } from '../lib/format.js';
import { nextKey, previousKey, parseKey, FIRST_KEY, LAST_KEY } from '../lib/quranNav.js';
import { RECITERS, SPEEDS } from '../services/audio.js';

const hasGloss = (g) => g && (g.transliteration || g.meaning);

/** Surah info dialog. */
export function buildInfo(env, first) {
  const { s, data, A } = env;
  const IS = data.surahs[(s.infoSurah || first.surah) - 1];
  return {
    n: IS.number, ar: IS.name.arabic, tr: IS.name.transliterated, en: IS.name.english, bn: IS.name.bengali,
    place: IS.meccan ? 'Makkah (Makki)' : 'Madinah (Madani)',
    order: ord(IS.revelationOrder) + ' of 114', ayahs: IS.ayahCount, rukus: IS.rukuCount, page: IS.startPage, juz: IS.startJuz,
    go: () => A.go(IS.startPage),
    listen: () => { A.set({ panel: '', page: IS.startPage }); A.playAyah(`${IS.number}:1`); },
  };
}

/** Word dictionary panel for the selected word. */
export function buildWord(env) {
  const { sel, data, lang, A } = env;
  if (!sel) return {};
  const ayah = data.ayah(sel.a, lang);
  const [surahNo, ayahNo] = parseKey(sel.a);
  const S = data.surahs[surahNo - 1];
  const count = ayah ? ayah.words.length : 0;
  const w = ayah?.words[sel.j];
  const g = hasGloss(w) ? w : null;
  const prevKey = previousKey(sel.a, data.surahs);
  const nextK = nextKey(sel.a, data.surahs);

  const step = async (key, pick) => {
    await A.ensureAyah(key);
    const target = data.ayah(key, lang);
    if (target) A.selectWord(key, pick(target.words.length));
  };

  return {
    ar: w ? w.text : '', tr: g ? g.transliteration : '',
    mean: g ? g.meaning : (ayah ? 'Meaning not available for this word yet' : 'Loading meaning…'),
    surah: `${S.number}. ${S.name.transliterated}`, pos: `${surahNo}:${ayahNo} · ${sel.j + 1} of ${count}`,
    isFirst: sel.j === 0 && sel.a === FIRST_KEY, isLast: ayah ? sel.j === count - 1 && sel.a === LAST_KEY : false,
    prevWord() {
      if (sel.j > 0) A.selectWord(sel.a, sel.j - 1);
      else if (prevKey) step(prevKey, (n) => n - 1);
    },
    nextWord() {
      if (ayah && sel.j < count - 1) A.selectWord(sel.a, sel.j + 1);
      else if (nextK) step(nextK, () => 0);
    },
    play: () => A.say(`Playing “${g ? g.transliteration : (w ? w.text : '')}”`),
    ayahWords: ayah ? ayah.words.map((x, j) => ({
      text: x.text, aria: `Word ${j + 1}`, style: j === sel.j ? 'background: var(--sel)' : '', click: () => A.selectWord(sel.a, j),
    })) : [],
    ayahTr: ayah ? ayah.translation : '',
  };
}

/** Practice-recitation panel (a front-end demo: results are illustrative, not speech analysis). */
export function buildPractice(env, firstKeyOnPage) {
  const { s, board, side, single, data, lang, A } = env;
  if (side !== 'practice') return {};
  const key = s.pAyah !== undefined && s.pAyah !== null ? s.pAyah : (board.practiceKey || firstKeyOnPage);
  const stage = s.pStage || board.practiceStage || 'idle';
  const ayah = data.ayah(key, lang);
  const [surahNo, ayahNo] = parseKey(key);
  const PS = data.surahs[surahNo - 1];
  const words = ayah ? ayah.words : [];
  const n = words.length;

  const marks = words.map(() => 'good');
  if (n >= 6) { marks[2] = 'warn'; marks[n - 2] = 'bad'; } else if (n >= 4) { marks[1] = 'warn'; }
  const isRes = stage === 'result';
  const nGood = marks.filter((m) => m === 'good').length;
  const colors = { good: 'var(--good)', warn: 'var(--warn)', bad: 'var(--bad)' };
  const soft = { good: 'var(--goodSoft)', warn: 'var(--warnSoft)', bad: 'var(--badSoft)' };

  const issues = [];
  marks.forEach((m, j) => {
    if (m === 'good') return;
    const g = hasGloss(words[j]) ? words[j] : null;
    issues.push({
      ar: words[j].text, fg: colors[m], label: m === 'warn' ? `Not clear · word ${j + 1}` : `Missed · word ${j + 1}`,
      hint: g ? `${g.transliteration} — ${g.meaning}` : 'Listen and repeat slowly',
      aria: `Hear word ${j + 1}`, play: () => A.say(`Playing word ${j + 1}`),
    });
  });

  return {
    title: `${PS.name.transliterated} · ${surahNo}:${ayahNo}`, sub: `Ayah ${ayahNo} of ${PS.ayahCount}`,
    fs: (single ? 26 : 30) + 'px',
    words: words.map((t, j) => {
      let st = 'padding: 0 .12em; border-radius: .2em';
      if (isRes) st += `; border-bottom: 3px solid ${colors[marks[j]]}` + (marks[j] !== 'good' ? `; background: ${soft[marks[j]]}` : '');
      return { text: t.text, style: st };
    }),
    isIdle: stage === 'idle', isListening: stage === 'listening', isResult: isRes,
    isFirst: key === FIRST_KEY, isLast: key === LAST_KEY,
    prevAyah: () => A.set({ pAyah: previousKey(key, data.surahs), pStage: 'idle' }),
    nextAyah: () => A.set({ pAyah: nextKey(key, data.surahs), pStage: 'idle' }),
    start: () => A.startPractice(),
    stop: () => A.stopPractice(),
    listenFirst: () => A.playAyah(key),
    score: `${nGood}/${n}`,
    headline: nGood === n ? 'Excellent — every word was right' : (nGood >= n * 0.85 ? 'Almost there' : 'Keep practising'),
    detail: nGood === n ? 'Try the next ayah.' : `${n - nGood} word${n - nGood > 1 ? 's' : ''} to review below.`,
    scoreBg: nGood === n ? 'var(--goodSoft)' : 'var(--warnSoft)', scoreFg: nGood === n ? 'var(--good)' : 'var(--warn)',
    issues,
  };
}

/** Mini audio player. */
export function buildPlayer(env) {
  const { pl, data, shown, A } = env;
  if (!pl) return {};
  const [surahNo, ayahNo] = parseKey(pl.ayah);
  const PSu = data.surahs[surahNo - 1];
  const rec = RECITERS.find((r) => r.id === pl.reciter) || RECITERS[0];
  return {
    title: `${PSu.name.transliterated} · Ayah ${ayahNo} of ${PSu.ayahCount} · ${rec.name}`, short: `${surahNo}:${ayahNo}`,
    reciter: rec.name, reciterId: rec.id,
    pct: Math.round(pl.t * 100) + '%', playing: !!pl.playing, paused: !pl.playing,
    toggleLabel: pl.playing ? 'Pause' : 'Play',
    toggle: () => A.togglePlay(pl),
    prev: () => A.stepAyah(pl, -1, shown),
    next: () => A.stepAyah(pl, 1, shown),
    speed: SPEEDS[pl.speed || 0] + '×',
    cycleSpeed: () => A.setPlayer({ ...pl, speed: ((pl.speed || 0) + 1) % SPEEDS.length }),
    repeat: !!pl.repeat,
    repeatStyle: pl.repeat ? 'background: var(--accentSoft); border-color: var(--accent); color: var(--accent)' : '',
    toggleRepeat: () => A.setPlayer({ ...pl, repeat: !pl.repeat }),
    close: () => A.closePlayer(),
  };
}
