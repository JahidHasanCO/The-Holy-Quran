import { Router } from 'express';

const handle = (fn) => (req, res, next) => fn(req, res).catch(next);

export function quranRoutes({ listSurahs, getSurah, listJuz, listPages, getPage, getAyah }) {
  const router = Router();

  router.get('/surahs', handle(async (_req, res) => res.json(await listSurahs.execute())));

  router.get('/surahs/:number', handle(async (req, res) =>
    res.json(await getSurah.execute({ number: req.params.number }))));

  router.get('/juz', handle(async (_req, res) => res.json(await listJuz.execute())));

  router.get('/pages', handle(async (_req, res) => res.json(await listPages.execute())));

  router.get('/pages/:page', handle(async (req, res) =>
    res.json(await getPage.execute({ page: req.params.page, language: req.query.lang }))));

  router.get('/ayahs/:surah/:ayah', handle(async (req, res) =>
    res.json(await getAyah.execute({
      surah: req.params.surah,
      ayah: req.params.ayah,
      language: req.query.lang,
    }))));

  return router;
}
