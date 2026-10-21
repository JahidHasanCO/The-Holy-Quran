import { THEMES } from '../state/constants.js';
import { LAST_PAGE } from '../lib/quranNav.js';

/**
 * Everything the view-model builders derive once per render from state, the starting board and loaded data.
 * @param {{ state: object, board: object, data: import('../services/quranData.js').QuranData, actions: object }} input
 */
export function createEnv({ state: s, board, data, actions }) {
  const themeName = s.theme || board.theme;
  const single = board.layout === 'single' || !!s.narrow;
  const page = s.page || board.startPage;
  const mode = s.mode || board.startMode;
  const lang = s.lang || 'bn';
  const fsc = s.fontScale || 1;
  const panel = s.panel !== undefined ? s.panel : (board.startPanel === 'none' ? '' : board.startPanel);
  const side = s.side !== undefined ? s.side : board.startSide;
  const user = s.user !== undefined ? s.user : (board.signedIn ? { name: 'Your Name', email: 'you@gmail.com' } : null);
  const bookmarks = s.bookmarks || [];
  const book = s.book || board.startBook;
  const turn = s.turn || null;

  const right = single ? page : (page % 2 ? page : page - 1);
  const shown = single ? [page] : [right, right + 1].filter((p) => p <= LAST_PAGE);
  let display = shown;
  if (turn && mode === 'book') {
    if (single) display = turn.dir === 'next' ? [page] : [turn.from];
    else display = turn.dir === 'next' ? [turn.from, page + 1] : [page, turn.from + 1];
  }

  const needed = new Set(display);
  if (turn) [turn.from, turn.to, turn.from + 1, turn.to + 1].forEach((p) => p >= 1 && p <= LAST_PAGE && needed.add(p));
  const Q = data.ready && [...needed].every((p) => data.page(p, lang));

  return {
    s, board, data, A: actions,
    T: THEMES[themeName] || THEMES.paper,
    themeName, single, page, mode, lang, fsc, panel, side, user, bookmarks, book, turn,
    isOpen: book === 'open',
    right, shown, display, Q,
    ry: s.ry !== undefined ? s.ry : -28,
    rx: s.rx !== undefined ? s.rx : -10,
    spin: s.spin !== undefined ? s.spin : true,
    pl: playerState(s, board, data),
    sel: selection(s, board, data),
  };
}

function playerState(s, board, data) {
  if (s.player !== undefined) return s.player;
  if (data.ready && board.playKey) {
    return { ayah: board.playKey, playing: true, t: 0.35, reciter: 'alafasy', speed: 0, repeat: false };
  }
  return null;
}

function selection(s, board, data) {
  if (s.sel !== undefined) return s.sel;
  if (data.ready && board.selKey) return { a: board.selKey, j: board.selWord };
  return null;
}
