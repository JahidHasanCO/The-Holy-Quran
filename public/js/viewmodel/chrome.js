import { TURN_MS } from '../state/constants.js';
import { RECITERS } from '../services/audio.js';
import { LAST_PAGE } from '../lib/quranNav.js';
import { signInWithGoogle, signOutUser } from '../services/firebase.js';

const SEG_ON = 'background: var(--paper); color: var(--ink); box-shadow: 0 1px 2px rgba(0,0,0,.14)';
const OPTION_ON = 'border-color: var(--accent); border-width: 2px';

/** Top bar, dock, panels' open/close handlers and everything that does not depend on loaded pages. */
export function buildChrome(env) {
  const { s, A, T, themeName, single, page, mode, lang, fsc, panel, side, user, book, isOpen, shown, Q, pl } = env;
  const sideW = side ? '412px' : '0px';
  const pageFit = s.pageFit || 'width';
  const pwExpr = single
    ? 'calc(100vw - 26px)'
    : pageFit === 'fit'
      // Fit screen: the whole spread fits the window height (page height ≈ 1.714 × width − 23px, measured);
      // width only takes over when the window is too narrow. 150px = header + top gap + room for the dock.
      ? `max(240px, min(calc((100vw - 72px - ${sideW}) / 2), calc((100vh - 150px) / 1.72)))`
      // Fill width: pages use all the horizontal space and the spread scrolls.
      : `max(240px, calc((100vw - 72px - ${sideW}) / 2))`;
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
      fitWidth: pageFit === 'width' ? OPTION_ON : '', fitScreen: pageFit === 'fit' ? OPTION_ON : '',
    },
    setBook: () => A.set({ mode: 'book' }),
    setWbw: () => A.set({ mode: 'wbw' }),
    setTrans: () => A.set({ mode: 'trans' }),
    lang, isBn: lang === 'bn', isEn: lang === 'en',
    setBn: () => A.set({ lang: 'bn' }),
    setEn: () => A.set({ lang: 'en' }),
    transSource: lang === 'bn' ? 'Bangla · Muhiuddin Khan' : 'English · Saheeh International',
    isPaper: themeName === 'paper', isNight: themeName === 'night',
    fitWidth: pageFit === 'width', fitScreen: pageFit === 'fit',
    setFitWidth: () => A.set({ pageFit: 'width' }),
    setFitScreen: () => A.set({ pageFit: 'fit' }),
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
    async signInGoogle() {
      try {
        const u = await signInWithGoogle();
        A.set({ user: u, panel: '' });
        A.say('Signed in with Google · progress will sync');
      } catch (err) {
        if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
        A.say(err?.code === 'auth/popup-blocked' ? 'Allow pop-ups to sign in' : 'Sign-in failed. Please try again.');
      }
    },
    async signOut() {
      try { await signOutUser(); } catch { /* the local sign-out below still applies */ }
      A.set({ user: null, panel: '' });
      A.say('Signed out');
    },
    hasToast: !!s.toast, toast: s.toast || '',
    tabSurah: (s.tab || 'surah') === 'surah', tabJuz: s.tab === 'juz',
    showSurahTab: () => A.set({ tab: 'surah' }), showJuzTab: () => A.set({ tab: 'juz' }),
    query: s.query || '', onQuery: (e) => A.set({ query: e.target.value }),
    reciters: RECITERS,
    reciterId: (pl && pl.reciter) || s.reciter || 'alafasy',
    onReciter: (e) => A.setReciter(e.target.value),
    // Phones have no room for everything while audio plays: keep page arrows and audio controls.
    dockExtras: !(single && pl),
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
    bookPad: single ? '14px 12px 150px' : '14px 24px 88px',
    spreadW: single ? 'var(--pw)' : 'calc(var(--pw) * 2)',
    boardStyle: 'position: absolute; ' + (single ? 'inset: -6px -7px -8px -7px; border-radius: 10px;' : 'inset: -12px -16px -14px -16px; border-radius: 14px;') + ' background: linear-gradient(90deg, color-mix(in srgb, var(--primary) 50%, black), color-mix(in srgb, var(--primary) 88%, black) 6%, color-mix(in srgb, var(--primary) 75%, black) 49.4%, color-mix(in srgb, var(--primary) 40%, black) 50%, color-mix(in srgb, var(--primary) 75%, black) 50.6%, color-mix(in srgb, var(--primary) 88%, black) 94%, color-mix(in srgb, var(--primary) 50%, black)); box-shadow: 0 40px 70px -30px rgba(0,0,0,.55), 0 10px 24px rgba(0,0,0,.18)',
    turnMs: (TURN_MS / 1000) + 's',
    cv: buildCover(env),
    headerStyle: headerStyle(env),
    shellBg: showCoverWhite(env) ? coverGlow(single) : 'var(--bg)',
    coverBg: 'transparent',
    openPractice: () => A.openPractice(shown),
    startListen: () => A.startListen(shown),
  };
}

function buildCover({ s, A, single, page, book, ry, rx, spin }) {
  // Whole pixels, scaled to the window height so the cover fits without scrolling (same proportions as the design).
  const vh = s.vh || window.innerHeight;
  const H = Math.round(single ? Math.min(316, Math.max(180, vh - 400)) : Math.min(460, Math.max(220, vh - 230)));
  const W = Math.round(H * (single ? 220 / 316 : 320 / 460));
  const Tk = Math.round(H * (single ? 40 / 316 : 56 / 460));
  const dragging = !!s.dragging;
  return {
    // Wide screens: book on the left, title and buttons on the right. Phones: stacked and centred.
    pageLayout: single
      ? 'flex-direction: column; align-items: center; justify-content: center; gap: 22px'
      : 'flex-direction: row; align-items: center; justify-content: center; gap: 72px',
    stageW: single ? '100%' : 'min(560px, 48%)',
    infoLayout: single ? 'align-items: center; text-align: center; margin-top: 28px' : 'align-items: flex-start; text-align: left',
    alignItems: single ? 'center' : 'flex-start',
    dims: `--bw: ${W}px; --bh: ${H}px; --bt: ${Tk}px`,
    stageH: `${H + (single ? 64 : 90)}px`,
    transform: book === 'opening'
      ? `rotateX(0deg) rotateY(${Math.round(ry / 360) * 360}deg) scale(1.08)`
      : `rotateX(${rx.toFixed(1)}deg) rotateY(${ry.toFixed(1)}deg)`,
    transition: (dragging || (spin && book === 'closed')) ? 'none' : 'transform .8s cubic-bezier(.3,.1,.2,1)',
    cursor: dragging ? 'grabbing' : 'grab',
    coverAngle: book === 'opening' ? '168deg' : '0deg',
    firstPage: book === 'opening' ? 'visible' : 'hidden',
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

// The cover is plain white in the light theme; night keeps its dark background.
// White page with blurred glows in the primary green (the same var(--primary) as the buttons): behind the book and in the corners.
const coverGlow = (single) => [
  // behind the title and buttons
  `radial-gradient(ellipse 45% 50% at ${single ? '50% 82%' : '76% 50%'}, color-mix(in srgb, var(--primary) 30%, transparent), color-mix(in srgb, var(--primary) 10%, transparent) 55%, color-mix(in srgb, var(--primary) 0%, transparent) 80%)`,
  'radial-gradient(ellipse 55% 75% at 26% 52%, color-mix(in srgb, var(--primary) 38%, transparent), color-mix(in srgb, var(--primary) 12%, transparent) 55%, color-mix(in srgb, var(--primary) 0%, transparent) 80%)',
  'radial-gradient(ellipse 45% 60% at 100% 100%, color-mix(in srgb, var(--primary) 30%, transparent), color-mix(in srgb, var(--primary) 0%, transparent) 75%)',
  'radial-gradient(ellipse 40% 50% at 85% 0%, color-mix(in srgb, var(--primary) 18%, transparent), color-mix(in srgb, var(--primary) 0%, transparent) 75%)',
  'radial-gradient(ellipse 30% 40% at 0% 100%, color-mix(in srgb, var(--primary) 14%, transparent), color-mix(in srgb, var(--primary) 0%, transparent) 75%)',
  'linear-gradient(135deg, color-mix(in srgb, var(--primary) 6%, transparent), color-mix(in srgb, var(--primary) 0%, transparent) 45%, color-mix(in srgb, var(--primary) 9%, transparent))',
  '#FFFFFF',
].join(', ');
const showCoverWhite = ({ themeName, isOpen }) => !isOpen && themeName === 'paper';

const GLASS = 'background: var(--barGlass); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px); border-bottom: 1px solid var(--line)';
// On the white cover the bar is clear at the top, then turns into frosted white glass with a green hairline.
const COVER_GLASS = 'background: rgba(255,255,255,.55); backdrop-filter: blur(18px) saturate(1.4); -webkit-backdrop-filter: blur(18px) saturate(1.4); border-bottom: 1px solid color-mix(in srgb, var(--primary) 14%, transparent); box-shadow: 0 6px 24px color-mix(in srgb, var(--primary) 6%, transparent)';
const COVER_CLEAR = 'background: transparent; border-bottom: 1px solid transparent';

function headerStyle(env) {
  if (env.isOpen) return GLASS;
  if (!showCoverWhite(env)) return env.s.scrolled ? GLASS : COVER_CLEAR;
  return (env.s.scrolled ? COVER_GLASS : COVER_CLEAR) + '; transition: background .2s, border-color .2s';
}
