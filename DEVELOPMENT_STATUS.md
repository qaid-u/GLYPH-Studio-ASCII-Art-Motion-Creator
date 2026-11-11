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
