import path from 'node:path';
import { TranslationRepository } from '../../domain/repositories/TranslationRepository.js';
import { readJson } from './readJson.js';

/** Translations and word glosses are large, so each file is read once, on first use. */
export class JsonTranslationRepository extends TranslationRepository {
  #dataDir;
  #files = new Map();

  constructor(dataDir) {
    super();
    this.#dataDir = dataDir;
  }

  #file(name) {
    if (!this.#files.has(name)) {
      this.#files.set(name, readJson(path.join(this.#dataDir, name)));
    }
    return this.#files.get(name);
  }

  async getTranslation(language, ayahIndex) {
    const all = await this.#file(`quran-${language}.json`);
    return all[ayahIndex] ?? null;
  }

  async getWordGlosses(ayahIndex) {
    const all = await this.#file('quran-wbw-en.json');
    const words = all[ayahIndex];
    if (!words) return null;
    // Individual words can be unaligned (null) even when the ayah is otherwise covered.
    return words.map((w) => (w ? { transliteration: w[0], meaning: w[1] } : null));
  }
}
