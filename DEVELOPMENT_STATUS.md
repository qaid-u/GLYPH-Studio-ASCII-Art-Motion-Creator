# GLYPH Studio — Development Status

## Attribution — 2026-11-11

- Added creator attribution and a 2026 copyright notice for Muhammad Qaid Uqail (@qaid-u) to the README and proprietary rights draft. Third-party licenses remain applicable; the rights draft remains subject to owner review.

## Security and performance — 2026-11-11

- Added Vercel security headers, including a same-origin Content Security Policy, frame restrictions, MIME sniffing protection, and a restrictive permissions policy. Hashed assets have immutable cache headers; the fixed-name model has a shorter cache lifetime. The public client and its model remain downloadable by design.
- The Vercel managed AI-bot rule denies identified AI bots; general Bot Protection is in log mode. These measures deter some automated traffic but do not prevent scraping or reverse engineering. Vercel logs provide aggregate traffic visibility without adding an analytics script.
- The PWA precache decreased from approximately 19,381 KiB to 413 KiB (uncompressed manifest sizes) by caching the subject model and WebAssembly runtime on first use. Subject removal requires a network connection on its first use; subsequent offline use was tested after caching. Bump the model cache version if the fixed-name model changes.
- Animation previews are capped at approximately 30 updates per second. Test playback and exports on slower devices before treating this as a performance guarantee.
- Verification: lint, typecheck, 26 unit tests, build, 29 browser tests, and 3 production-preview CSP/offline tests passed. Test results do not prove the site cannot be copied or attacked.

## Converter refinement — 2026-11-11

- Homepage presents ASCII as the same kind of card and dedicated route as the seven other converters. ASCII state stays mounted when navigating away.
- Added adjustable dithering strength/phase; datamosh axis, rate and channel separation; blob bright/dark/color detection, label/connection toggles and region count; flashlight paths, position and flicker; receipt paper width, texture and torn edge; CRT channel separation, vignette, noise and flicker; and phosphor bloom radius, ghosting and pulse.
- Verification: basic lint, TypeScript, build, 26 unit tests, 28 Edge browser tests and offline check passed. Seven browser tests verify that representative detailed controls change the rendered image; no claim of exclusivity versus other products.
- Remaining limitations: effects are procedural and not a complete implementation of every earlier requested parameter. CRT channel processing and model processing can be expensive on slower devices; broader browser, mobile and accessibility testing is needed. Vercel deployment outcome is reported separately from source checks.

## Latest update — 2026-11-11

- Removed local project-saving, autosave, and project-list controls from the ASCII editor and all converter workspaces. Existing IndexedDB records are deliberately left untouched; they are not currently accessible through the interface.
- Detailed ASCII and converter controls are collapsed by default. PNG exports from the seven image converters now render from the source at up to 2048 px on the longest edge and four megapixels; one-bit detail can be increased to 1200 samples across, and receipts render at 1200 px paper width while preserving the image aspect ratio. Blob analysis now fits within a 320 × 320 grid, including extreme portrait images.
- Verification: typecheck, basic lint, production build, 23 unit tests, 20 Edge browser tests, and the offline suite passed. Browser checks cover collapsible controls, 1600 × 1200 PNG export, existing-data preservation, all converters and previous ASCII flows.
- Remaining limitations: converter effects cannot preserve detail beyond source data or the export limits. The model-based background remover remains approximate; masks use a 320 × 320 model grid. Video preview/export remains bounded and browser-dependent. Advanced converter options and broader device/accessibility testing remain outstanding.

## Prior development history


Updated: 2026-11-11  
Repository state: Working prototype; further device testing needed.

## Implemented
- Local image input, editable ASCII settings, quick looks, edge emphasis, source preview, aspect-ratio and contain/cover controls.
- On-device U²-Net subject removal with threshold and keep/erase mask brushes; simple edge-color removal remains available. Transparent live preview and optional transparent PNG.
- Six animation effects, playback controls, PNG/TXT/GIF/WebM exports, configurable filename, PNG scale, video maximum size and frame rate.
- IndexedDB project save, autosave, rename through project name, reopen, duplicate and confirmed delete. Source image, settings, mask and export preferences are stored locally. Browser data deletion can remove projects.
- Installable PWA manifest and icons, service-worker offline shell and cached model/runtime; update prompt requests saving before refresh. Install option appears when supported, with browser-menu guidance otherwise.

## Verification
- `npm run build`: pass (TypeScript and production build).
- `npm test`: pass, 16 unit tests.
- `npm run test:browser`: pass, 5 Edge tests covering export files, real-photo segmentation, mask editing/restoration, project operations and mobile overflow.
- `npm run test:offline`: pass, Edge production shell and cached model loaded without network after initial caching.
- `npm audit --omit=dev`: 0 vulnerabilities. Full audit reported 6 development-tool advisories after installing PWA tooling (2 low, 4 moderate); investigate upstream fixes.

## Remaining work
- Test install, update, offline inference and exports across mobile and non-Edge browsers; offline test checks cached model fetch, not full inference or installed-app lifecycle.
- Background detection is probabilistic; mask brushes currently support pointer/touch input and need a keyboard-accessible alternative. Source comparison is a small original preview, not a synchronized side-by-side editor.
- Advanced controls are not yet collapsed into a separate beginner mode; separate final-output preview and additional output dimensions may improve export UX. GIF caps its longest edge at 640 px; WebM records in real time.
- Add project backup/import and richer quota/recovery handling. Explicit created-at metadata and schema migrations are not yet implemented.
- Assess dev-dependency audit advisories, mobile accessibility, crop/mask alignment across aspect ratios, and expanded performance testing before public release.

## Next tasks
1. Resolve development dependency advisories and broaden device/accessibility testing.
2. Add keyboard-friendly mask correction, stronger before/after comparison, and clearer beginner/advanced modes.
3. Add local project backup/import and test offline model inference and installation on mobile.

## Independent image converters — 2026-11-11

- Added a New Features directory and independent routed workspaces for One Bit Dither, Pink Phosphor, CRT, Flash Light, Receipt Ticket, Datamosh, and Blob Tracking. Each accepts a local image, has working presets and adjustable controls, live/original views, reset, PNG export, and locally saved projects. The ASCII editor and its existing projects remain available.
- Pink Phosphor, CRT, Flash Light, Datamosh, and Blob Tracking support timeline playback and WebM recording; One Bit and Receipt are static. One Bit supports threshold, Floyd–Steinberg, Bayer, and Atkinson and exports exactly two selected colors. Datamosh is simulated; blob graphics show bright-region detection on a still image, not real motion tracking.
- Converter projects use the existing IndexedDB store with a converter-type discriminator; legacy ASCII projects without that discriminator continue to be listed in the ASCII editor. Converter projects are listed in their corresponding workspace.
- Verification: `npm run lint` (basic correctness rules), `npm run typecheck`, `npm test` (23 tests), `npm run build`, `npm run test:browser` (19 Edge tests), and `npm run test:offline` passed. Browser tests verify each tool's PNG, presets and project reopening, two-color output, five changing WebM files, legacy project separation, mobile overflow, and existing ASCII workflows. Offline check loads all seven tools with an image after caching. Production dependency audit reports zero vulnerabilities; npm reported 10 development dependency advisories (2 low, 8 moderate).

### Remaining work for the full converter brief

- These are functional first versions, not the complete specification. Expand converter-specific settings: datamosh direction/frequency/channel separation; blob dark/color detection, labels/connections and maximum regions; flashlight motion paths/flicker and numeric positioning; receipt dimensions, placement, texture and edge options; CRT channel separation/noise/flicker; and phosphor hue/saturation/persistence controls.
- The shared workspace offers explicit save/reopen/delete but not converter autosave, rename/duplicate, or a unified project browser. Converter exports cap the longest edge at 960 px (receipt is 480 px wide); no GIF/MP4 export is offered by the new tools. WebM records in real time and is browser-dependent.
- Expand feature-specific quality/performance tests, mobile/touch interaction and cancellation checks; add accessible keyboard alternatives for interactive light positioning. Add more export configuration, fully customizable receipt layout, and richer before/after comparison. Test app install/update and actual offline exports across devices.
