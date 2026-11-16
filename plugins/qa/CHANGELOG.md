# Changelog

All notable changes to the `qa` plugin. Versions follow `plugins/qa/.claude-plugin/plugin.json`. ADR-0004 records the design.

## 0.1.0

The first release, with all three stages. Being validated on public practice apps (the OrangeHRM demo and Sauce Demo) before a real product.

**Stage 1: setup and readiness**
- **New plugin `qa`** in the `jalankan-tiket` marketplace, for a QA engineer who tests web apps built by other teams.
- **`/qa:siapkan-produk`.** Creates a private QA workspace on the first run, then adds or completes one product:
  - a read-only clone of the product's repository, with pushing disabled;
  - `product.json`, which holds the staging URL, the allowed hosts, roles, side effects, and the Trello and Drive IDs;
  - a Playwright login setup that saves one session per role, so no password passes through the model;
  - a "QA – Perlu Ditinjau" / "QA – Needs review" list on the team's Trello board;
  - a product folder and an evidence folder on Google Drive.
- **`/qa:audit-kesiapan`.** Runs 15 readiness checks and ends in READY, READY WITH NOTES or BLOCKED. It writes `readiness.md`, publishes it as a Google Doc, and lists questions for the product team.

**Stage 2: planning and running**
- **`/qa:rencanakan-uji`.** Writes requirements with stable IDs, questions for gaps, risk scores (impact × likelihood → P1 to P3), the critical flows, test cases designed with ISTQB techniques, exploratory charters and a traceability matrix. It opens a test cycle and publishes the test plan as a Google Doc.
- **`/qa:jalankan-uji`.** Checks the entry criteria, runs the smoke suite first, hands each area to the `penguji` agent one at a time, and has every bug candidate and every retest reproduced by the `pemeriksa` agent. Only 3-of-3 reproductions become bugs.
- **Agents `penguji` and `pemeriksa`.**
- **Probes:** short `.probe.ts` specs, run in their own Playwright project, for exploratory sessions and reproductions.

**Stage 3: reporting and regression**
- **`/qa:laporkan`.** Checks every screenshot for secrets before it uploads it to Drive, creates one Trello card per confirmed bug in the review list (or comments on an existing card), comments retest results, and publishes a test report with a NO-GO, GO WITH CONDITIONS or GO recommendation.
- **`/qa:regresi`.** Chooses regression tests from the diff since the last reported cycle, the critical flows and the bugs waiting for a retest, and opens a regression cycle.
- **`/qa:siklus`.** Runs the commands that are due in order, and stops only for decisions.

**Guardrails**
- Permission rules deny reading `.env.local` and `.auth/`, and deny every `gh` write to issues and PRs.
- `playwright.config.ts` stops when the base URL's host is not in `allowedHosts`.
- Tests run with one worker and no retries.

**Pinned tools:** `@playwright/test` 1.65.1 and `@axe-core/playwright` 4.14.0.
