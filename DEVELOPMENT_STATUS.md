# GLYPH Studio — Development Status

## Control visibility — 2026-11-11

- Removed collapsible wrappers around the two image-transform controls, the two ASCII framing controls, and the single custom-character input. Larger editing groups remain collapsible.
- Verification: lint, build, 28 unit tests, 22 targeted browser tests, and 5 offline/security tests passed. Visibility was checked at mobile and desktop viewport sizes.

## Converter editing controls — 2026-11-11

- Added image rotation and horizontal flip to all seven converters, including masked images, PNG, and animated WebM. Show original still displays the untouched image.
- Expanded effect controls: seeded stochastic dithering; phosphor scanlines and ghost offset; CRT scanline and roll controls; flashlight beam width and color strength; receipt margins, print pattern, and alignment; datamosh block opacity; and blob box thickness, center, and scanline toggles. Detailed controls remain collapsible.
- Verification: lint, build, 28 unit tests, 54 browser tests, and 5 offline/security tests passed. After a final horizontal-flip ordering fix, all 9 targeted customization tests and lint/unit/build checks passed again. Physical-device and broader browser coverage remain outstanding.

## Website and PWA icon — 2026-11-11

- Replaced the app icons with an original GLYPH star design matching the cyber theme, and added SVG/PNG favicons, an Apple touch icon, and separate standard and maskable PWA icons.
- Verification: lint, build, 27 unit tests, and 5 offline/security browser tests passed, including offline icon availability and pixel dimensions. Icon updates on already-installed apps depend on browser and operating-system caching.

## Repository documentation — 2026-11-11

- Refreshed the README with the current Vercel link, screenshot, converter and export details, setup, privacy, security, and known limitations. The README now documents background removal across all converters and its export limitations.
- Published the README and screenshot; follow-up documentation accompanies the verified background-removal changes.

## Converter background removal — 2026-11-11

- Added subject detection, simple edge-color removal, threshold controls, and subject-mask refinement to all seven additional converters. The same mask is used for preview and PNG. Receipt output retains its paper; WebM uses a dark backdrop. Transparent pixels are ignored by blob detection.
- Verification: lint, TypeScript/production build, 27 unit tests, 45 browser tests, and 4 offline/security tests passed. The browser suite covers all seven preview/PNG paths, subject inference and mask refinement in Pink Phosphor, and a WebM export; offline subject inference was checked in One Bit Dither after caching. The offline preview-server timeout was increased for slower machines after an initial startup timeout.
- Limitations: subject detection is probabilistic; broader mobile and browser coverage remains needed. The model must be downloaded on first use.

## Telegram alert workflow — 2026-11-11

- Added an optional hourly GitHub Actions firewall monitor, a manually triggered connection test, private Windows credential setup, and automated tests. The schedule is disabled by default until repository variable `GLYPH_ALERT_MONITOR_ENABLED` is set to `true`.
- Verification: PowerShell syntax, 4 monitor tests, 26 unit tests, lint, and production build passed. Telegram and Vercel credentials have not been configured, so delivery and live scheduled monitoring are not yet verified. Next: create/start the bot, run the private setup script, run the manual notification test, then enable the schedule only after success. The existing Codex hourly check is separate.
- Vercel firewall alerts cover detected events, not every suspicious request; scheduled runs can be delayed, and alerts in the two-hour lookback can repeat.

## Firewall alert monitoring — 2026-11-11

- Created an hourly Codex chat check for newly detected Vercel firewall alerts; this depends on the local environment and Vercel access and does not send email. Vercel reported no active or resolved firewall alerts in the latest 24-hour check.
- Gmail was requested but is not connected. Email alerts remain incomplete until the Gmail connection and an appropriate delivery workflow are configured and tested. Vercel firewall alerts do not identify every suspicious request.
- Updated the security operations guide with the alert scope, verification command, and provider limitations.

## Mobile editor — 2026-11-11

- Added a mobile shortcut bar for preview, image settings, adjustments, and PNG export in both editors; improved touch targets, input sizing, safe-area spacing, and zoomed canvas scrolling.
- Verification: lint, build, 26 unit tests, 36 browser tests, and 4 offline/security tests passed. Mobile navigation and PNG export were tested at 320 px, and the converter was visually inspected at 375 px. Physical-device testing remains outstanding.
- Vercel firewall check: identified AI bots are denied; general Bot Protection is in log mode. Browser-delivered code and public assets cannot be made impossible to inspect or copy.

## Cyber Anime style kit — 2026-11-11

- Applied the violet cockpit theme, hexagonal grid, chamfered panels, teal/blue highlights, layered glows, and reduced-motion-aware interactions to the homepage and editors. Updated PWA theme colors without changing artwork or export settings.
- Verification: lint, production build, 26 unit tests, 35 browser tests, 4 offline/security tests, and desktop/mobile visual checks passed. The final background-grid layering adjustment also passed the 6 homepage browser tests.

## Homepage image upload — 2026-11-11

- Added drag-and-drop and file selection for feature previews, local image validation, reset, and transfer of the selected image into the chosen editor. Images remain in browser memory.
- Verification: lint, production build, 26 unit tests, 34 browser tests, and 4 offline/security tests passed. Fixed a CSP test teardown race observed on the first offline run.

## Feature card previews — 2026-11-11

- All eight homepage feature cards now render the supplied portrait through their respective effects, sharing one cropped image for efficient loading. A generated fallback remains available if the image cannot load.
- Verification: lint, production build, 26 unit tests, 3 homepage browser tests (including source-image changes), and 3 offline/security tests passed.

## Supplied homepage image — 2026-11-11

- Replaced the earlier generated hero artwork with the user-supplied portrait, optimized for the PWA cache. Added a draggable Original/ASCII comparison alongside the existing live conversion and motion effects.
- Verification: lint, production build, 26 unit tests, 2 homepage interaction/mobile tests, and 3 offline/security tests passed.

## Interactive homepage artwork — 2026-11-11

- Added a newly generated cyber-city illustration and an interactive Original/ASCII preview using the existing conversion engine, plus pointer-responsive lighting and a reduced-motion-aware scan effect. The optimized image is included in the PWA cache. The supplied reference image is not included in the application.
- Verification: lint, production build, 26 unit tests, 2 homepage interaction/mobile tests, and 3 offline/security tests passed. Copyright clearance cannot be guaranteed.

## Cyber Japanese UI — 2026-11-11

- Redesigned the homepage and editor surfaces with a monochrome cyber interface, Japanese typographic details, original geometric artwork, responsive converter cards, and preserved creator attribution. Existing image and export functionality remains in place.
- Verification: lint, production build, 26 unit tests, and desktop/mobile navigation and overflow checks passed. Of 29 existing browser tests, 28 passed on the first run; the pink-phosphor WebM decode failed once and passed on a targeted retry. Investigate if intermittent decode failures recur.

## Attribution — 2026-11-11

- Added creator attribution and a 2026 copyright notice for Muhammad Qaid Uqail (@qaid-u) to the website footer, README, and proprietary rights draft. Third-party licenses remain applicable; the rights draft remains subject to owner review.

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
