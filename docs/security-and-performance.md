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

## Telegram firewall notifications (optional)

The repository includes `.github/workflows/firewall-monitor.yml`. Its hourly scheduled job is disabled unless repository variable `GLYPH_ALERT_MONITOR_ENABLED` is exactly `true`; a manual run is available for testing. It queries Vercel's firewall alerts over a two-hour window, and sends a Telegram message only if alerts are returned or a manual test is requested. Ongoing or recently resolved alerts may be repeated. This reports Vercel-detected alerts, not every bot or attempted scrape; schedules may be delayed or dropped. The private repository's included GitHub Actions quota applies.

Setup (never paste tokens into chats or commit them):

1. Create a bot with Telegram's [BotFather](https://t.me/BotFather), open the new bot, and press **Start**.
2. Create a Vercel access token at [Vercel account tokens](https://vercel.com/account/tokens) that can access the `qaid-uqail` team and this project. Choose a suitable expiry; an expired token stops monitoring.
3. On Windows, from this repository, run `powershell -ExecutionPolicy Bypass -File .\scripts\setup-telegram-alerts.ps1`. Enter both tokens at the hidden prompts and explicitly select your own private conversation. The script stores them as GitHub Actions secrets `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, and `VERCEL_ALERT_TOKEN`. The bot must have no webhook configured for automatic chat discovery. The setup requires GitHub CLI authentication and repository admin access.
4. In GitHub Actions, run **Firewall alert monitor** manually with **Send a test notification** enabled. Verify both the successful run and receipt of the message. If it fails, monitoring is not active; check credentials, token permissions, and workflow logs.
5. Only after the test succeeds, enable the scheduled job by setting repository variable `GLYPH_ALERT_MONITOR_ENABLED` to `true` in GitHub Settings → Secrets and variables → Actions → Variables. To pause, set it to `false` or remove it. Configure GitHub Actions failure notifications so expired tokens or query failures are noticed; failure notifications depend on your GitHub settings.

If the monitoring workflow fails, it does not claim the site is safe. This integration runs outside the PWA and does not upload user artwork. Telegram delivery and live firewall access cannot be verified until credentials are configured and the manual test succeeds.
