# The qa plugin: testing apps built by other teams

The `qa` plugin is for a QA engineer who tests web apps built by other teams, such as an ERP, an HRIS, an online shop or a POS. The app does not need to use this kit. Claude prepares the QA work, checks whether the product is ready for testing, writes a test plan, tests from the outside through a browser on staging, then reports the results. Bugs go to Trello, and test reports go to Google Docs.

The `tiket` plugin builds a product, while `qa` only tests and reports. `qa` never changes the product's repository or fixes its code.

> **Status: 0.1.0, not released yet.** All seven commands exist, and they are being validated on public practice apps before use on a real product. The design is in [ADR-0004](../adr/0004-qa-plugin.md).

## What you need

- **Access to the product:** read access to its GitHub repository, the staging URL, and a test account for each role, such as admin and cashier.
- **On your machine:** Node.js 20.12 or later, `git`, `jq`, and the GitHub CLI `gh`, logged in.
- **claude.ai connectors:** Trello and Google Drive. Connect them in the claude.ai Connectors settings, then open a new session. These connectors appear only when Claude Code is signed in with a claude.ai account. A session that runs on an API key does not get them.

## Install

```
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install qa@jalankan-tiket
```

## Commands

| Command | When | Result |
|---|---|---|
| `/qa:siapkan-produk` | Once per product | The QA workspace (the first time), a read-only clone of the product's repository, config, a login script, a Trello list, a Drive folder |
| `/qa:audit-kesiapan` | Before testing, and whenever in doubt | 15 checks ending in READY, READY WITH NOTES or BLOCKED, plus questions for the product team |
| `/qa:rencanakan-uji` | When testing of a version starts | Requirements with IDs, questions, risk scores, test cases, exploratory charters, and a test plan in Google Docs |
| `/qa:jalankan-uji` | Once the plan is ready | A result with evidence for every case, and bugs confirmed by a second run |
| `/qa:laporkan` | After testing | Bug cards on Trello, evidence on Drive, and a test report with a Go/No-Go recommendation |
| `/qa:regresi` | Whenever a new release reaches staging | A regression selection from the diff between versions, the critical flows, and the bugs waiting for a retest |
| `/qa:siklus` | Any time | Runs the commands that are due, in order, and calls you only for decisions |

Write the product's name after the command, such as `/qa:audit-kesiapan toko-buku`. `/qa:jalankan-uji` also takes a filter, such as `/qa:jalankan-uji toko-buku smoke` or `/qa:jalankan-uji toko-buku P1`.

## Workflow

1. **Open a Claude Code session in an empty folder,** such as `~/qa-workspace`. This folder becomes the *QA workspace*: a private repository of yours that holds the QA work for every product.
2. **`/qa:siapkan-produk contoh-org/toko-buku`.** Claude creates the workspace (the first time), clones the product's repository, reads its documents and code, then asks you one round of questions: staging, roles, side effects, the Trello board and the Drive folder.
3. **Fill in the test accounts yourself.** Claude never sees a password. Copy the example file, then fill it in with your editor:

   ```
   ! cp products/toko-buku/.env.local.example products/toko-buku/.env.local
   ```

4. **`/qa:audit-kesiapan toko-buku`.** It checks:
   - the guardrails and the tools;
   - that staging answers and is not production;
   - the version under test;
   - each role's login, and role coverage;
   - the requirement documents and whether they can be tested;
   - test data and side effects;
   - Trello and Drive.

   Forward its questions to the product team.
5. **`/qa:rencanakan-uji toko-buku`.** Claude opens a *test cycle* for the version on staging, and writes its test plan in Google Docs.
6. **`/qa:jalankan-uji toko-buku`.** The smoke test runs first. When it fails, testing stops. After that the `penguji` agent works each area, one at a time. The `pemeriksa` agent repeats every bug candidate on its own. Only a bug that appears in all three of its runs counts as a bug.
7. **`/qa:laporkan toko-buku`.** Bug cards land in the "QA – Needs review" list. Review them, then move them to the developers' list. Claude also gives you a short message to paste into the team's chat.
8. **When a new release arrives: `/qa:regresi toko-buku`, then `/qa:jalankan-uji` and `/qa:laporkan`.** Or simply `/qa:siklus toko-buku`.

## Where results go

| What | Where |
|---|---|
| Bugs | Trello, one card per bug. New cards land in the "QA – Needs review" list, and you move each one to the developers |
| Test plans and reports | Google Docs, in the product's folder |
| Evidence (screenshots, videos) | The "Evidence" folder on Google Drive, linked from cards and reports |
| Requirements, test cases, automated tests, results per cycle | The QA workspace on GitHub, a private repository |

## Safety rules

- **The product's repository is read-only.** Claude never pushes, never opens issues, PRs or comments there, and never fixes its code.
- **Only the hosts you list.** Tests stop before they start when the target is not a host in `allowedHosts`. Production is never listed.
- **Passwords never pass through Claude.** A Playwright script that reads `.env.local` does the logins. The workspace's permission rules deny Claude reading that file. Screenshots are checked before they are uploaded.
- **Test data is marked** with `QA-AUTO`. Data that QA did not create is never changed or deleted.
- **Side effects.** Until it is clear whether staging sends real email, SMS or WhatsApp messages, or takes real payments, every test that triggers them is BLOCKED.
- **Staging is shared,** so tests run one at a time and without automatic retries.
- **Load tests and security scanners** need the app owner's written permission, and have no command yet.

## Result states

| State | Meaning |
|---|---|
| PASS | The expected result was observed, with evidence |
| FAIL | The result differs from the expected one |
| BLOCKED | A precondition is missing, such as an account, data, or the answer to a question |
| NOT RUN | Planned, but not attempted in this run |
| INCONCLUSIVE | It ran, but proves nothing either way, for example because the result keeps changing |

A check is never counted as PASS just because nothing went wrong.

## Release recommendation

`/qa:laporkan` gives a recommendation. The decision stays with the product team.
- **NO-GO:** a Critical bug is open, a High bug is open on a critical flow, the smoke test failed, or a P1 case was not run.
- **GO WITH CONDITIONS:** a High bug is open outside the critical flows, or a P1 case is blocked with a known owner.
- **GO:** otherwise.

## Kinds of testing

| Kind | Meaning | Command |
|---|---|---|
| Readiness audit | Making sure the environment, accounts, data and documents are ready before testing | `audit-kesiapan` |
| Smoke test | A quick check that the critical flows still work | `jalankan-uji` |
| Functional / end-to-end | One user flow tested from start to finish, against the requirements | `jalankan-uji` |
| API testing | Endpoints tested directly: response content, data types, business rules, invalid input | `jalankan-uji` |
| Authorization testing | One role cannot open another role's pages or records | `jalankan-uji` |
| Exploratory | Directed exploration without a script, with a goal and a time box | `jalankan-uji` |
| Basic accessibility | Automated axe checks plus manual checks, such as the keyboard | `jalankan-uji` |
| Responsive | The layout at widths of 375, 768 and 1280 pixels | `jalankan-uji` |
| Retest | A fixed bug is repeated to make sure the fix holds | `regresi` |
| Regression | Old features still work after a change. What to test is chosen from the diff between releases and the list of critical flows | `regresi` |
| Load tests, security scanners | Need the app owner's written permission | not yet |

Test cases are designed with the ISTQB techniques: equivalence partitioning, boundary values, decision tables and state transitions. Their priority comes from a risk score: impact × likelihood.
