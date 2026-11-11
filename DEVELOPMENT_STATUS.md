# GLYPH Studio — Development Status

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
