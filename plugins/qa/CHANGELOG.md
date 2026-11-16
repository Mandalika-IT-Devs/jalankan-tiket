# Changelog

All notable changes to the `qa` plugin. Versions follow `plugins/qa/.claude-plugin/plugin.json`. ADR-0004 records the design.

## 0.1.1

Four fixes from the first run on a real product. None of them is specific to that product.

- **Server-rendered login pages.** `auth.setup.ts` waits for a new ready check, `{{PAGE_READY}}`, before it fills the form. A form used before it hydrates submits natively: the fields empty, and the password can land in the URL.
- **A password in a URL stops the login setup** as BLOCKED, with the URL redacted, and asks the QA engineer to change that test account's password. The new `tests/support/redact.ts` gives `redactUrl` and `urlHasSecret`. Probes print URLs only through `redactUrl`, and `/qa:laporkan` redacts URL queries in bug files, cards and reports.
- **Sessions that survive refresh-token rotation.** The new `tests/support/session.ts` fixture loads a role's saved session and writes it back after every test. Specs and probes import `test` from it and pick a role with `test.use({ role })`. Before, the second test that started from the same `.auth` file was logged out in apps that rotate their refresh token.
- **A `gh` account that cannot reach the product.** When the active `gh` account is another one, such as an agent account for `tiket` projects, the new `scripts/akun-git.sh` makes git use the QA engineer's own account per repository, and can clone with pushing disabled. The QA engineer runs it. `/qa:siapkan-produk` and `/qa:audit-kesiapan` give the command. Creating the workspace now asks for the QA engineer's own account.
- **Roles with their own login page,** such as a back office on another host, take an optional `loginURL` in `product.json`.

Workspaces made with 0.1.0 keep their files. To use the fixtures there, copy `tests/support/` from the templates and switch specs to `import { test, expect } from '../support/session'`.

## 0.1.0

The first version, with all three stages. Not validated end to end.

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
