# The qa plugin: testing apps built by other teams

The `qa` plugin is for a QA engineer who tests web apps built by other teams, such as an ERP, an HRIS, an online shop or a POS. The app does not need to use this kit. Claude prepares the QA work, checks whether the product is ready for testing, then tests it from the outside through a browser on staging. Bugs go to Trello, and test reports go to Google Docs.

The `tiket` plugin builds a product, while `qa` only tests and reports. `qa` never changes the product's repository or fixes its code.

> **Status: 0.1.0, stage 1.** Only `/qa:siapkan-produk` and `/qa:audit-kesiapan` exist so far. Test planning, testing and reporting follow in stages 2 and 3. The design is in [ADR-0004](../adr/0004-qa-plugin.md).

## What you need

- **Access to the product:** read access to its GitHub repository, the staging URL, and a test account for each role, such as admin and cashier.
- **On your machine:** Node.js 20.12 or later, `git`, `jq`, and the GitHub CLI `gh`, logged in.
- **claude.ai connectors:** Trello and Google Drive. Connect them in the claude.ai Connectors settings, then open a new session.

## Install

```
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install qa@jalankan-tiket
```

## Workflow

1. **Open a Claude Code session in an empty folder,** such as `~/qa-workspace`. This folder becomes the *QA workspace*: a private repository of yours that holds the QA work for every product.
2. **`/qa:siapkan-produk contoh-org/toko-buku`.** The first time, this command creates the QA workspace. Then it adds the product:
   - it clones the product's repository, for reading only;
   - it reads the documents and the code to prepare recommendations;
   - it asks you one round of questions: staging, roles, side effects, the Trello board and the Drive folder;
   - it prepares a "QA – Needs review" list on Trello and an evidence folder on Drive;
   - it writes the product config and the login script.
3. **Fill in the test accounts yourself.** Claude never sees a password. Copy the example file, then fill it in with your editor:

   ```
   ! cp products/toko-buku/.env.local.example products/toko-buku/.env.local
   ```

4. **`/qa:audit-kesiapan toko-buku`.** Claude runs 15 checks and ends with **READY**, **READY WITH NOTES** or **BLOCKED**. It checks:
   - the guardrails and the tools;
   - that staging answers and is not production;
   - the version under test;
   - the test accounts and each role's login;
   - role coverage;
   - the requirement documents and whether they can be tested;
   - test data;
   - side effects;
   - Trello and Drive.

   The result is saved in `readiness.md` and in Google Docs, with questions you can forward to the product team.

## Where results go

| What | Where |
|---|---|
| Bugs | Trello, one card per bug. New cards land in the "QA – Needs review" list, and you move each one to the developers |
| Test plans and reports | Google Docs, in the product's folder |
| Evidence (screenshots, videos) | The "Evidence" folder on Google Drive, linked from cards and reports |
| Test cases, automated tests, run history | The QA workspace on GitHub, a private repository |

## Safety rules

- **The product's repository is read-only.** Claude never pushes, never opens issues, PRs or comments there, and never fixes its code.
- **Only the hosts you list.** Tests stop before they start when the target is not a host in `allowedHosts`. Production is never listed.
- **Passwords never pass through Claude.** A Playwright script that reads `.env.local` does the logins. The workspace's permission rules deny Claude reading that file.
- **Test data is marked** with `QA-AUTO`. Data that QA did not create is never changed or deleted.
- **Side effects.** Until it is clear whether staging sends real email, SMS or WhatsApp messages, or takes real payments, every test that triggers them is BLOCKED.
- **Load tests and security scanners** need the app owner's written permission, and have no command yet.

## Result states

| State | Meaning |
|---|---|
| PASS | The expected result was observed, with evidence |
| FAIL | The result differs from the expected one |
| BLOCKED | A precondition is missing, such as an account or data |
| NOT RUN | Planned, but not attempted in this run |
| INCONCLUSIVE | It ran, but proves nothing either way, for example because the result keeps changing |

A check is never counted as PASS just because nothing went wrong.

## Kinds of testing

| Kind | Meaning | Stage |
|---|---|---|
| Readiness audit | Making sure the environment, accounts, data and documents are ready before testing | 1 |
| Smoke test | A quick check that the main features still work | 2 |
| Functional / end-to-end | One user flow tested from start to finish, against the requirements | 2 |
| API testing | Endpoints tested directly: response content, data types, business rules, invalid input | 2 |
| Authorization testing | One role cannot open another role's pages or records | 2 |
| Exploratory | Directed exploration without a script, with a goal and a time box | 2 |
| Basic accessibility | Automated axe checks plus manual checks, such as the keyboard | 2 |
| Responsive | The layout at several screen sizes | 2 |
| Regression | Old features still work after a change. What to test is chosen from the diff between releases and the list of critical flows | 3 |
| Load tests, security scanners | Need the app owner's written permission | not yet |

Test cases are designed with the ISTQB techniques: equivalence partitioning, boundary values, decision tables and state transitions.
