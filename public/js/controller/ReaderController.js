import { Store } from '../state/store.js';
import { TURN_MS } from '../state/constants.js';
import { QuranData } from '../services/quranData.js';
import { AyahAudio, SPEEDS } from '../services/audio.js';
import { PERSISTED, save } from '../services/storage.js';
import { buildViewModel } from '../viewmodel/index.js';
import { createEnv } from '../viewmodel/env.js';
import { readerView } from '../ui/readerView.js';
import { Renderer } from '../ui/Renderer.js';
import { LAST_PAGE, nextKey, previousKey } from '../lib/quranNav.js';
import { clamp } from '../lib/format.js';

const OPEN_MS = 1700;
const PRACTICE_MS = 3200;
const TOAST_MS = 2400;

/**
 * Owns state, side effects (data loading, audio, timers) and rendering. The view-model builders only read;
 * everything they can trigger goes through `actions`.
 */
export class ReaderController {
  #store;
  #data = new QuranData();
  #renderer;
  #board;
  #env = null;
  #timers = {};
  #audio;
  #audioLoaded = false;
  #savedSnapshot = '';
  #mq = window.matchMedia('(max-width: 760px)');

  /** Handed to view-model builders. Methods are bound so templates can pass them around freely. */
  actions = {
    drag: null,
    set: (patch) => this.#store.set(patch),
    say: (message) => this.#say(message),
    go: (page) => this.#go(page),
    turnTo: (dir) => this.#turnTo(dir),
    startOpen: (target) => this.#startOpen(target),
    selectWord: (key, j) => this.#store.set({ sel: { a: key, j }, side: 'word' }),
    ensureAyah: (key) => this.#ensureAyah(key),
    openPractice: (shown) => this.#openPractice(shown),
    startPractice: () => this.#startPractice(),
    stopPractice: () => this.#stopPractice(),
    startListen: (shown) => this.#startListen(shown),
    playAyah: (key) => this.#playAyah(key),
    setPlayer: (player) => this.#setPlayer(player),
    togglePlay: (player) => this.#togglePlay(player),
    stepAyah: (player, direction) => this.#stepAyah(player, direction),
    closePlayer: () => this.#closePlayer(),
    setReciter: (reciter) => this.#setReciter(reciter),
  };

  constructor({ root, board, savedState }) {
    this.#board = board;
    this.#renderer = new Renderer(root);
    this.#store = new Store({ ...savedState, narrow: this.#mq.matches });
    this.#audio = new AyahAudio({
      onPlaying: (playing) => this.#patchPlayer({ playing }),
      onProgress: (fraction) => this.#patchPlayer({ t: fraction }),
      onEnded: () => this.#onAudioEnded(),
      onError: () => {
        this.#say('Audio could not be played. Check your connection.');
        this.#patchPlayer({ playing: false });
      },
    });
  }

  start() {
    this.#mq.addEventListener('change', () => this.#store.set({ narrow: this.#mq.matches }));
    this.#store.subscribe((state) => {
      this.#persist(state);
      this.#render();
    });
    window.addEventListener('resize', () => this.#store.set({ vh: window.innerHeight }));
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY > 0;
      if (scrolled !== !!this.#store.state.scrolled) this.#store.set({ scrolled });
    }, { passive: true });
    this.#spinCover();
    this.#render();
  }

  // ---------- rendering and data ----------

  #render() {
    const input = { state: this.#store.state, board: this.#board, data: this.#data, actions: this.actions };
    this.#env = createEnv(input);
    this.#requestData(this.#env);
    this.#renderer.render((on) => readerView(buildViewModel(input), on));
  }

  #requestData(env) {
    const { data, lang, display, turn, sel, side, s, board, shown } = env;
    const refresh = () => this.#store.set({});
    const load = (promise) => promise.then(refresh, (err) => this.#store.set({ error: err.message }));

    if (!data.ready) load(data.loadCatalog());

    const pages = new Set(display);
    if (turn) [turn.from, turn.to, turn.from + 1, turn.to + 1].forEach((p) => pages.add(p));
    for (const p of pages) if (p >= 1 && p <= LAST_PAGE && !data.hasPage(p, lang)) load(data.loadPage(p, lang));

    if (!data.ready) return;
    // Warm the neighbouring spreads so turning a page is instant.
    const step = shown.length;
    for (const p of [shown[0] - step, shown[0] + step]) {
      if (p >= 1 && p <= LAST_PAGE && !data.hasPage(p, lang)) data.loadPage(p, lang).catch(() => {});
    }
    if (sel) this.#loadAyah(sel.a, lang, load);
    if (side === 'practice') {
      const f0 = data.pageIndex[shown[0] - 1];
      const key = s.pAyah ?? (board.practiceKey || `${f0.surah}:${f0.ayah}`);
      this.#loadAyah(key, lang, load);
    }
  }

  #loadAyah(key, lang, load) {
    const have = this.#data.ayah(key, lang);
    if (!have) load(this.#data.loadAyah(key, lang));
  }

  async #ensureAyah(key) {
    const lang = this.#store.state.lang || 'bn';
    if (!this.#data.ayah(key, lang)) await this.#data.loadAyah(key, lang);
  }

  #persist(state) {
    const snapshot = JSON.stringify(PERSISTED.map((k) => (k === 'player' && state.player ? { ...state.player, t: 0 } : state[k])));
    if (snapshot === this.#savedSnapshot || this.#board.preview) return;
    this.#savedSnapshot = snapshot;
    save(state);
  }

  // ---------- navigation ----------

  #say(message) {
    this.#store.set({ toast: message });
    clearTimeout(this.#timers.toast);
    this.#timers.toast = setTimeout(() => this.#store.set({ toast: '' }), TOAST_MS);
  }

  #go(page) {
    this.#store.set({ page: clamp(page | 0, 1, LAST_PAGE), panel: '', gotoVal: '', turn: null });
  }

  async #turnTo(dir) {
    const env = this.#env;
    const { s, single, mode, data, lang } = env;
    if (s.turn) return;
    const cur = s.page || this.#board.startPage;
    const r0 = single ? cur : (cur % 2 ? cur : cur - 1);
    const target = single ? (dir === 'next' ? cur + 1 : cur - 1) : (dir === 'next' ? r0 + 2 : r0 - 2);
    if (target < 1 || target > LAST_PAGE) return;
    if (mode !== 'book' || !data.ready) return this.#go(target);

    await Promise.all([r0, r0 + 1, target, target + 1]
      .filter((p) => p >= 1 && p <= LAST_PAGE)
      .map((p) => data.loadPage(p, lang))).catch(() => {});
    this.#store.set({ turn: { dir, from: r0, to: target, single }, page: target, panel: '' });
    clearTimeout(this.#timers.turn);
    this.#timers.turn = setTimeout(() => this.#store.set({ turn: null }), TURN_MS + 40);
  }

  #startOpen(target) {
    const ry = this.#store.state.ry ?? -28;
    this.#store.set({ book: 'opening', spin: false, dragging: false, ry: Math.round(ry / 360) * 360, rx: 0, page: target, panel: '' });
    clearTimeout(this.#timers.open);
    this.#timers.open = setTimeout(() => this.#store.set({ book: 'open' }), OPEN_MS);
  }

  /** Slowly turns the closed book until the user drags it or presses pause. */
  #spinCover() {
    let frame = 0;
    const loop = () => {
      frame++;
      const s = this.#store.state;
      const book = s.book || this.#board.startBook;
      const spin = s.spin !== undefined ? s.spin : true;
      if (book === 'closed' && spin && !s.dragging && frame % 2 === 0) {
        this.#store.set({ ry: (s.ry !== undefined ? s.ry : -28) + 0.6 });
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  // ---------- practice (front-end demo) ----------

  #openPractice(shown) {
    const f0 = this.#data.pageIndex[shown[0] - 1];
    const s = this.#store.state;
    this.#store.set({ side: 'practice', pAyah: s.pAyah ?? `${f0.surah}:${f0.ayah}`, pStage: 'idle' });
  }

  #startPractice() {
    this.#store.set({ pStage: 'listening' });
    clearTimeout(this.#timers.listen);
    this.#timers.listen = setTimeout(() => this.#store.set({ pStage: 'result' }), PRACTICE_MS);
  }

  #stopPractice() {
    clearTimeout(this.#timers.listen);
    this.#store.set({ pStage: 'result' });
  }

  // ---------- audio ----------

  #player() {
    return this.#env.pl;
  }

  #patchPlayer(patch) {
    const pl = this.#store.state.player;
    if (pl) this.#store.set({ player: { ...pl, ...patch } });
  }

  #startAudio(player) {
    this.#audioLoaded = true;
    this.#audio.load({ reciter: player.reciter, key: player.ayah, speed: SPEEDS[player.speed || 0] });
  }

  #playAyah(key) {
    const pl = this.#player();
    const next = { ayah: key, playing: true, t: 0, reciter: pl?.reciter || this.#store.state.reciter || 'alafasy', speed: pl?.speed || 0, repeat: false };
    this.#store.set({ player: next });
    this.#startAudio(next);
    this.#followPage(key);
  }

  #setPlayer(next) {
    const prev = this.#player();
    this.#store.set({ player: next });
    if (!prev || !this.#audioLoaded) return;
    if (next.speed !== prev.speed) this.#audio.setSpeed(SPEEDS[next.speed || 0]);
    if (next.reciter !== prev.reciter && next.playing) this.#startAudio(next);
  }

  #setReciter(reciter) {
    this.#store.set({ reciter });
    const pl = this.#player();
    if (pl) this.#setPlayer({ ...pl, reciter });
  }

  #togglePlay(player) {
    if (!this.#audioLoaded) {
      if (player.playing) this.#store.set({ player: { ...player, playing: false } });
      else { this.#store.set({ player: { ...player, playing: true } }); this.#startAudio(player); }
      return;
    }
    if (player.playing) this.#audio.pause();
    else this.#audio.resume();
  }

  #stepAyah(player, direction) {
    const surahs = this.#data.surahs;
    const key = direction > 0 ? nextKey(player.ayah, surahs) : previousKey(player.ayah, surahs);
    if (!key) return;
    const next = { ...player, ayah: key, t: 0 };
    this.#store.set({ player: next });
    if (player.playing) this.#startAudio(next);
    else { this.#audio.stop(); this.#audioLoaded = false; }
    this.#followPage(key);
  }

  #closePlayer() {
    this.#audio.stop();
    this.#audioLoaded = false;
    this.#store.set({ player: null });
  }

  #onAudioEnded() {
    const pl = this.#store.state.player;
    if (!pl) return;
    const key = pl.repeat ? pl.ayah : nextKey(pl.ayah, this.#data.surahs);
    if (!key) return this.#store.set({ player: { ...pl, playing: false, t: 1 } });
    const next = { ...pl, ayah: key, t: 0 };
    this.#store.set({ player: next });
    this.#startAudio(next);
    this.#followPage(key);
  }

  #startListen(shown) {
    const pl = this.#player();
    if (pl) return this.#togglePlay(pl);
    const f0 = this.#data.pageIndex[shown[0] - 1];
    this.#playAyah(`${f0.surah}:${f0.ayah}`);
  }

  /** Turns the page when playback moves onto an ayah that is not currently visible. */
  #followPage(key) {
    const np = this.#data.pagesFor(key)[0];
    if (!np) return;
    const s = this.#store.state;
    const cur = s.page || this.#board.startPage;
    const single = this.#board.layout === 'single' || !!s.narrow;
    const shownEnd = single ? cur : (cur % 2 ? cur + 1 : cur);
    const shownStart = single ? cur : (cur % 2 ? cur : cur - 1);
    if (np > shownEnd || np < shownStart) this.#store.set({ page: np });
  }
}
