# GLYPH Studio — Development Blueprint

> **Project status:** Planned / implementation not yet verified  
> **Document type:** Living product and engineering specification  
> **Version:** 1.0  
> **Last updated:** 2026-11-10  
> **Product name:** GLYPH Studio (working name; subject to trademark clearance)  
> **Target:** Installable, offline-capable, local-first Progressive Web App (PWA)  
> **Repository policy:** Private, proprietary / all rights reserved, pending confirmed legal ownership

---

## 1. Project vision

GLYPH Studio is a beginner-friendly ASCII art and animation studio. Users upload an image, convert it into character-based artwork, personalize the rendering, apply animated effects, preview the result, and download a static image or playable animation. The experience should feel like a polished creative tool with a restrained terminal/ASCII identity—not a command-line interface.

**Primary promise:** *Upload → Style → Animate → Export.* No coding, user account, paid AI service, or server upload is required for the first release.

### Product goals

1. Convert common image types into recognizable, high-quality ASCII art.
2. Animate the ASCII image using original, deterministic procedural effects.
3. Offer immediate visual feedback, clear controls, and easy exports.
4. Run as an installable PWA with useful offline functionality after initial caching.
5. Keep user image data locally on their device by default.
6. Preserve maintainable, original source code and a defensible project ownership record.

### Intended users

- Digital artists and motion designers
- Content creators and social media editors
- Students, educators, and programming enthusiasts
- People creating ASCII-themed visual assets and short animations

### Non-goals for V1

- Generative AI video or photorealistic subject motion
- Cloud storage, authentication, teams, subscription billing, and collaborative editing
- Native iOS/Android store releases
- Server-side processing or paid AI APIs
- Audio/video editing, 3D animation, or extensive multi-layer compositing
- Claims of exclusive rights to the general image-to-ASCII idea

---

## 2. Success criteria and definition of done

A new user can:

1. Open the app and understand the purpose within seconds.
2. Drag/drop, paste, or select a supported image.
3. See recognizable ASCII output without needing to tune settings.
4. Choose color, character, density, and brightness/contrast options.
5. Select at least one working animation preset and adjust its behavior.
6. Play, pause, restart, scrub, and loop the animation.
7. Download a valid PNG, TXT, GIF, or WebM from the same source/render configuration.
8. Save, reopen, and delete local projects.
9. Install and run the core editor offline where the platform supports it.
10. Recover gracefully from unsupported formats, encoding constraints, or storage errors.

**Quality bar:** No fake buttons, stub exports, broken mobile layout, misleading status labels, or silent data loss. A feature is only marked complete when implemented and checked.

---

## 3. Scope and priorities

| Priority | Deliverable | Acceptance test |
|---|---|---|
| **P0** | Project scaffold, design system, responsive editor | Starts, builds, and works on desktop/mobile |
| **P0** | Upload, validation, image decoding and downsampling | PNG/JPEG/WebP load; invalid files fail safely |
| **P0** | Original image-to-ASCII engine | Recognizable result, correct proportions, responsive settings |
| **P0** | PNG and TXT export | Files download and contain the expected art |
| **P1** | Six procedural animation presets and playback | All presets visibly animate; replay/scrub are deterministic |
| **P1** | GIF and WebM export | Downloaded animations contain multiple valid frames |
| **P2** | IndexedDB project persistence | Project with settings and source image reopens correctly |
| **P2** | Installable/offline PWA | Core local workflows function after caching and reconnect |
| **P2** | Accessibility, error handling, tests | Targeted tests and build checks pass |
| **P3** | MP4 and SVG optional export | Only enabled when honestly supported and validated |
| **P3** | Performance improvements and advanced polish | Measured improvement with no regressions |

### Explicit release boundary

**MVP release:** P0 + P1.  
**Public beta readiness:** P0 + P1 + P2.  
**Future/conditional:** P3. Do not delay core delivery for MP4, account systems, or AI.

---

## 4. User journeys

### Flow A: Static ASCII art

1. Open Home → **New Project** or **Try Demo**.
2. Upload an image or load demo artwork.
3. The editor immediately renders ASCII with a sensible preset.
4. Choose **Classic**, **Detailed**, **Minimal**, **Binary**, **Symbols**, or **Blocks**.
5. Optionally adjust density, contrast, gamma, color, and inversion.
6. Export PNG or plain-text TXT.

### Flow B: Animated ASCII video

1. Open a project in the editor.
2. Choose an animation preset from the right panel or mobile Effects tab.
3. Adjust speed/intensity/direction/duration as available.
4. Preview playback and scrub to inspect results.
5. Choose GIF or WebM; set dimensions, FPS, and duration within safe limits.
6. Watch export progress; download a playable file.

### Flow C: Local projects

1. Save or auto-save an editor session.
2. Return to Projects → rename, duplicate, reopen, or delete.
3. Reopened projects restore source image and settings.
4. Storage limitations and browser-data deletion risks are communicated clearly.

---

## 5. UX and visual design

### Visual identity

**Theme:** Retro terminal aesthetic with modern creative-software usability.  
**Tone:** Clear, welcoming, technical without being intimidating.

| Token | Value | Purpose |
|---|---|---|
| `--bg` | `#09110F` | Main page background |
| `--surface` | `#14231E` | Panels, cards, controls |
| `--primary` | `#80F5B5` | Primary actions, selection |
| `--accent` | `#F5C978` | Highlights/warnings |
| `--text` | `#E8F6EE` | Main text |
| `--muted` | `#A6BAAD` | Supporting labels |

- Use a monospace face for actual ASCII glyphs, code-like headings, and decorative accents.
- Use a readable interface font for explanatory text and long labels.
- Prefer generous spacing, clear controls, visible active states, and subtle glow.
- Avoid blinking text, exaggerated CRT distortion, cluttered panels, and tiny touch targets.
- Maintain accessible contrast, keyboard support, and a reduced-motion option.

### Navigation

- **Home:** Product introduction, upload CTA, demo, recent projects, install guidance.
- **Studio:** Core editor, preview and export.
- **Projects:** Saved local projects.
- **Settings/About:** Defaults, motion preference, privacy, version and license notices.

### Studio layout

**Desktop:** Top bar (name, save, export), left panel (image/style), central preview, right panel (effects), bottom timeline/playback.  
**Mobile:** Full-width preview, large primary actions, bottom tabs/sheets for Style / Motion / Export; no horizontal scrolling.  
**Beginner mode:** Upload → select style → select motion → export.  
**Advanced mode:** Additional controls, hidden until requested.

### Required states

Empty / first-run, uploading, decoding, rendering, preview playing/paused, exporting with progress, complete, invalid file, unsupported feature, storage full, and offline.

---

## 6. Technical architecture

### Stack

- **Frontend:** React + TypeScript (`strict`) + Vite
- **Styles/UI:** Tailwind CSS + Lucide React icons
- **Rendering:** Canvas 2D initially, WebGL only if profiling justifies it
- **Heavy work:** Web Workers where practical, with main-thread fallback
- **Persistence:** IndexedDB for projects and image blobs; localStorage only for small preferences
- **PWA:** `vite-plugin-pwa`, web manifest, service worker, application icons
- **Export:** Canvas PNG; TXT grid; browser-compatible GIF encoder; WebM capture/MediaRecorder; MP4 only if truly supported
- **Validation:** Vitest, React Testing Library, typecheck/lint, browser/device smoke tests

### Core data flow

```text
Local image upload
  → validate format/size
  → decode image and optionally downsample
  → sample pixels on an aspect-corrected grid
  → calculate luminance/color and map to glyphs
  → base ASCII frame/grid
  → deterministic animation effect(time, seed, settings)
  → shared Canvas renderer
  ├─→ interactive preview
  ├─→ PNG / TXT
  └─→ frame sequence / GIF / WebM / supported MP4

Project source + settings ↔ IndexedDB (local only)
```

### Architectural principles

1. Pure conversion and animation functions must be testable independently of React.
2. Preview and export share glyph layout, color, and effect logic.
3. Avoid relying on mutable previous frames for effects; compute from source and time.
4. Use stable random seeds for identical results at identical timestamps.
5. Isolate encoder dependencies to avoid bloating initial page load.
6. Enforce upper bounds for image sizes, ASCII cell counts, FPS, duration, and export memory.
7. Decode/process images locally; no server-side uploads by default.
8. Use original implementations; do **not** copy the supplied NIGHT TIDE source without an appropriate license.

### Suggested project layout

```text
glyph-studio/
├── public/
│   ├── icons/
│   └── demo/                 # own/licensed demo assets only
├── src/
│   ├── app/                  # app setup and routing
│   ├── components/
│   │   ├── layout/
│   │   ├── editor/
│   │   ├── controls/
│   │   ├── preview/
│   │   └── export/
│   ├── engine/
│   │   ├── imageProcessor.ts
│   │   ├── characterMapper.ts
│   │   ├── asciiRenderer.ts
│   │   ├── animationEngine.ts
│   │   └── effects/
│   ├── features/
│   │   ├── upload/
│   │   ├── ascii/
│   │   ├── animation/
│   │   ├── projects/
│   │   └── export/
│   ├── hooks/
│   ├── lib/storage/
│   ├── styles/
│   ├── types/
│   └── tests/
├── development.md
├── DEVELOPMENT_STATUS.md     # implementation checkpoint maintained by Codex
├── README.md
├── THIRD_PARTY_NOTICES.md
└── LICENSE.md                # owner-reviewed proprietary notice
```

Actual structure can be simplified if that reduces duplication.

---

## 7. Image-to-ASCII processing engine

### Input

- PNG, JPEG, WebP
- Drag/drop, file picker and clipboard paste
- Suggested file size limit: 20 MB, plus pixel/dimension guardrails
- Downsample overly large sources before repeated sampling
- Handle alpha consistently (composite against chosen background or defined transparency rule)
- Reject corrupt, unsupported, or undecodable files with helpful messages

### Conversion pipeline

1. Decode original source to an `ImageBitmap` or safe equivalent.
2. Fit/crop source to canvas based on contain/cover and target output aspect ratio.
3. Select character columns/rows using glyph cell dimensions to preserve proportions.
4. Sample pixels (nearest/bilinear or averaged regions, choose based on quality/performance).
5. Calculate perceptual luminance, e.g. `Y = 0.2126R + 0.7152G + 0.0722B` for appropriate RGB domain.
6. Apply brightness, contrast, gamma, optional inversion, and optional dithering.
7. Map normalized brightness to an ordered character ramp (dark-to-light mapping must be consistent).
8. Retain source-sampled RGB when color mode is enabled.
9. Render a glyph grid with a cached text/glyph strategy where beneficial.
10. Support TXT export from the actual text grid, without OCR.

### Style presets

- Classic ASCII
- Detailed ASCII
- Minimal ASCII
- Binary (`0` and `1`)
- Symbols
- Blocks
- Custom ordered character ramp

### Style controls

Character columns/density; font size; line height and spacing; brightness; contrast; gamma; inversion; foreground/background colors; grayscale, monochrome, or source color; contain/cover fit; optional dithering.

### Performance guidance

Debounce expensive changes, cap grid size on slower devices, perform resizing once per source/settings change, cache immutable sampled data, prevent object URL leaks, and profile before choosing WebGL.

---

## 8. Deterministic motion engine

### Animation contract

```ts
interface AnimationContext {
  timeSeconds: number;
  durationSeconds: number;
  seed: number;
  speed: number;
  intensity: number;
  direction?: number;
}

interface AnimationEffect {
  id: string;
  label: string;
  render(/* source grid, context, effect settings */): AsciiFrame;
}
```

The type definitions above are illustrative; finalize shared types within the implementation. Effects should not mutate the source frame.

### Required presets

| Effect | Behavior | User controls |
|---|---|---|
| Wave | Sinusoidal displacement of glyph positions | Speed, amplitude, direction |
| Glitch | Short bursts of character substitutions/offsets | Rate, intensity, seed |
| Matrix Rain | Falling vertical streams with visible source silhouette | Density, speed, color |
| Dissolve | Seeded spatial reveal/disintegration | Progress, scatter, speed |
| Pulse | Smooth luminosity/density/glow oscillation | Frequency, strength |
| Ripple | Expanding radial displacement from selected origin | Center, wavelength, amplitude |

**Playback:** Play, pause, restart, loop, scrub, timestamps, duration 3/5/10/15 s, speed, and a reduced-motion toggle. Aim for smoothly repeating animations where supported; avoid promising perfect seamless loops for arbitrary randomized configurations without enforcing periodic seeds/phase.

**Determinism test:** `render(frame, t, seed, settings)` produces the same pixel/glyph result every invocation, irrespective of prior playback.

---

## 9. Export specifications

| Format | Priority | Implementation/constraints |
|---|---|---|
| PNG | P0 | `canvas.toBlob()` (not screenshots of UI chrome) |
| TXT | P0 | Actual line-separated ASCII glyph grid |
| GIF | P1 | Real multiframe animated GIF through compatible encoder; bounded resolution |
| WebM | P1 | `captureStream()` + feature-tested `MediaRecorder`; verify actual motion and playback |
| SVG | P3 | Optional vector text/glyph output; validate proper escaping and sizing |
| MP4 | P3 | Capability-tested native encoder or lazy-loaded feasible conversion; fallback to WebM |

### Export correctness

- Preview and exports use the same source frame, font/character geometry, color and effect logic.
- For frame-sequence export, render timestamps explicitly (`frameIndex / fps`) to avoid recording real-time dropped frames where practical.
- Display estimated constraints before expensive exports and show actual progress/errors/cancellation when supported.
- Detect MIME support; never rename a WebM file `.mp4`.
- Clean up blobs, frame buffers, tracks, object URLs, and workers.
- Verify files outside the app using playback/opening checks.
- Keep large encoder libraries lazy-loaded and excluded from essential offline pre-cache unless deliberately supported.

---

## 10. Local storage and project model

```ts
interface GlyphProject {
  id: string;
  name: string;
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  sourceImage: Blob;
  imageSettings: Record<string, unknown>;
  asciiSettings: Record<string, unknown>;
  animationPreset: string;
  animationSettings: Record<string, unknown>;
  exportSettings: Record<string, unknown>;
}
```

Use concrete typed settings objects rather than the illustrative records above in production. Implement create, save, auto-save, reopen, rename, duplicate, delete with confirmation, and schema migration strategy. Provide storage-quota and corrupted-project handling. Clearly note that removing browser data can delete locally saved projects. Future optional manual project export/import can be introduced before cloud sync.

---

## 11. PWA and offline requirements

- Valid manifest with app name, description, standalone display mode, theme and background colors, and correctly sized icons.
- Service worker caches the application shell and essential local assets.
- Core workflows work offline **after** the app has been loaded/cached successfully.
- Image input uses local file APIs; do not require a remote server.
- Detect install eligibility and provide platform-specific instructions; do not show a nonfunctional universal Install button.
- Handle updates without losing unsaved work.
- Do not cache user-uploaded image contents as public web assets.
- Use HTTPS for deployment (localhost is acceptable for development).
- Test desktop Chromium and at least one mobile browser; document Safari/Firefox limitations where relevant.

---

## 12. Security, privacy, licensing, and Malaysian IP precautions

1. Source code must be original or used with a confirmed compatible third-party license. The supplied **NIGHT TIDE** example is inspiration only: its header mentions personal-project permission and a separate license not yet reviewed. Do not import/copy it into a commercial project by default.
2. Keep repository **private** during early proprietary development; choose **no stock open-source license** at GitHub creation if intending proprietary rights.
3. If using a proprietary notice (`LICENSE.md`), ensure the named owner has actually been verified. Do not assume copyright title solely because a student started the idea.
4. Check UTHM intellectual-property policy and any course, supervisor, funding or collaboration agreements before representing sole ownership.
5. Maintain dated designs, commits, release hashes, architecture decisions, contributor agreements, and third-party license notices.
6. Do not claim that the working brand **GLYPH Studio** is trademark-clear or registered without checking MyIPO and other relevant sources.
7. Copyright generally concerns qualifying original expression rather than the generic ASCII image-conversion concept; trademark is separate from copyright.
8. Avoid secret tokens in frontend bundles, analytics without user information/choice, and unnecessary remote requests.
9. Never store user uploads on a server without deliberate consent and a revised privacy design.
10. Legal filing decisions, ownership disputes, and patent questions require authoritative guidance or professional advice; this file is an engineering plan, not legal advice.

### IP evidence checklist

- [ ] Confirm UTHM/other ownership and contributor position
- [ ] Record original authorship and project conception materials
- [ ] Keep private development Git history and release tags
- [ ] Document third-party dependencies and licenses
- [ ] Review proprietary notice and named owner
- [ ] Search brand name before public brand commitment
- [ ] Prepare a stable software version for optional MyIPO voluntary copyright notification
- [ ] Assess trademark application only after clearance and chosen product classes

---

## 13. Testing and validation

### Unit tests

- Luminance mapping (known RGB samples)
- Character ramp ordering and inversion
- Grid dimension/aspect ratio calculations
- Source alpha / transparency handling
- Brightness/contrast/gamma boundaries
- Deterministic seeded animation at identical timestamps
- Animation endpoints and repeat behavior
- Project schema read/write and migrations
- Invalid uploads and file-size/dimension guards

### Integration checks

- Upload → render → change settings → PNG/TXT download
- Effect selection → play/pause/scrub → GIF/WebM download
- Save → reload page → reopen project and source image
- Install → close/reopen → core functionality offline
- Mobile layouts: no overflow, interactive controls reachable
- Keyboard and screen-reader basics, reduced-motion behavior

### Browser/export checks

- Verify downloaded PNG opens and reflects the preview.
- Verify TXT contains expected characters and line breaks.
- Verify GIF is animated, not a single mislabeled frame.
- Verify WebM is a valid playable video when supported.
- MP4 only marked supported where actual playable MP4 exists.
- Confirm export failure messages are actionable rather than silent.

### Build gates

- [ ] Typecheck succeeds
- [ ] Lint succeeds
- [ ] Unit tests succeed
- [ ] Production build succeeds
- [ ] Mobile and desktop smoke tests completed
- [ ] Offline/install smoke tests completed
- [ ] License/dependency audit completed

---

## 14. Implementation plan and task tracker

> **Tracking rule:** All items below begin unchecked because this document does not verify repository implementation. Codex should update checkboxes only after checking actual files and behavior.

### Milestone 0 — Repository setup

- [ ] Inspect workspace and existing repository
- [ ] Initialize Vite/React/TypeScript project if needed
- [ ] Add Tailwind, Lucide, testing tools, and practical lint/typecheck scripts
- [ ] Establish color tokens and base components
- [ ] Establish private repository safeguards and `.gitignore`
- [ ] Add `DEVELOPMENT_STATUS.md` checkpoint file

### Milestone 1 — Conversion and image export (**P0**)

- [ ] Responsive app shell, Home, Studio and navigation
- [ ] Input by file picker, drag/drop, clipboard paste
- [ ] File validation and proper failure states
- [ ] Image decoding, fitting, downsampling and alpha handling
- [ ] Original character-mapping logic and glyph grid
- [ ] Multiple presets and adjustable controls
- [ ] Smooth live Canvas preview
- [ ] Functional PNG export
- [ ] Functional TXT export
- [ ] Unit tests and build checks for P0

### Milestone 2 — Animation and media export (**P1**)

- [ ] Shared animation contract and deterministic frame rendering
- [ ] Wave
- [ ] Glitch
- [ ] Matrix Rain
- [ ] Dissolve
- [ ] Pulse
- [ ] Ripple
- [ ] Play/pause/restart/scrub/duration/loop controls
- [ ] GIF multiframe export
- [ ] WebM playable export
- [ ] Export progress, fallback and error handling
- [ ] Verify deterministic frames and downloaded animations

### Milestone 3 — Projects and PWA (**P2**)

- [ ] IndexedDB schema and migrations
- [ ] Save, autosave, reopen, rename, duplicate, delete
- [ ] Manifest and application icons
- [ ] Service worker and offline core workflow
- [ ] Install flow and update handling
- [ ] Mobile and keyboard accessibility pass
- [ ] Storage quota, memory and resource cleanup pass
- [ ] Browser/device smoke tests and production build

### Milestone 4 — Optional refinements (**P3**)

- [ ] MP4 only where technically validated
- [ ] SVG export if appropriate
- [ ] Performance profiling / targeted optimizations
- [ ] Advanced presets, presets library, or manual project file export
- [ ] Visual polish and accessibility refinements

---

## 15. Instructions for Codex: low-token implementation mode

**Context:** The user indicated approximately **18% remaining Codex budget**. Optimize development for code delivery rather than discussion. This is not a claim about an API token quota; it is a user-supplied working constraint.

1. Read this file and `DEVELOPMENT_STATUS.md` at the start of a session.
2. Inspect only relevant project files; avoid repeated full-tree scans.
3. If the repo is empty, start directly with Milestone 0 and P0.
4. Build a **working vertical slice** before advancing to the next milestone.
5. Minimize dependencies, avoid speculative features, and prefer maintainable small modules.
6. Write concise progress responses; do not output huge code diffs when files are already written.
7. Run targeted checks after each milestone and fix failures before claiming completion.
8. Do not fabricate passing tests or implemented features.
9. If the remaining allowance is insufficient, finish the safest coherent milestone and update `DEVELOPMENT_STATUS.md` with exact next steps.
10. Do not overwrite user work, files, or configs without reviewing them.
11. When resuming, implement the next unchecked verified item, not the entire brief again.

### Minimal checkpoint template (`DEVELOPMENT_STATUS.md`)

```md
# GLYPH Studio — Development Status

Updated: YYYY-MM-DD
Current milestone: 0 / 1 / 2 / 3 / 4
Repository state: Not inspected / In progress / Working / Blocked

## Completed (verified)
- [ ] Item — evidence or command

## Current issue
- None known / specific error and impact

## Tests last run
- `npm run build`: Not run / Pass / Fail
- `npm run test`: Not run / Pass / Fail
- `npm run lint`: Not run / Pass / Fail
- `npm run typecheck`: Not run / Pass / Fail

## Next 3 tasks
1. ...
2. ...
3. ...

## Constraints / notes
- User has limited Codex budget; minimize repeated work.
```

### Suggested initial Codex instruction

```text
Read development.md in full and inspect the current repository. Build GLYPH Studio in
low-token mode: working code first, short explanations, no unnecessary dependencies.
Implement Milestone 0 and P0 now; test and build before moving onward. Do not copy
NIGHT TIDE source. Update DEVELOPMENT_STATUS.md with verified accomplishments,
failures, and the next three tasks. Continue to P1 only if budget allows.
```

---

## 16. Decisions pending validation

| Decision | Current direction | Trigger to reconsider |
|---|---|---|
| Product name | GLYPH Studio (working only) | Trademark/name clearance shows conflict |
| License | Private proprietary source | Owner chooses open-source contribution model |
| Video output | GIF + WebM first | MP4 compatibility/performance is demonstrated |
| Backend | None for initial release | Cloud/account features become necessary |
| AI | None for initial release | Clear user demand for AI-assisted subject animation |
| Rendering | Canvas 2D | Profiling proves WebGL materially improves performance |
| Browser support | Progressive enhancement | Export or install API unavailable on target device |

---

## 17. Product growth after release

Only after the main editor is stable and users validate interest:

- Additional effect presets and combination of effects
- Scene templates and creator-oriented export presets
- Optional advanced masking/segmentation and depth-aware motion
- Optional client-side AI-assisted tools (only if feasible and safe)
- Manual project backup/share formats
- Optional cloud project synchronization and accounts
- Branding, marketplace or subscription features based on real demand

**Guiding principle:** The core differentiator is a fast, beautiful, original and controllable ASCII motion engine—not a large feature count.

---

*This document is the project specification. `DEVELOPMENT_STATUS.md` is the short, frequently updated implementation checkpoint. Neither document should mark work as completed without inspection and verification.*
