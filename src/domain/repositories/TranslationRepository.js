/**
 * Port: ayah translations and word-by-word glosses.
 */
export class TranslationRepository {
  static LANGUAGES = Object.freeze(['bn', 'en']);

  /** @returns {Promise<string | null>} */
  async getTranslation(language, ayahIndex) { throw new Error('not implemented'); }

  /**
   * @returns {Promise<Array<{ transliteration: string, meaning: string }> | null>}
   * one entry per word of the ayah, or null when the ayah is not aligned
   */
  async getWordGlosses(ayahIndex) { throw new Error('not implemented'); }
}
