import { NotFoundError } from '../../domain/errors.js';
import { presentSurah } from '../presenters.js';
import { requireInteger } from '../validation.js';

export class GetSurah {
  constructor({ quranRepository }) {
    this.quran = quranRepository;
  }

  async execute({ number }) {
    const n = requireInteger(number, 'surah', 1, 114);
    const surah = await this.quran.getSurah(n);
    if (!surah) throw new NotFoundError(`Surah ${n} not found`);
    return presentSurah(surah);
  }
}
