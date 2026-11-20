# The QA workspace and its config

The QA workspace is a private git repository owned by the QA engineer. `/qa:siapkan-produk` creates it and adds products to it. ADR-0004 records why it exists.

## Layout

```
qa-workspace.json            workspace config
AGENTS.md, CLAUDE.md         rules for every agent in the workspace
package.json                 Playwright Test and axe, pinned
.claude/settings.json        permission rules and the plugin's auto-update
products/<slug>/
  product.json               product config
  .env.local.example         the variable names of the test accounts
  .env.local                 the test accounts. The QA engineer fills it. Agents never read it
  .auth/<role>.json          saved sessions. Agents never read them
  source/                    read-only clone of the product's repository
  playwright.config.ts
  tests/                     auth setup, suites per area, probes (see playwright.md)
  tests/support/             session.ts (saved sessions per role), login.ts (the login steps) and redact.ts (URLs without secrets)
  readiness.md               the latest readiness audit
  requirements.md            requirements with IDs, and the traceability matrix
  questions.md               questions for the product team
  risks.md                   risk scores and the critical flows
  cases/<area>.md            test cases, and the exploratory charters
  cycles/<cycle>/
    cycle.json               the cycle's state
    results.json, results.md the newest result of every case
    bugs/BUG-<nnn>.md        confirmed bugs
    exploratory/<charter>.md exploratory logs
    run/brief.md             what every agent of the run needs: the QA engineer's decisions and permissions, data, rate limits
    run/candidates.md        bug candidates and their status with the pemeriksa
    run/handoff.md           where the run stands, so that a new session can continue it
    evidence/                screenshots and videos, never committed
```

`.env.local`, `.auth/`, `source/` and every test output are in `.gitignore`.

## `qa-workspace.json`

| Key | Meaning | Example |
|---|---|---|
| `qaKitVersion` | The plugin version that made the workspace files | `"0.1.0"` |
| `language` | The language of everything written for the QA engineer and developers: reports, cards, questions, commit messages. `id` or `en` | `"id"` |

## `products/<slug>/product.json`

| Key | Meaning |
|---|---|
| `name`, `slug` | The product's name, and its folder name |
| `repo`, `branch` | The product's repository (`owner/name`), and the branch that staging runs |
| `baseURL` | The staging base URL. Every test runs against it |
| `allowedHosts` | The host names the tests may visit. The QA engineer confirms each one as non-production |
| `loginPath` | The login page's path |
| `roles` | One entry per role with a test account: `key`, `label`, and `env`, the prefix of `<env>_USERNAME` and `<env>_PASSWORD` in `.env.local`. Optional `loginURL`: the full URL of the role's login page, on a host in `allowedHosts`, when it differs from `loginPath`, such as a back office |
| `sideEffects` | One value per outward channel: always `email`, `sms`, `whatsapp` and `payment`, plus any other channel the code shows, such as `chat` (Slack, Teams or Google Chat webhooks), `push` or `webhook`. Each value is `none` (the app has no such channel), `sandbox` (staging uses a test service or a mock), `real` (staging reaches real people, real systems or real money), or `unknown` |
| `testDataPrefix` | The prefix of every record a test creates. Default `QA-AUTO` |
| `trello` | `boardId` and `boardUrl` of the team's board, `reviewListId` of the list where new bug cards go, `retestListId` of the list where developers put fixed cards, or `null` |
| `drive` | `folderId` of the product's Drive folder, and `evidenceFolderId` of its evidence subfolder |
| `writtenPermission` | For `loadTesting` and `securityScanning`: `null`, or where the app owner's written permission is recorded, such as a link to the message |

Example:

```json
{
  "name": "Toko Buku",
  "slug": "toko-buku",
  "repo": "contoh-org/toko-buku",
  "branch": "staging",
  "baseURL": "https://staging.toko-buku.example",
  "allowedHosts": ["staging.toko-buku.example"],
  "loginPath": "/login",
  "roles": [
    { "key": "admin", "label": "Admin", "env": "QA_ADMIN" },
    { "key": "kasir", "label": "Kasir", "env": "QA_KASIR" }
  ],
  "sideEffects": { "email": "sandbox", "sms": "none", "whatsapp": "unknown", "payment": "sandbox" },
  "testDataPrefix": "QA-AUTO",
  "trello": {
    "boardId": "ari:cloud:trello::board/workspace/…",
    "boardUrl": "https://trello.com/b/…",
    "reviewListId": "ari:cloud:trello::list/workspace/…",
    "retestListId": null
  },
  "drive": { "folderId": "1AbC…", "evidenceFolderId": "1DeF…" },
  "writtenPermission": { "loadTesting": null, "securityScanning": null }
}
```

## `cycles/<cycle>/cycle.json`

A **cycle** is one round of testing one version of the product. `/qa:rencanakan-uji` opens it, `/qa:jalankan-uji` runs it, and `/qa:laporkan` reports it. The cycle ID is `<YYYY-MM-DD>-<short version>`. The short version is always the first 7 characters of the commit, even where `git` prints more, so that one version is written one way in every file.

| Key | Meaning |
|---|---|
| `id` | The cycle ID, such as `"2026-03-02-a1b2c3d"` |
| `version` | The version under test |
| `scope` | The areas in scope, or `"all"` |
| `status` | `planned`, `running`, `executed` or `reported` |
| `plannedAt` | The date the plan was written |
| `planDocUrl`, `reportDocUrl` | The Google Docs links, or `null` |
| `cases` | Optional. The case IDs in the run, when `/qa:regresi` chose them. Without it, every case in scope runs |
| `retest` | Optional. The bug IDs to retest in this cycle, such as `["BUG-003"]` |
| `previousCycle` | Optional. The cycle this regression run compares with |

## `cycles/<cycle>/results.json`

The newest result of every case and charter in the cycle. `/qa:jalankan-uji` updates it after every area and every verdict, so a run that stops loses nothing. States are always written in English here, and translated in `results.md`.

```json
{
  "cycle": "2026-03-02-a1b2c3d",
  "updatedAt": "2026-03-02T14:05:00+07:00",
  "cases": [
    { "id": "TC-KASIR-004", "priority": "P1", "state": "FAIL", "evidence": ["TC-KASIR-004-1.png"], "bug": "BUG-003", "note": "" },
    { "id": "TC-KASIR-007", "priority": "P2", "state": "BLOCKED", "evidence": [], "bug": null, "note": "Q-004: payment sandbox unknown", "owner": "developer" }
  ],
  "charters": [
    { "id": "EX-03", "probes": 18, "bugs": ["BUG-004"], "questions": ["Q-005"] }
  ],
  "retests": [
    { "bug": "BUG-001", "state": "PASS", "note": "not reproduced in 3 of 3 runs" }
  ]
}
```

`state` is one of `PASS`, `FAIL`, `BLOCKED`, `NOT RUN` and `INCONCLUSIVE`, as `evidence.md` defines them. A BLOCKED case names in `owner` who can unblock it. A case that shows two bugs names in `bug` the one it failed on, and the other in `note`: a retest of the second can pass while the case still fails.

Write the file with `node ${CLAUDE_PLUGIN_ROOT}/scripts/hasil.mjs <cycle dir> init | set | charter | retest | summary`, rather than by hand or with a script of your own. It keeps the format, and refuses a BLOCKED case without an owner.
