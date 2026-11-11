# Development guide

This repository contains proprietary work. Collaborators must have the owner's permission to work on or distribute it; this guide does not grant a license. See [license.md](license.md).

## Setup

Use Node.js 24 and npm, then run `npm ci` and `npm run dev`. The app processes images locally; do not add image uploads, telemetry, or remote processing without an explicit product decision.

## Before proposing a change

1. Keep changes focused and preserve existing local-first behavior.
2. Run `npm run typecheck`, `npm test`, and `npm run build`.
3. For editor or export changes, run `npm run test:browser` with an installed Microsoft Edge. For offline or PWA changes, run `npm run test:offline` after building.
4. Update [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) when a change affects verified capabilities or known limitations.
5. Document new third-party dependencies or assets in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and verify their licenses.

The browser suites use local servers and Edge by default. Set `GLYPH_BROWSER_CHANNEL` to a compatible installed Playwright channel when necessary. The offline suite exercises the production build rather than Vite's development server.

## Code map

- `src/engine.ts`, `src/animation.ts`, and `src/edge.ts`: character conversion, rendering, and effects.
- `src/segmentation*`, `src/background.ts`, and `src/MaskEditor.tsx`: local background removal and mask refinement.
- `src/export.ts`: GIF and WebM export; PNG and TXT actions are wired through the editor.
- `src/projects.ts`: retained legacy IndexedDB helpers; the current interface does not save or delete projects.
- `src/main.tsx` and `src/style.css`: editor interface and controls.
- `public/models/`: bundled subject-detection model. See the third-party notices before replacing or redistributing it.
- `tests/`: browser workflow and offline tests; unit tests sit beside the engine modules.
