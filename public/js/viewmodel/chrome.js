import { TURN_MS } from '../state/constants.js';
import { RECITERS } from '../services/audio.js';
import { LAST_PAGE } from '../lib/quranNav.js';

const SEG_ON = 'background: var(--paper); color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,.14)';
const OPTION_ON = 'border-color: var(--accent); border-width: 2px';

/** Top bar, dock, panels' open/close handlers and everything that does not depend on loaded pages. */
export function buildChrome(env) {
  const { s, A, T, themeName, single, page, mode, lang, fsc, panel, side, user, book, isOpen, shown, Q, pl } = env;
  const sideW = side ? '412px' : '0px';
  const pwExpr = single
    ? 'calc(100vw - 26px)'
    : `max(240px, min(calc((100vw - 72px - ${sideW}) / 2), calc((100vh - 180px) * .58)))`;
  const cssVars = Object.keys(T).map((k) => `--${k}:${T[k]}`).join(';') + ';--pw:' + pwExpr;
  const isGoto = panel === 'goto';

  return {
    cssVars, isSingle: single, notSingle: !single,
    m: { book: mode === 'book', wbw: mode === 'wbw', trans: mode === 'trans' },
    seg: {
      book: mode === 'book' ? SEG_ON : '', wbw: mode === 'wbw' ? SEG_ON : '', trans: mode === 'trans' ? SEG_ON : '',
      surahTab: (s.tab || 'surah') === 'surah' ? SEG_ON : '', juzTab: s.tab === 'juz' ? SEG_ON : '',
      paper: themeName === 'paper' ? OPTION_ON : '', night: themeName === 'night' ? OPTION_ON : '',
      bn: lang === 'bn' ? OPTION_ON : '', en: lang === 'en' ? OPTION_ON : '',
    },
    setBook: () => A.set({ mode: 'book' }),
    setWbw: () => A.set({ mode: 'wbw' }),
    setTrans: () => A.set({ mode: 'trans' }),
    lang, isBn: lang === 'bn', isEn: lang === 'en',
    setBn: () => A.set({ lang: 'bn' }),
    setEn: () => A.set({ lang: 'en' }),
    transSource: lang === 'bn' ? 'Bangla · Muhiuddin Khan' : 'English · Saheeh International',
    isPaper: themeName === 'paper', isNight: themeName === 'night',
    setPaper: () => A.set({ theme: 'paper' }),
    setNight: () => A.set({ theme: 'night' }),
    fontPct: Math.round(fsc * 100) + '%',
    fontUp: () => A.set({ fontScale: Math.min(1.6, Math.round((fsc + 0.1) * 10) / 10) }),
    fontDown: () => A.set({ fontScale: Math.max(0.8, Math.round((fsc - 0.1) * 10) / 10) }),
    headPx: (single ? 13 : 15) + 'px',
    trPx: Math.round((lang === 'bn' ? 17 : 16) * fsc) + 'px',
    trArPx: Math.round((single ? 24 : 28) * fsc) + 'px',
    wbwArPx: Math.round((single ? 24 : 28) * fsc) + 'px',
    trFont: lang === 'bn' ? "'Noto Serif Bengali', serif" : "'Noto Sans', system-ui, sans-serif",
    page, gotoVal: s.gotoVal || '',
    onGotoInput: (e) => A.set({ gotoVal: e.target.value }),
    goGoto() {
      const n = parseInt(s.gotoVal, 10);
      if (n >= 1 && n <= LAST_PAGE) A.go(n);
      else A.say('Enter a page from 1 to 604');
    },
    onSlide: (e) => A.go(parseInt(e.target.value, 10)),
    next: () => A.turnTo('next'),
    prev: () => A.turnTo('prev'),
    atStart: shown[0] <= 1, atEnd: shown[shown.length - 1] >= LAST_PAGE,
    pageLabel: shown.length > 1 ? `Pages ${shown[0]}–${shown[1]}` : `Page ${shown[0]}`,
    openContents: () => A.set({ panel: 'contents' }),
    openInfo: () => A.set({ panel: 'info', infoSurah: null }),
    openSettings: () => A.set({ panel: 'settings' }),
    openSignin: () => A.set({ panel: 'signin' }),
    openAccount: () => A.set({ panel: 'account' }),
    closePanel: () => A.set({ panel: '' }),
    closeSide: () => A.set({ side: '', sel: null }),
    panelContents: panel === 'contents', panelSettings: panel === 'settings', panelInfo: panel === 'info' && Q,
    panelSignin: panel === 'signin', panelAccount: panel === 'account' && !!user,
    signedIn: !!user, signedOut: !user,
    userInitial: user ? user.name.charAt(0).toUpperCase() : '', userName: user ? user.name : '', userEmail: user ? user.email : '',
    mockGoogle() {
      A.set({ user: { name: 'Your Name', email: 'you@gmail.com' }, panel: '' });
      A.say('Signed in with Google · progress will sync');
    },
    signOut() {
      A.set({ user: null, panel: '' });
      A.say('Signed out');
    },
    hasToast: !!s.toast, toast: s.toast || '',
    tabSurah: (s.tab || 'surah') === 'surah', tabJuz: s.tab === 'juz',
    showSurahTab: () => A.set({ tab: 'surah' }), showJuzTab: () => A.set({ tab: 'juz' }),
    query: s.query || '', onQuery: (e) => A.set({ query: e.target.value }),
    reciters: RECITERS,
    bars: Array.from({ length: 14 }, (_, i) => ({ d: (-(i * 0.13) % 0.9).toFixed(2) + 's' })),
    sideOpen: !!side && Q, sideWord: side === 'word', sidePractice: side === 'practice',
    sideTitle: side === 'practice' ? 'Practice recitation' : 'Word',
    sideStyle: single
      ? 'position: fixed; left: 0; right: 0; bottom: 0; z-index: 25; max-height: 78vh; display: flex; flex-direction: column; background: var(--paper); border-radius: 18px 18px 0 0; box-shadow: 0 -12px 40px rgba(0,0,0,.22)'
      : 'flex: 0 0 380px; align-self: flex-start; position: sticky; top: 66px; margin-top: 14px; max-height: calc(100vh - 190px); display: flex; flex-direction: column; background: var(--paper); border: 1px solid var(--line); border-radius: 16px; box-shadow: 0 8px 28px rgba(0,0,0,.08); overflow: hidden',
    bodyStyle: single ? 'padding: 0' : 'padding: 0 16px; display: flex; align-items: flex-start; gap: 16px',
    spreadStyle: single ? 'padding: 10px 8px 0; display: flex; justify-content: center' : 'display: flex; flex-wrap: wrap; justify-content: center; align-items: stretch',
    listWrap: single ? 'padding: 12px 10px 150px' : 'max-width: 880px; margin: 0 auto; padding: 18px 0 170px',
    playerOn: !!pl, playerBottom: single ? '64px' : '0px',
    isOpen, showCover: !isOpen, showBody: isOpen && Q,
    closeBook: () => A.set({ book: 'closed', spin: true, ry: -28, rx: -10, side: '', panel: '' }),
    edgePx: single ? '4px' : '16px',
    divStyle: single ? 'display: none' : 'width: 1px; height: 24px; background: var(--line); margin: 0 4px',
    panelGoto: isGoto,
    openGoto: () => A.set({ panel: isGoto ? '' : 'goto' }),
    pageShort: shown.join('–'),
    gotoAria: 'Go to page. Now on ' + (shown.length > 1 ? `pages ${shown.join(' and ')}` : `page ${shown[0]}`),
    modeShort: mode === 'book' ? 'Book' : (mode === 'wbw' ? 'Words' : 'Trans'),
    modeCycleLabel: 'Reading mode: ' + (mode === 'book' ? 'Mushaf' : (mode === 'wbw' ? 'Word by word' : 'Translation')) + '. Tap to change',
    cycleMode: () => A.set({ mode: mode === 'book' ? 'wbw' : (mode === 'wbw' ? 'trans' : 'book') }),
    listenPlaying: !!(pl && pl.playing), listenIdle: !(pl && pl.playing),
    listenLabel: pl && pl.playing ? 'Pause recitation' : 'Listen to recitation',
    practiceBtnStyle: side === 'practice' ? 'background: var(--accentSoft); color: var(--accent)' : '',
    bookPad: single ? '14px 12px 150px' : '26px 24px 150px',
    spreadW: single ? 'var(--pw)' : 'calc(var(--pw) * 2)',
    boardStyle: 'position: absolute; ' + (single ? 'inset: -6px -7px -8px -7px; border-radius: 10px;' : 'inset: -12px -16px -14px -16px; border-radius: 14px;') + ' background: linear-gradient(90deg, #0E2E24, #1B4D3E 6%, #174535 49.4%, #0A241C 50%, #174535 50.6%, #1B4D3E 94%, #0E2E24); box-shadow: 0 40px 70px -30px rgba(0,0,0,.55), 0 10px 24px rgba(0,0,0,.18)',
    turnMs: (TURN_MS / 1000) + 's',
    cv: buildCover(env),
    openPractice: () => A.openPractice(shown),
    startListen: () => A.startListen(shown),
  };
}

function buildCover({ s, A, single, page, book, ry, rx, spin }) {
  const W = single ? 220 : 320;
  const H = single ? 316 : 460;
  const Tk = single ? 40 : 56;
  const dragging = !!s.dragging;
  return {
    dims: `--bw: ${W}px; --bh: ${H}px; --bt: ${Tk}px`,
    stageH: single ? '380px' : 'min(560px, calc(100vh - 290px))',
    transform: book === 'opening'
      ? `rotateX(0deg) rotateY(${Math.round(ry / 360) * 360}deg) scale(1.08)`
      : `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`,
    transition: (dragging || (spin && book === 'closed')) ? 'none' : 'transform .8s cubic-bezier(.3,.1,.2,1)',
    cursor: dragging ? 'grabbing' : 'grab',
    coverAngle: book === 'opening' ? '168deg' : '0deg',
    down(e) {
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
      A.drag = { x: e.clientX, y: e.clientY, ry, rx };
      A.set({ dragging: true, spin: false });
    },
    move(e) {
      const d = A.drag;
      if (!d) return;
      A.set({ ry: d.ry + (e.clientX - d.x) * 0.5, rx: Math.max(-40, Math.min(40, d.rx - (e.clientY - d.y) * 0.3)) });
    },
    up() {
      A.drag = null;
      A.set({ dragging: false });
    },
    left: () => A.set({ spin: false, ry: ry - 45 }),
    right: () => A.set({ spin: false, ry: ry + 45 }),
    spinning: spin, still: !spin, spinLabel: spin ? 'Stop turning' : 'Turn automatically',
    toggleSpin: () => A.set({ spin: !spin }),
    open: () => A.startOpen(1),
    resume: () => A.startOpen(page),
    resumeLabel: `Continue · page ${page}`,
  };
}
