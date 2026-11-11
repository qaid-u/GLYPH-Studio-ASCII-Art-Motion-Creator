# Security and performance

GLYPH Studio runs in the browser. Images are processed on the user's device, but the application files and model must be downloaded to the browser. Minification and omitting source maps do **not** prevent reverse engineering, copying, or scraping. Keep the source repository private and do not place secrets in client-side code. Protecting a confidential algorithm would require a different architecture, such as authenticated server-side processing.

## Deployment protections

The Vercel deployment uses the security headers in `vercel.json`: a same-origin Content Security Policy, clickjacking protection, MIME-sniffing protection, a no-referrer policy, and restrictions on unused device permissions. The policy allows the app's local WebAssembly worker and blob/data image previews. If integrations or external resources are added, review the policy and its browser tests rather than weakening it broadly.

Vercel's managed AI-bot rule is configured to deny traffic it identifies as an AI bot. Bot Protection is in **log** mode; it does not block general bots or stop determined scrapers. These settings can be reviewed in the project's Vercel Firewall dashboard. Review false positives and traffic trends before enabling challenges or adding rate limits. No analytics script was added.

## Caching and offline use

Vite's content-hashed assets receive long-lived immutable cache headers. The fixed-name model has a shorter HTTP cache lifetime, and `sw.js` revalidates so updates can be found. The service worker precaches the application shell but caches the model and WebAssembly runtime only after subject removal is first used online. Subsequent offline use is covered by `npm run test:offline` after `npm run build`.

If `public/models/u2netp.onnx` is replaced, increment the `glyph-subject-model-v1` cache name in `vite.config.ts` so existing installations do not retain the previous model. The first installation and subsequent upgrades depend on the browser finishing service-worker caching; mobile and non-Edge behavior still needs broader testing.

## Monitoring

Use the Vercel project dashboard's Firewall and usage views to review allowed, logged, and denied requests and bandwidth. Current rule settings can be inspected with `vercel firewall status` from a linked project. Avoid blanket rate limits that could disrupt real users or model downloads; tune rules only after reviewing actual traffic and plan limits.

## Firewall alert notifications

Vercel displays detected firewall attack alerts in the project Firewall dashboard. Its documented DDoS attack alert threshold is more than 100,000 malicious requests in ten minutes; this is not a detector for every suspicious request. Check the linked deployment with `vercel firewall alerts list --since 24h --json`. Logged or blocked requests alone do not prove an attack.

A Codex hourly check has been created for this project and reports newly detected Vercel firewall alerts in the associated chat. It requires the local Codex environment and Vercel access; it is not a continuously available security service and does not send email. The existing Vercel firewall configuration has not been changed.

Gmail email delivery is not configured. A Gmail connection and a verified delivery workflow are required before claiming email notifications are active. Vercel documents its firewall attack event delivery through webhooks or Slack; its anomaly alert email feature requires a qualifying paid plan. See [Firewall Observability](https://vercel.com/docs/vercel-firewall/firewall-observability) and [Alerts](https://vercel.com/docs/alerts).
