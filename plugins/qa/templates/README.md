# QA workspace templates

The qa skills copy these files into the QA workspace and fill each placeholder. `/qa:siapkan-produk` copies `common/` and `<language>/workspace/`; the other commands write the language files of `product/` and `cycle/` when they need them.

## Layout

- `common/workspace/` holds the workspace root files that are the same in every language. They are copied once, when the workspace is created.
- `common/product/` holds the files of one product folder, `products/<slug>/`. They are copied for every new product.
- `id/` and `en/` hold the same files with content in Indonesian and in English. Use the folder that matches the workspace language:
  - `workspace/` goes into the workspace root when the workspace is created;
  - `product/` holds the product files that later commands write: `readiness.md` (`/qa:audit-kesiapan`), and `requirements.md`, `questions.md`, `risks.md` and `test-plan.html` (`/qa:rencanakan-uji`);
  - `cycle/` holds the files of one cycle: `results.md` and `bug.md` (`/qa:jalankan-uji`), `test-report.html` (`/qa:laporkan`) and `regression.md` (`/qa:regresi`).
- File names are in English whatever the language, so the skills can name a file without knowing the language.

## Placeholders

| Placeholder | Filled with |
|---|---|
| `{{KIT_VERSION}}` | `version` from the plugin's `plugin.json` |
| `{{LANGUAGE}}` | `id` or `en` |
| `{{PRODUCT_NAME}}` | The product's name, as the QA engineer writes it |
| `{{PRODUCT_SLUG}}` | The folder name: lowercase letters, digits and hyphens, such as `toko-buku` |
| `{{TARGET_REPO}}` | The product's repository, `owner/name` |
| `{{TARGET_BRANCH}}` | The branch that staging runs, such as `staging` or `main` |
| `{{STAGING_URL}}` | The staging base URL, such as `https://staging.toko-buku.example` |
| `{{ALLOWED_HOSTS}}` | A JSON array of host names the tests may visit, such as `["staging.toko-buku.example"]` |
| `{{LOGIN_PATH}}` | The login page's path, such as `/login` |
| `{{ROLES}}` | A JSON array of roles: `[{"key": "kasir", "label": "Kasir", "env": "QA_KASIR"}]`. `key` names the session file, `env` is the prefix of the role's two variables in `.env.local`. A role that logs in on another page, such as a back office, adds `"loginURL"` with the full URL |
| `{{SIDE_EFFECTS}}` | A JSON object with one value per channel: `{"email": "unknown", "sms": "unknown", "whatsapp": "unknown", "payment": "unknown"}`. Values are listed in `reference/workspace.md` |
| `{{ROLE_ENV_LINES}}` | Two empty lines per role, such as `QA_KASIR_USERNAME=` and `QA_KASIR_PASSWORD=` |
| `{{TRELLO_BOARD_ID}}`, `{{TRELLO_BOARD_URL}}`, `{{TRELLO_REVIEW_LIST_ID}}` | The board's ARI and URL, and the review list's ARI, from the Trello connector |
| `{{DRIVE_FOLDER_ID}}`, `{{DRIVE_EVIDENCE_FOLDER_ID}}` | The product's Drive folder and its evidence subfolder, from the Google Drive connector |
| `{{PAGE_READY}}` | In the `default` entry of `loginPages` in `tests/support/login.ts`: a Playwright locator expression for something that appears only once the login page's own script has run, such as a header link that the client renders. Use `page.locator('form')` when the page is plain HTML without client-side rendering |
| `{{USERNAME_FIELD}}`, `{{PASSWORD_FIELD}}`, `{{SUBMIT_BUTTON}}`, `{{LOGGED_IN_CHECK}}` | In the `default` entry of `loginPages` in `tests/support/login.ts`: Playwright locator expressions for the login form, such as `page.getByLabel('Email')`, `page.getByLabel('Kata sandi')`, `page.getByRole('button', { name: 'Masuk' })` and `page.getByRole('button', { name: 'Keluar' })` |
| `{{DATE}}` | `YYYY-MM-DD` |
| `{{VERSION_UNDER_TEST}}`, `{{VERDICT}}`, `{{CHECK_ROWS}}`, `{{QUESTIONS}}`, `{{NEXT_STEP}}` | Filled by `/qa:audit-kesiapan` in `readiness.md`. `{{QUESTIONS}}` is also the list in `questions.md` |
| `{{REQUIREMENT_ROWS}}`, `{{TRACE_ROWS}}`, `{{UNCOVERED}}`, `{{ORPHAN_CASES}}`, `{{RISK_ROWS}}`, `{{CRITICAL_FLOWS}}` | Filled by `/qa:rencanakan-uji` in `requirements.md` and `risks.md` |
| `{{CYCLE_ID}}`, `{{SCOPE}}`, `{{OUT_OF_SCOPE}}`, `{{APPROACH}}`, `{{ROLE_LIST}}`, `{{ENTRY_CRITERIA}}`, `{{EXIT_CRITERIA}}`, `{{RISK_SUMMARY}}`, `{{CASE_COUNTS}}`, `{{OPEN_QUESTIONS}}`, `{{NOTES}}` | Filled by `/qa:rencanakan-uji` in `test-plan.html`, as HTML |
| `{{COUNT_ROWS}}`, `{{EXIT_STATUS}}`, `{{BUG_ROWS}}`, `{{INCONCLUSIVE_ROWS}}`, `{{BLOCKED_ROWS}}`, `{{CASE_ROWS}}`, `{{EXPLORATORY_SUMMARY}}` | Filled by `/qa:jalankan-uji` in `results.md` |
| `{{BUG_NUMBER}}`, `{{BUG_TITLE}}`, `{{SEVERITY}}`, `{{SEVERITY_REASON}}`, `{{PRIORITY}}`, `{{PRIORITY_REASON}}`, `{{BROWSER}}`, `{{ROLE}}`, `{{LINKS}}`, `{{FREQUENCY}}`, `{{CARD_URL}}`, `{{PRECONDITIONS}}`, `{{STEPS}}`, `{{EXPECTED}}`, `{{ACTUAL}}`, `{{EVIDENCE}}` | Filled by `/qa:jalankan-uji` in `bug.md`, following `reference/bugs.md`. `{{CARD_URL}}` stays as a dash until `/qa:laporkan` creates the card |
| `{{RECOMMENDATION}}`, `{{RECOMMENDATION_REASONS}}`, `{{COUNT_TABLE}}`, `{{BUG_TABLE}}`, `{{RETEST_TABLE}}`, `{{OPEN_ITEMS}}`, `{{COVERAGE}}` | Filled by `/qa:laporkan` in `test-report.html`, as HTML. `{{EXIT_STATUS}}`, `{{EXPLORATORY_SUMMARY}}`, `{{OPEN_QUESTIONS}}` and `{{NEXT_STEP}}` mean the same as elsewhere |
| `{{OLD_VERSION}}`, `{{PREVIOUS_CYCLE}}`, `{{CHANGE_SUMMARY}}`, `{{CHANGED_AREAS}}`, `{{SELECTED_ROWS}}`, `{{RETEST_ROWS}}`, `{{NEW_BEHAVIOUR}}`, `{{NOT_CHOSEN}}` | Filled by `/qa:regresi` in `regression.md` |
