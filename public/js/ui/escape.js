/** Interpolation helpers used by readerView.js. Missing values and `false` render as nothing. */
const blank = (v) => v === undefined || v === null || v === false;

export const esc = (v) => (blank(v) ? '' : String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
export const attr = (v) => esc(v).replace(/"/g, '&quot;');
export const bool = (name, v) => (v ? ` ${name}` : '');
