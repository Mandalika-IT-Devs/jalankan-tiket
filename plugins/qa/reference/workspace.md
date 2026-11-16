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
  tests/auth.setup.ts
  readiness.md               the latest readiness audit
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
| `roles` | One entry per role with a test account: `key`, `label`, and `env`, the prefix of `<env>_USERNAME` and `<env>_PASSWORD` in `.env.local` |
| `sideEffects` | One value per channel (`email`, `sms`, `whatsapp`, `payment`): `none` (the app has no such channel), `sandbox` (staging uses a test service or a mock), `real` (staging reaches real people or real money), or `unknown` |
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
