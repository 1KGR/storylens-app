# StoryLens — Frontend Prototype

A cinematic film archive, film-study library, and screenplay-analysis tool.
React + TypeScript + Vite, Tailwind CSS v4, React Router, Framer Motion, and
a real Three.js (`@react-three/fiber`) case object for the archive's
signature physical-media interaction.

## Run it

```
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

```
npm run build
npm run preview
```

## Environment variables (both optional)

Copy `.env.example` to `.env.local` and fill in what you have:

```
VITE_TMDB_API_KEY=      # themoviedb.org v3 API key — real posters/backdrops/runtime
VITE_AI_ENDPOINT=       # URL of your own server route returning AnalysisResult JSON
```

Neither is required — the app runs fully on its own generated cover art and a
structured mock analysis pipeline with both unset, which is the default in
this environment (no credentials are bundled, and this sandbox has no network
path to TMDB or an LLM provider to test against live).

`VITE_AI_ENDPOINT` is deliberately a URL to *your own backend route*, not a
place to put a provider API key — that key should live server-side only and
never ship in a browser bundle.

## What's real vs. mocked

**Real, working without any credentials:**
- Screenplay upload actually reads the file client-side (`pdfjs-dist` for
  PDF, `mammoth` for DOCX, native `File.text()` for TXT) — real page counts,
  real regex-based scene detection (`INT./EXT.` sluglines), real character
  detection (ALL-CAPS cue lines)
- The film-case object is real Three.js (`src/three/`) — actual mesh
  geometry, materials, lighting, and a damped hinge-opening animation, not a
  flat texture
- Tracker drafts are created from actual analysis output, with real deltas
  computed against the previous draft
- All existing navigation, notebook, study reports, skill recommendations

**Real architecture, mock-backed by default in this environment:**
- `src/services/tmdb.ts` makes genuine `fetch()` calls to
  `api.themoviedb.org` — but only when `VITE_TMDB_API_KEY` is set. Unset (the
  default), it resolves to `null` immediately and the UI falls back to
  StoryLens's own generated cover art (canvas-drawn gradient + title, never a
  copyrighted placeholder)
- `src/services/aiService.ts` posts to `VITE_AI_ENDPOINT` and expects back
  structured JSON matching `AnalysisResult`. Unset, it runs
  `buildMockAnalysis()` — the same schema, filled in from what the parser
  actually found in your file, clearly labeled "Structured mock pipeline" in
  the UI (never "Pacing: 68/100" — every weakness explains what/where/why/try)

## Structure

- `src/services/` — TMDB client, AI service + schema, screenplay parser, env config
- `src/three/` — the 3D case object, canvas wrapper, cover-texture generator
- `src/data/` — curated film metadata (17 real released films, original
  StoryLens commentary — no scraped scripts, no hardcoded copyrighted images)
- `src/lib/` — role-specific study findings generator, scene anatomy, mock reviews
- `src/state/` — app state (localStorage-persisted) and the case-stage
  (pick-up/open/close) controller
- `src/components/`, `src/pages/` — UI

## Known limitations

- No real TMDB or LLM credentials are configured in this environment, so
  every screenshot/demo you see here runs on generated art + the mock
  pipeline. The architecture is real; wiring in real keys is a `.env.local`
  edit away, no code changes needed.
- The Three.js case is used for the single "focused" open-case moment only
  — the shelf stays CSS 3D deliberately, since rendering ~15+ simultaneous
  WebGL contexts for a browsing shelf would hurt performance for no real
  visual gain at that size.
- `pdfjs-dist`/`mammoth`/Three.js are code-split (dynamic `import()`) so they
  only load when actually used — the initial bundle is ~470KB, not the ~1.8MB
  it would be if all three loaded eagerly.
- Letterboxd stays a clearly-labeled simulated connection, per the product
  brief — no fake API calls are made.
