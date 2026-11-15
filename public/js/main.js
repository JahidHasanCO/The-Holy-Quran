import { ReaderController } from './controller/ReaderController.js';
import { BOARDS, DEFAULT_BOARD } from './state/boards.js';
import { loadSaved } from './services/storage.js';
import { initFirebase } from './services/firebase.js';

initFirebase();

const params = new URLSearchParams(location.search);
const view = params.get('view');

// ?view=<board> opens a named starting state (see state/boards.js) without touching saved progress.
const preset = view && BOARDS[view] ? BOARDS[view] : { startPage: 1, startBook: 'closed' };
const board = { ...DEFAULT_BOARD, ...preset, preview: !!view };
for (const key of ['layout', 'theme', 'startPage']) {
  const value = params.get(key);
  if (value) board[key] = key === 'startPage' ? +value : value;
}

new ReaderController({
  root: document.getElementById('app'),
  board,
  savedState: view ? {} : loadSaved(),
}).start();
