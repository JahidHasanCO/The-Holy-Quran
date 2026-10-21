import { TURN_MS } from '../state/constants.js';
import { toArabicDigits as toAr } from '../lib/format.js';

/** Mushaf pages (and the turning leaf) as render-ready objects. */
export function buildMushaf(env) {
  const { single, display, mode, turn } = env;
  const pages = display.map((p, k) => buildPage(env, p, single || k === 0));

  const leafOn = !!(turn && mode === 'book');
  let leaf = { faces: [] };
  if (leafOn) leaf = buildLeaf(env);
  return { pages, leafOn, leaf };
}

function wordStyle({ sel, pl }, key, j) {
  if (sel && sel.a === key && sel.j === j) return 'background: var(--sel); color: var(--ink)';
  if (pl && pl.ayah === key) return 'background: var(--hl); color: var(--accent)';
  return '';
}

function buildPage(env, p, isRight) {
  const { data, lang, single, fsc, pl, A } = env;
  const page = data.page(p, lang);
  const early = p <= 2;
  const scaleBase = early ? 1.3 : 1;
  const lineFs = (sc) => `calc(${(5.1 * scaleBase * sc * fsc).toFixed(3)}cqw)`;

  const lines = page.lines.map((ln) => {
    if (ln.type === 'basmala') return { isBasm: true, fs: lineFs(0.9) };
    if (ln.type === 'surah-header') {
      const S = ln.surah;
      return {
        isSurah: true, fs: lineFs(1), title: 'سورة ' + S.name.arabic, left: 'آياتها ' + toAr(S.ayahCount),
        right: S.meccan ? 'مكية' : 'مدنية', aria: 'About surah ' + S.name.transliterated,
        info: () => A.set({ panel: 'info', infoSurah: S.number }),
      };
    }
    if (ln.type === 'blank') return { isWords: true, style: 'height: 2.25em', t: [] };

    const toks = ln.tokens.map((t) => {
      if (t.kind === 'end') return { isEnd: true, num: toAr(t.number), style: pl && pl.ayah === t.ayah ? 'background: var(--hl)' : '' };
      return {
        isWord: true, text: t.text, style: wordStyle(env, t.ayah, t.index),
        aria: `Word ${t.index + 1} of ayah ${t.ayah}`, click: () => A.selectWord(t.ayah, t.index),
      };
    });
    let style = `font-family: 'Amiri Quran', 'Amiri', serif; font-size: ${lineFs(ln.scale)}; height: 2.25em; display: flex; align-items: center; flex-wrap: wrap; ` +
      (ln.centered ? 'justify-content: center; column-gap: .3em' : 'justify-content: space-between; column-gap: .12em');
    if (single && fsc > 1) style = style.replace('height: 2.25em', 'min-height: 2.25em');
    return { isWords: true, style, t: toks };
  });

  const first = env.data.pageIndex[p - 1];
  let edges = isRight
    ? '1px 1px 0 var(--edgeA), 2px 2px 0 var(--edgeB), 3px 2px 0 var(--edgeA), 4px 3px 0 var(--edgeB), 5px 3px 0 var(--edgeA), 6px 4px 0 var(--edgeB)'
    : '-1px 1px 0 var(--edgeA), -2px 2px 0 var(--edgeB), -3px 2px 0 var(--edgeA), -4px 3px 0 var(--edgeB), -5px 3px 0 var(--edgeA), -6px 4px 0 var(--edgeB)';
  const spine = single ? '' : (isRight ? ', inset 26px 0 30px -22px rgba(60,40,10,.32)' : ', inset -26px 0 30px -22px rgba(60,40,10,.32)');
  if (single) edges = '1px 1px 0 var(--edgeA), 2px 2px 0 var(--edgeB), 3px 3px 0 var(--edgeA), -1px 1px 0 var(--edgeA), -2px 2px 0 var(--edgeB)';
  const radius = single ? '4px' : (isRight ? '0 4px 4px 0' : '4px 0 0 4px');

  return {
    num: toAr(p), label: `Page ${p}`,
    surahName: env.data.surahs[first.surah - 1].name.arabic, juzLabel: 'الجزء ' + toAr(first.juz),
    lines, vjustify: early ? 'center' : 'flex-start',
    secStyle: `position: relative; width: var(--pw); flex: none; box-sizing: border-box; padding: ${single ? '8px' : '16px'}; ` +
      (single ? '' : 'min-height: calc(var(--pw) * 1.6); ') + `background: var(--paper); box-shadow: ${edges}${spine}; border-radius: ${radius}`,
    framePad: single ? 'padding: 12px 12px 8px' + (early ? '; min-height: 540px' : '') : 'padding: 14px 20px 10px',
  };
}

function buildLeaf(env) {
  const { single, turn } = env;
  const padF = single ? '8px' : '16px';
  const face = (pn, back, shade) => {
    if (pn < 1 || pn > 604) return null;
    return {
      pg: buildPage(env, pn, back), shade,
      faceStyle: `position: absolute; inset: 0; box-sizing: border-box; padding: ${padF}; background: var(--paper); backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden${back ? '; transform: rotateY(180deg)' : ''}`,
    };
  };
  let leaf;
  if (single) {
    leaf = {
      left: '0px', origin: 'right center', anim: `${turn.dir === 'next' ? 'turnOut ' : 'turnIn '}${TURN_MS}ms ease-in-out forwards`,
      faces: [face(turn.dir === 'next' ? turn.from : turn.to, false, 'linear-gradient(to left, rgba(0,0,0,0) 30%, rgba(0,0,0,.22))')],
    };
  } else if (turn.dir === 'next') {
    leaf = {
      left: '0px', origin: 'right center', anim: `turnNext ${TURN_MS}ms ease-in-out forwards`,
      faces: [face(turn.from + 1, false, 'linear-gradient(to left, rgba(0,0,0,0) 35%, rgba(0,0,0,.24))'), face(turn.to, true, 'linear-gradient(to right, rgba(0,0,0,0) 45%, rgba(0,0,0,.18))')],
    };
  } else {
    leaf = {
      left: 'var(--pw)', origin: 'left center', anim: `turnPrev ${TURN_MS}ms ease-in-out forwards`,
      faces: [face(turn.from, false, 'linear-gradient(to right, rgba(0,0,0,0) 35%, rgba(0,0,0,.24))'), face(turn.to + 1, true, 'linear-gradient(to left, rgba(0,0,0,0) 45%, rgba(0,0,0,.18))')],
    };
  }
  leaf.faces = leaf.faces.filter(Boolean);
  return leaf;
}
