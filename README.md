# GLYPH Studio

A local-first image-to-ASCII editor. Images are processed in your browser.

## Development

Requires Node.js. Run `npm install`, then `npm run dev` and open the local URL. Run `npm test` for unit tests and `npm run build` for a production build.

See [development.md](development.md) for the blueprint and [DEVELOPMENT_STATUS.md](DEVELOPMENT_STATUS.md) for verified progress and known limitations.

## Current capabilities

The editor supports a generated demo or local image upload, ASCII styling, six procedural effects, timeline controls, PNG/TXT, and GIF/WebM export. Media exports and browser compatibility still need end-to-end verification; see the status file. GIF encoding runs locally and WebM availability depends on the browser.

Run `npm run test:browser` to execute the local browser checks with installed Microsoft Edge. Set `GLYPH_BROWSER_CHANNEL` to another installed Playwright browser channel when appropriate.
