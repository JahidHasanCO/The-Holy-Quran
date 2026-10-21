/** Minimal observable state. Updates made in the same tick notify subscribers once. */
export class Store {
  #state;
  #listeners = new Set();
  #scheduled = false;

  constructor(initial) {
    this.#state = initial;
  }

  get state() {
    return this.#state;
  }

  set(patch) {
    this.#state = { ...this.#state, ...(typeof patch === 'function' ? patch(this.#state) : patch) };
    if (this.#scheduled) return;
    this.#scheduled = true;
    queueMicrotask(() => {
      this.#scheduled = false;
      this.#listeners.forEach((fn) => fn(this.#state));
    });
  }

  subscribe(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }
}
