---
status: accepted
date: 2026-11-16
---

# A second plugin, `qa`, for testing other teams' web apps

The owner now also works as a QA engineer. The apps to test are web apps (ERP, HRIS, e-commerce, POS and others) built by other teams, in repositories that do not use the kit. For each app the QA engineer has:
- a running staging environment with test accounts;
- collaborator access to the private repository, including its PRD and other documents;
- the means to run the app locally from its code.

Bugs go to the team's Trello board. Test plans and reports go to Google Docs, where developers read and comment on them.

`tiket` does not fit this work. It builds and changes code in a repository it set up, and it depends on that setup: `.github/jalankan-tiket.json`, protected paths, labels and CI. A QA engineer tests someone else's product, must leave that product's repository untouched, and never fixes the code.

We reviewed four public QA skill collections before deciding: ECC `browser-qa`, petrkindlmann/qa-skills, naodeng/awesome-qa-skills and PramodDutta/qaskills. None of them has a readiness audit for testing another team's app, and none talks to Trello or Google Docs. The useful ideas are listed under "Borrowed ideas" below. We copy no text from them. One of them has a noncommercial licence, and two others ship some skills whose provenance is unclear.

## Decision

### A second plugin in the same marketplace

The marketplace `jalankan-tiket` gets a second plugin, `qa`, at `plugins/qa/`. Its commands are `/qa:<skill>`.
- It works in any repository, without setting that repository up.
- It has no dependency on mattpocock-skills.
- The kit's rules apply to it as to `tiket`: it is generic, agent-facing text is in English, and its templates and guide exist in Indonesian and English.

### The QA workspace

All QA work lives in one **QA workspace**: a private git repository owned by the QA engineer, with one folder per product.

```
qa-workspace/
  qa-workspace.json        language and kit version
  AGENTS.md, CLAUDE.md     rules for every agent in the workspace
  package.json             Playwright Test and axe, pinned
  .claude/settings.json    permission rules
  products/<slug>/
    product.json           repository, staging URL, roles, Trello and Drive IDs, side effects
    .env.local             test account credentials, never committed and never read by agents
    source/                read-only clone of the product's repository, never committed
    playwright.config.ts   refuses any host outside product.json's allowed hosts
    tests/                 auth setup, then smoke, E2E, API and accessibility suites
    readiness.md           the latest readiness audit
    requirements.md, questions.md, risks.md, cases/   requirements, questions, risks, test cases
    cycles/<cycle>/        one round of testing: results, bugs, exploratory logs
```

Each artefact has one home, chosen by who reads it:

| Artefact | Home | Why |
|---|---|---|
| Bug | A Trello card, one per bug | Developers work there, so a bug's status lives in one place |
| Test plan and test report per cycle | Google Docs | The QA engineer and developers read, comment and edit there |
| Evidence (screenshots, videos) | A Google Drive folder per product, linked from cards and reports | The Trello connector cannot attach files. Drive keeps access within the team |
| Test cases, automated suites, run history | The QA workspace | Agents work best on files. Regression suites must be re-runnable and versioned |

### The product's repository is read-only

- The clone in `source/` gets a disabled push URL (`git remote set-url --push origin DISABLED`).
- The workspace's permission rules deny every `gh` command that writes to an issue or a PR.
- The plugin reads code and documents to design tests (gray-box design). It executes tests only from the outside, against staging (black-box execution).
- It never fixes the product's code, and never opens issues, PRs or comments in the product's repository.

### Rules of engagement

- **Hosts.** Only the hosts in `allowedHosts` of `product.json`, which the QA engineer confirms as non-production. `playwright.config.ts` stops before any test when its base URL is not on that list.
- **GitHub accounts.** The workspace belongs to the QA engineer's own account. When the active `gh` account is another one, such as an agent account for `tiket` projects, a per-repository credential helper (`scripts/akun-git.sh`) makes git use the QA engineer's account. The QA engineer installs it, because it hands git a token from `gh`.
- **Credentials.** Test account credentials live in `products/<slug>/.env.local`. The QA engineer fills that file. Agents may not read it, because permission rules deny it. Logins happen in a Playwright setup project that saves one storage state per role in `.auth/`. Specs and probes reuse that state through a fixture that writes it back after every test, because many apps rotate their refresh token. A password never passes through the model. Reports, cards and screenshots never show a password, and URLs are printed only with their query redacted.
- **Data.** Tests may create data on staging with test accounts. Every record they create carries the prefix in `testDataPrefix`, such as `QA-AUTO`. They never delete or change data they did not create.
- **Side effects.** `product.json` records whether staging sends real email, SMS or WhatsApp messages, or takes real payments. While a channel is `unknown` or `real`, every test that would trigger it is BLOCKED.
- **Not in scope without written permission.** Load tests, security scanners, brute force, and anything aimed at production. Those need the app owner's written permission, recorded in `product.json`. v0.x has no command for them.
- **Pace.** Trello and Drive writes follow the same pace as `tiket`'s GitHub writes: at least 10 seconds between writes.

### Results are evidence, never claims

Every check ends in exactly one state:
- `PASS`, only with evidence (an assertion that ran, a screenshot, a response);
- `FAIL`;
- `BLOCKED`: a precondition is missing;
- `NOT RUN`;
- `INCONCLUSIVE`: it ran but proves nothing either way, such as no baseline or a flaky result.

A report counts each state separately. A check is never reported as passed because nothing went wrong.

### Bugs are confirmed before anyone sees them

- A separate subagent, `pemeriksa`, repeats each bug's written steps in a fresh browser context before its card is created. A bug it cannot reproduce goes into the report as INCONCLUSIVE, with how often it appeared. It gets no card.
- Cards go to a review list on the team's board (`QA – Perlu Ditinjau` or `QA – Needs review`). The QA engineer moves each card to the developers' list. That keeps automation and a human gate, at the cost of one drag per bug.
- Severity and priority are separate fields. The Trello connector cannot create labels, so the card title carries the severity, and existing board labels are attached when they match.

### Commands, built in three stages

| Stage | Commands | What it adds |
|---|---|---|
| 1 | `siapkan-produk`, `audit-kesiapan` | The workspace, one product, a readiness audit that ends in READY or BLOCKED |
| 2 | `rencanakan-uji`, `jalankan-uji`, agents `penguji` and `pemeriksa` | Requirements with IDs from the PRD, questions for ambiguities, risk-based priorities, test cases designed with ISTQB techniques, and execution with evidence |
| 3 | `laporkan`, `regresi`, `siklus` | Trello cards and the Google Docs report with a Go/No-Go recommendation, regression chosen from the diff between releases, and one command for the whole cycle |

The first release ships all three stages. We planned to validate them on public practice apps first, such as the OrangeHRM demo. The QA engineer chose to validate on their real work product instead, relying on the rules of engagement above: a read-only repository, listed hosts only, marked test data, blocked side effects, and bug cards that wait in a review list. The tag `qa--v<version>` follows one full cycle on that product.

The first full cycle ran in November 2026 with 0.1.1: 805 cases and 40 confirmed bugs, over three sessions. It changed three things, released as 0.1.2:
- **Test output.** The Playwright HTML report and the traces of the login setup kept the shared accounts' passwords on disk. The templates no longer produce them.
- **Run state.** A run of that size outlasts one conversation. The run's state now lives in the cycle folder, and the same command continues it.
- **When cards are made.** Waiting for the end of the cycle kept a High bug about passwords in URLs from the developers for two days. Confirmed bugs may now get their cards while the run goes on, and urgent ones are announced at once. The pemeriksa's 3-of-3 confirmation and the review list stay as they were.

User-invoked skills cannot invoke each other. `regresi` therefore only opens a cycle that `jalankan-uji` runs, and `siklus` reads the other skills' files and follows them in order.

### Tools

- **Playwright Test** with `@axe-core/playwright`, pinned in the workspace's `package.json`, for every repeatable suite.
- **Probes for exploratory sessions and reproductions.** A probe is a short Playwright spec, ending in `.probe.ts`, that uses a role's saved session, performs one to five actions, and prints the page's ARIA snapshot and a screenshot. The agent reads the output and writes the next probe. We chose probes over a browser MCP server for three reasons:
  - a probe reuses the saved session, so the model never types a password, whereas an MCP server loads one storage state when it starts;
  - its version is the workspace's pinned Playwright, whereas the official Playwright plugin runs `@playwright/mcp@latest`;
  - it runs under the workspace's existing permission rule for `npx playwright test`.

  The cost is speed: each probe starts a browser. A pinned MCP server can be reconsidered once sessions can be switched without a password.
- **The claude.ai connectors for Trello and Google Drive.** Their tool names carry an account-specific prefix, so skills name the tool's base name, such as `trelloWriteCard` or `create_file`. When a connector is missing, the audit reports it and the work that needs it is BLOCKED.

### Borrowed ideas

- Separate evidence states, and no silent pass.
- PRD → requirement IDs → an ambiguity list → test cases with a traceability matrix.
- ISTQB test design: equivalence partitioning, boundary values, decision tables and state transitions.
- An oracle outside the model: URLs, texts and stored data are checked by assertions.
- Business postconditions: create, read back, check from another role. A 200 status with wrong stored data is a FAIL.
- A role × feature matrix for authorization checks.
- Session-based exploratory testing: charter, time box, log, debrief.
- Severity apart from priority.
- A blast radius: staging only, marked test data, redacted secrets.

## Consequences

- The QA engineer needs Node.js on the machine, and the Trello and Google Drive connectors in claude.ai. Those connectors reach Claude Code only when it is signed in with a claude.ai account, not with an API key.
- The plugin can create lists and cards on a team's Trello board and files in the QA engineer's Drive, and nothing else outside the workspace.
- `qa` has its own version, its own changelog (`plugins/qa/CHANGELOG.md`) and its own tags (`qa--v<version>`).
- `tools/periksa-kit.sh` checks the `qa` templates in both languages, like the `tiket` templates.
