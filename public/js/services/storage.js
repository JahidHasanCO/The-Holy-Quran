const KEY = 'qr:v1';
export const PERSISTED = ['page', 'theme', 'lang', 'fontScale', 'bookmarks', 'user', 'mode', 'player'];

export function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function save(state) {
  try {
    const out = {};
    for (const k of PERSISTED) if (state[k] !== undefined) out[k] = state[k];
    if (out.player) out.player = { ...out.player, playing: false, t: 0 };
    localStorage.setItem(KEY, JSON.stringify(out));
  } catch {
    /* storage unavailable (private mode, quota): preferences just won't persist */
  }
}
