---
name: audit-kesiapan
description: Check whether a product in the QA workspace is ready for testing - environment, version, test accounts, roles, requirements, test data, side effects and connectors - and end in READY or BLOCKED with questions for the product team.
disable-model-invocation: true
---

# Readiness audit

You check whether one product is ready for testing, before any test plan or test run. You never change the product or its data. The QA engineer may name the product after the command, such as `/qa:audit-kesiapan toko-buku`.

Read these first, and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/reference/safety.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/evidence.md`: the states `OK`, `WARN` and `FAIL`, and the verdict;
- `${CLAUDE_PLUGIN_ROOT}/reference/questions.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/connectors.md`.

## 1. Find the product

- Run from the workspace root, the folder with `qa-workspace.json`. When it is missing, stop and point to `/qa:siapkan-produk`.
- Read `language` from `qa-workspace.json`. Every message and every file uses it.
- Pick the product: the one named after the command, or the only folder in `products/`. When there are several and none is named, ask which one.
- Read `products/<slug>/product.json`.

## 2. Run the checks

Give every check a state with its evidence: the command and what it printed, or the file and line. Fix it yourself only where the table says so, then run the check again.

| # | Check | How | FAIL when | WARN when | You fix it |
|---|---|---|---|---|---|
| 1 | Guardrails | `.claude/settings.json` denies reading `.env.local` and `.auth/`. `git -C products/<slug>/source remote get-url --push origin` prints `DISABLED` | a deny rule is missing | | Restore the rules from `templates/common/workspace/.claude/settings.json`, and disable the push URL |
| 2 | Tools | `node --version` is 20.12 or newer. `npx playwright --version` matches `package.json`. The Chromium browser is installed | Node.js is too old or missing | the versions differ | `npm install`, `npx playwright install chromium` |
| 3 | Product clone | `git -C products/<slug>/source pull --ff-only` on `branch` | the branch does not exist | | the pull itself |
| 4 | Staging reachable | `curl -sS -L -o /dev/null --max-time 20 -w '%{http_code} %{url_effective}' <baseURL>` | no answer, a 5xx, a TLS error, or a final host outside `allowedHosts` | a 4xx on the base URL | |
| 5 | Not production | Each host in `allowedHosts` names a test environment, such as `staging`, `stg`, `dev`, `test`, `uat`, `qa`, `sandbox` or `preview`, and differs from every production host in the product's config and deploy files | a host equals a production host | a host has no such marker. Ask the QA engineer to confirm it again | |
| 6 | Version under test | A version or commit that staging shows: a footer, a `/version` or health endpoint you find in the code. Otherwise the newest commit on `branch` | | staging shows no version. Bug reports then cannot name the build | |
| 7 | Test accounts complete | `bash ${CLAUDE_PLUGIN_ROOT}/scripts/cek-env.sh products/<slug>` | every role is incomplete | some roles are incomplete | |
| 8 | Logins | `npx playwright test -c products/<slug> --project=setup`. Each role passes, fails or is skipped | no role logs in | some roles fail or are skipped | Fix the locators in `tests/auth.setup.ts` when the failure shows a wrong locator, never the credentials |
| 9 | Role coverage | Roles in the code against the roles in `product.json` | | a role in the code has no test account, or fewer than two roles have one. Authorization checks need two | |
| 10 | Requirements | The PRD, specs or user stories in `source/`. Compare `git log -1 --format=%ci -- <document>` with the newest code change | | no document exists, or the documents are much older than the code | |
| 11 | Testability | Each feature in the documents has acceptance criteria, numbers and rules that a test can check | | a feature has none. Each gap becomes a question | |
| 12 | Test data | The data the main flows need, from the documents and the code, such as items, customers, employees or price lists. Where a list page exists, check it with a short read-only test in `tests/audit/data.spec.ts`: `test.use({ storageState: join(__dirname, '..', '..', '.auth', '<role>.json') })`, visit the page, and assert that it shows at least one record | | data is missing, or cannot be checked without changing anything | |
| 13 | Side effects | `sideEffects` in `product.json`. Name the flows that trigger each `unknown` or `real` channel, from the code | | a channel is `unknown` or `real`. Those flows will be BLOCKED | |
| 14 | Trello | `trelloReadBoard` (`get`) on `boardId`, and the list `reviewListId` exists | | the connector is missing, or the board or list cannot be read. Bug cards are then BLOCKED | |
| 15 | Google Drive | `get_file_metadata` on `folderId` and `evidenceFolderId` | | the connector is missing, or a folder cannot be read. The report and evidence are then BLOCKED | |

Never print or attach what the setup project's output may contain about credentials. Report a failed login by role and by the step that failed.

This step is done when all 15 checks have a state and evidence.

## 3. Decide the verdict

Follow `evidence.md`: **BLOCKED** (`TERBLOKIR`) when any check FAILs, **READY WITH NOTES** (`SIAP DENGAN CATATAN`) when a check WARNs, **READY** (`SIAP`) otherwise.

## 4. Write the questions

Turn every FAIL and WARN that someone else must resolve into a question, in the format of `questions.md`, with who can answer it. Typical questions:
- which build staging runs, and where it can be seen;
- whether a channel sends real messages or takes real payments on staging;
- an account for a role that has none;
- data a flow needs;
- a rule, a number or an acceptance criterion the documents leave open.

## 5. Write and share the result

1. Copy `templates/<language>/product/readiness.md` to `products/<slug>/readiness.md`, replacing any earlier one, and fill it in. Each check is one table row, with the follow-up and who does it.
2. When the Drive connector works, publish the same content as a Google Doc named `Audit kesiapan – <name> – <date>` (`Readiness audit – <name> – <date>` in English) in `folderId`, as `connectors.md` describes. Add its link at the end of `readiness.md`.
3. Commit `readiness.md` with a message in the workspace language that means "Readiness audit <name> <date>", then `git push`.

## 6. Report

Tell the QA engineer, in plain words:
- the verdict, and the link to the Doc;
- each FAIL, with its fix and who carries it out. Steps that are the QA engineer's own, such as filling in `.env.local`, come as commands they can type;
- the questions to forward to the product team;
- the next step:
  - **BLOCKED:** resolve the FAILs, then run `/qa:audit-kesiapan <slug>` again;
  - **READY**, or **READY WITH NOTES:** test planning. When `${CLAUDE_PLUGIN_ROOT}/skills/rencanakan-uji/SKILL.md` exists, name `/qa:rencanakan-uji <slug>`. Otherwise say that this plugin version stops at the audit.
