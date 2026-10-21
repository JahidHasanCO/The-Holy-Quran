# Quran Reader

Mushaf-style Quran reader: 604 Madinah Mushaf pages, Bangla / English translation, word-by-word meanings,
per-ayah audio. Node.js (Express) API + a dependency-free ES-module frontend.

    npm install
    npm start          # http://localhost:3000   (PORT env var to change)
    npm run dev        # restart on change
    npm test

## Architecture

Dependencies point inward: `infrastructure` -> `application` -> `domain`. `main` wires them together.

    src/
      domain/                  no I/O, no framework
        entities/              Surah, Ayah
        repositories/          ports: QuranRepository, TranslationRepository
        services/              buildPageLines (raw Mushaf layout -> typed lines)
        errors.js              NotFoundError, ValidationError
      application/
        use-cases/             ListSurahs, GetSurah, ListJuz, GetPage, GetAyah
        presenters.js          entity -> response shape
        validation.js          input checks (throw ValidationError)
      infrastructure/
        persistence/           JSON-file implementations of the ports (reads data/)
        http/                  Express app, routes, error -> status mapping
      main/                    config, composition root (container.js), server entry
    public/                    frontend (see below)
    data/                      Quran text, layout, translations, word-by-word (JSON)
    tools/data-build/          scripts that generated data/ (run from the repo root)
    test/                      node:test API tests

To swap storage (SQLite, a remote API, ...) implement the two repository ports and change `main/container.js`.

### HTTP API

    GET /api/surahs                        114 surahs
    GET /api/surahs/:n
    GET /api/juz                           start of each juz
    GET /api/pages                         where each of the 604 pages starts (juz, hizb, first ayah)
    GET /api/pages/:n?lang=bn|en           typed Mushaf lines + ayahs (text, translation, word glosses)
    GET /api/ayahs/:surah/:ayah?lang=bn|en ayah detail with previous/next keys
    GET /health

### Frontend (`public/`)

Plain ES modules, no build step. The look is the original design, pixel for pixel: `css/app.css` and the markup in
`js/ui/readerView.js` are carried over unchanged; only the data and logic behind them were rebuilt.

    js/main.js                 boot: picks the starting board, creates the controller
    js/controller/             ReaderController: state, data loading, audio, timers, rendering
    js/viewmodel/              pure builders: state + data -> the object the template reads
    js/ui/                     readerView (template), Renderer (event delegation), morph (DOM patching)
    js/services/               API client, data cache, audio, localStorage
    js/state/                  store, constants (themes), boards (named starting states)
    js/lib/                    formatting, ayah-key arithmetic

`?view=cover|reading|word|practice|signin|phone-cover|phone|phone-words|phone-practice` opens a named starting state
(see `js/state/boards.js`) without touching saved progress.

Preferences (page, mode, language, theme, text size, bookmarks, reciter) persist in `localStorage`.

Front-end demos, as in the design: "Sign in with Google" and the practice-recitation result are illustrative only
(no account, no speech analysis). Audio is real (everyayah.com).

## Data sources

Sources and licences: [public/about.html](public/about.html).
Data shape: `quran-ar.json` has surah metadata, 6,236 ayahs `[surah, ayah, page, juz, hizb]` and Uthmani text;
`quran-lines.json` has 604 pages x 15 lines where a word code is `ayahIndex*256 + wordIndex` (255 = ayah-end marker),
`'S'` a surah header, `'B'` a basmala.
