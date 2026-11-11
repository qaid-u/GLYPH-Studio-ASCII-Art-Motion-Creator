# GLYPH Studio

**Turn images into animated ASCII art, entirely in your browser.**

GLYPH Studio is a local-first creative editor for converting an image into character art, refining its appearance, adding motion, and exporting the result. It is a working prototype under active development.

![GLYPH Studio homepage showing its image converter tools](docs/studio-preview.png)

## What you can do

- **Create:** Upload a PNG, JPEG, or WebP image, paste one from the clipboard, or try the built-in demo. Adjust framing, character density, color, contrast, and other image settings.
- **Isolate and refine:** Remove a background with an on-device subject-detection model or a simple edge-color method. Use the keep and erase brushes to refine a detected subject.
- **Animate:** Preview wave, glitch, matrix rain, dissolve, pulse, and ripple effects with playback, loop, and timeline controls.
- **Export:** Download PNG, TXT, animated GIF, or WebM. PNG supports transparency; GIF is limited to 640 px on its longest edge, and WebM availability depends on browser support.
- **Work offline:** Install the app where supported. After the application shell is cached, it can load without a network connection. Use subject removal once online to cache its model and runtime for later offline use.

Images are processed on the device and are not uploaded by the app. Project-saving controls have been removed; existing browser project data is not deleted.

## Quick start

**Requirements:** Node.js 24 and npm. Browser tests use an installed Microsoft Edge by default.

```bash
git clone https://github.com/qaid-u/GLYPH-Studio-ASCII-Art-Motion-Creator.git
cd GLYPH-Studio-ASCII-Art-Motion-Creator
npm ci
npm run dev
```

Open the local URL printed by Vite. Choose a converter card, then use **Try demo** in ASCII or upload an image in any converter. The [private deployed app](https://glyph-studio-ascii.docilelinen.chatgpt.site) is available to its authorized owner.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run typecheck` | Check TypeScript types |
| `npm test` | Run engine unit tests |
| `npm run build` | Type-check and create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run test:browser` | Run the editor and export tests in Edge |
| `npm run test:offline` | Test the built app's offline shell and cached model; run `npm run build` first |

Set `GLYPH_BROWSER_CHANNEL` to another installed Playwright browser channel when appropriate. The browser tests start local servers and require permission to launch the browser and connect to those servers.

## How it works

```text
Image → sample pixels → map luminance to characters → animate a frame → preview / export
  └── optional local subject mask ────────────────────────┘
```

The editor uses React, TypeScript, Vite, and Canvas 2D. Subject detection runs in a Web Worker with ONNX Runtime Web and bundled U²-Net weights. A service worker caches the app shell and model for offline use.

## Status and limitations

GLYPH Studio is **not yet a production-ready release**. Background removal is probabilistic, and mask brushes currently require pointer or touch input. GIF and WebM exports have browser and performance constraints. Installation, offline inference, accessibility, and export behavior need broader testing across devices and browsers. The offline test verifies the cached shell and model fetch, not the complete installed-app lifecycle.

See [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for verified checks and current priorities, and [development.md](development.md) for the longer product blueprint.

## Project information

- [Development guide](CONTRIBUTING.md) — setup, tests, and expectations for authorized collaborators
- [Security policy](SECURITY.md) — reporting a suspected security issue
- [Third-party notices](THIRD_PARTY_NOTICES.md) — dependency and model attribution
- [License draft](license.md) — proprietary rights notice awaiting owner review

GLYPH Studio is a working name; no trademark registration or clearance is claimed.

## Independent image converters

The **New Features** section also provides first versions of seven direct image converters: One Bit Dither, Pink Phosphor, CRT, Flash Light, Receipt Ticket, Datamosh, and Blob Tracking. Each has a separate workspace, presets, collapsible detailed controls, and PNG export. Animated tools can export WebM where supported. Datamosh is simulated, and Blob Tracking visualizes regions in a still image rather than tracking real motion. See [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for the remaining advanced controls and export limitations.

Converter controls include configurable dithering patterns, datamosh direction and frequency, bright/dark/color blob detection, flashlight motion paths, receipt texture, CRT interference, and phosphor glow. The controls are in each tool’s detailed settings.

For deployment security, traffic settings, caching, and operational limitations, see [Security and performance](docs/security-and-performance.md).
