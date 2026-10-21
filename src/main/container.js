import { JsonQuranRepository } from '../infrastructure/persistence/JsonQuranRepository.js';
import { JsonTranslationRepository } from '../infrastructure/persistence/JsonTranslationRepository.js';
import { ListSurahs } from '../application/use-cases/ListSurahs.js';
import { GetSurah } from '../application/use-cases/GetSurah.js';
import { ListJuz } from '../application/use-cases/ListJuz.js';
import { ListPages } from '../application/use-cases/ListPages.js';
import { GetPage } from '../application/use-cases/GetPage.js';
import { GetAyah } from '../application/use-cases/GetAyah.js';

/** Composition root: the only place that knows which implementation backs each port. */
export async function buildUseCases({ dataDir }) {
  const quranRepository = await JsonQuranRepository.load(dataDir);
  const translationRepository = new JsonTranslationRepository(dataDir);
  const deps = { quranRepository, translationRepository };

  return {
    listSurahs: new ListSurahs(deps),
    getSurah: new GetSurah(deps),
    listJuz: new ListJuz(deps),
    listPages: new ListPages(deps),
    getPage: new GetPage(deps),
    getAyah: new GetAyah(deps),
  };
}
