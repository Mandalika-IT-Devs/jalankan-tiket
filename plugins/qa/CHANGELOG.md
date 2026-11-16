# Changelog

All notable changes to the `qa` plugin. Versions follow `plugins/qa/.claude-plugin/plugin.json`. ADR-0004 records the design.

## 0.1.0

Stage 1 of 3. Not yet validated on a real product.

- **New plugin `qa`** in the `jalankan-tiket` marketplace, for a QA engineer who tests web apps built by other teams.
- **`/qa:siapkan-produk`.** Creates a private QA workspace on the first run, then adds one product:
  - a read-only clone of the product's repository, with pushing disabled;
  - `product.json`, which holds the staging URL, the allowed hosts, roles, side effects, and the Trello and Drive IDs;
  - a Playwright login setup that saves one session per role, so no password passes through the model;
  - a "QA – Perlu Ditinjau" / "QA – Needs review" list on the team's Trello board;
  - a product folder and an evidence folder on Google Drive.
- **`/qa:audit-kesiapan`.** Runs 15 readiness checks and ends in READY, READY WITH NOTES or BLOCKED. It writes `readiness.md`, publishes it as a Google Doc, and lists questions for the product team.
- **Workspace guardrails.**
  - Permission rules deny reading `.env.local` and `.auth/`, and deny every `gh` write to issues and PRs.
  - `playwright.config.ts` stops when the base URL's host is not in `allowedHosts`.
  - Tests run with one worker and no retries.
- **Pinned tools:** `@playwright/test` 1.65.1 and `@axe-core/playwright` 4.14.0.
