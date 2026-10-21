import { morph } from './morph.js';

const EVENTS = ['click', 'change', 'input', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel'];

/**
 * Renders HTML strings into a root element. Templates register handlers with `on(fn)`, which returns an id
 * for a `data-on-<event>` attribute; a single delegated listener per event type routes events back.
 */
export class Renderer {
  #root;
  #handlers = [];

  constructor(root) {
    this.#root = root;
    for (const type of EVENTS) root.addEventListener(type, (e) => this.#dispatch(type, e));
  }

  render(template) {
    const handlers = [];
    const on = (fn) => (typeof fn === 'function' ? handlers.push(fn) - 1 : '');
    const html = template(on);
    this.#handlers = handlers;
    morph(this.#root, html);
  }

  #dispatch(type, event) {
    const attribute = `data-on-${type}`;
    for (let el = event.target; el && el !== this.#root.parentNode; el = el.parentElement) {
      const id = el.getAttribute?.(attribute);
      if (id === null || id === undefined || id === '') continue;
      Object.defineProperty(event, 'currentTarget', { value: el, configurable: true });
      this.#handlers[+id]?.(event);
    }
  }
}
