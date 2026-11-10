# GLYPH Studio — Development Status

Updated: 2026-11-11  
Current milestone: 1 / 2 — P0 completion and animation/export validation  
Repository state: In progress; not release-ready

## Implemented
- Local PNG/JPEG/WebP input (picker, drop, paste), demo, validation and original Canvas ASCII rendering. Controls include character ramps, density, brightness, contrast, gamma, inversion and colors. Grid dimensions now preserve portrait proportions when row limits apply.
- Six deterministic motion effects, still mode, playback, loop, scrub, duration, speed, intensity and reduced-motion startup.
- PNG/TXT exports and lazy-loaded GIF / feature-detected real-time WebM exports, with progress and cancellation.
- Explicit accessible labels for sliders. Vitest updated to address dependency audit findings.

## Verification
- `npm run build`: Pass, including TypeScript.
- `npm test`: Pass, 12 unit tests.
- `npm run test:browser`: Pass, 2 Playwright tests with desktop Edge and a 390px mobile viewport. Tests exercise demo, upload, invalid input, mobile horizontal overflow, PNG signature, TXT content, multiple differing GIF frames, and decoding/seeking to differing WebM frames.
- `npm install` audit after Vitest update: 0 vulnerabilities.
- Browser tests use installed Microsoft Edge by default; set `GLYPH_BROWSER_CHANNEL` for another installed Playwright channel. They require local server/browser access.

## Remaining issues
- Mobile layout was checked for horizontal overflow only; drag/drop, paste, all effects, timeline controls, cancellation, PNG image decoding and browser compatibility need broader interaction/device testing.
- Image dimensions are checked after decoding. Fit/crop, source preview, separate Home/Studio navigation, and other requested P0 controls remain incomplete.
- GIF export may be slow; WebM runs in real time and background tabs can throttle recording. GIF/WebM supported browsers still need wider testing.
- No IndexedDB projects, PWA/install/offline, MP4, lint or accessibility audit yet.

## Next 3 tasks
1. Complete P0 input and image controls (source preview, dimensions, fit/crop and safer decode handling) and add targeted browser tests.
2. Test and harden playback, drag/paste, cancellation and exports across supported browsers and mobile; add lint/accessibility checks.
3. Implement IndexedDB project save/reopen/rename/duplicate/delete and PWA offline/install workflow.

## Notes
- Local-only image processing; no server upload or telemetry. Do not copy NIGHT TIDE. `license.md` is an owner-review draft; direct production dependencies are listed in `THIRD_PARTY_NOTICES.md`.
