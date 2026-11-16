# AGENTS.md: QA workspace

This repository is a QA workspace, made by the `qa` plugin of the jalankan-tiket kit. It holds QA work for web apps built by other teams, one folder per product in `products/<slug>/`. The rules below apply to every agent that works here.

## Contents

- `qa-workspace.json`: the workspace language and the kit version.
- `products/<slug>/product.json`: the product's repository, staging URL, allowed hosts, roles, side effects, and the Trello and Google Drive IDs.
- `products/<slug>/.env.local`: test accounts. Only the QA engineer fills it in. Never committed.
- `products/<slug>/source/`: a clone of the product's repository, for reading only. Never committed.
- `products/<slug>/tests/`: Playwright suites. `auth.setup.ts` logs in once per role and saves the session in `.auth/`.
- `products/<slug>/tests/support/`: `session.ts` loads and re-saves each role's session (specs use `import { test, expect } from '../support/session'` and `test.use({ role: '<role>' })`), and `redact.ts` redacts URLs before they are printed.
- `products/<slug>/readiness.md`: the latest readiness audit.
- `products/<slug>/requirements.md`, `questions.md`, `risks.md`, `cases/`: requirements, questions, risks and test cases.
- `products/<slug>/cycles/<cycle>/`: one round of testing: results, bugs, exploratory logs. Evidence in `evidence/` is never committed.

## Rules

1. **The product's repository is read-only.** Never push, never open issues, PRs or comments in it, and never fix its code. Findings go to Trello and the test report.
2. **Only the hosts in `allowedHosts`.** Never open or test any other host, production above all. `playwright.config.ts` stops the tests when the host is not listed.
3. **Passwords never pass through an agent.** Never read `.env.local` or `.auth/`, and never print what they hold. Logins use the sessions from `auth.setup.ts`. A password never appears in a report, a card, a commit or a screenshot.
4. **Test data is marked.** Every record a test creates starts with `testDataPrefix` from `product.json`. Never change or delete data that QA did not create.
5. **Side effects.** While `sideEffects` of a channel (email, SMS, WhatsApp, payment) is `unknown` or `real`, every test that triggers it is BLOCKED.
6. **Out of scope without written permission:** load tests, security scanners, brute force, and anything against production.
7. **Results are evidence.** Every check ends as PASS (only with evidence), FAIL, BLOCKED, NOT RUN or INCONCLUSIVE. Never report PASS because "nothing went wrong".
8. **Language.** Everything written for the QA engineer and the developers uses the language in `qa-workspace.json`.

## Commands

| Command | Purpose |
|---|---|
| `/qa:siapkan-produk` | Create the workspace if it does not exist yet, then add or complete one product |
| `/qa:audit-kesiapan` | Check whether a product is ready for testing, ending in READY or BLOCKED |
| `/qa:rencanakan-uji` | Write requirements, questions, risks, test cases and the test plan, then open a test cycle |
| `/qa:jalankan-uji` | Run the test cases and exploration on staging, and confirm every bug |
| `/qa:laporkan` | Create the bug cards on Trello and the test report in Google Docs |
| `/qa:regresi` | Choose the regression tests after a new release, from the diff and the critical flows |
| `/qa:siklus` | Run the whole cycle without stopping between commands |

To run a product's suites from the workspace root: `npx playwright test -c products/<slug>`.
