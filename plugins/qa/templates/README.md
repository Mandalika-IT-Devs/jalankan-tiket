# QA workspace templates

`/qa:siapkan-produk` copies these files. It fills each placeholder, then commits the result to the QA workspace.

## Layout

- `common/workspace/` holds the workspace root files that are the same in every language. They are copied once, when the workspace is created.
- `common/product/` holds the files of one product folder, `products/<slug>/`. They are copied for every new product.
- `id/` and `en/` hold the same files with content in Indonesian and in English. Copy the folder that matches the workspace language: `workspace/` into the root, `product/` into the product folder.
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
| `{{ROLES}}` | A JSON array of roles: `[{"key": "kasir", "label": "Kasir", "env": "QA_KASIR"}]`. `key` names the session file, `env` is the prefix of the role's two variables in `.env.local` |
| `{{SIDE_EFFECTS}}` | A JSON object with one value per channel: `{"email": "unknown", "sms": "unknown", "whatsapp": "unknown", "payment": "unknown"}`. Values are listed in `reference/workspace.md` |
| `{{ROLE_ENV_LINES}}` | Two empty lines per role, such as `QA_KASIR_USERNAME=` and `QA_KASIR_PASSWORD=` |
| `{{TRELLO_BOARD_ID}}`, `{{TRELLO_BOARD_URL}}`, `{{TRELLO_REVIEW_LIST_ID}}` | The board's ARI and URL, and the review list's ARI, from the Trello connector |
| `{{DRIVE_FOLDER_ID}}`, `{{DRIVE_EVIDENCE_FOLDER_ID}}` | The product's Drive folder and its evidence subfolder, from the Google Drive connector |
| `{{USERNAME_FIELD}}`, `{{PASSWORD_FIELD}}`, `{{SUBMIT_BUTTON}}`, `{{LOGGED_IN_CHECK}}` | Playwright locator expressions for the login form, such as `page.getByLabel('Email')`, `page.getByLabel('Kata sandi')`, `page.getByRole('button', { name: 'Masuk' })` and `page.getByRole('button', { name: 'Keluar' })` |
| `{{DATE}}` | `YYYY-MM-DD` |
| `{{VERSION_UNDER_TEST}}`, `{{VERDICT}}`, `{{CHECK_ROWS}}`, `{{QUESTIONS}}`, `{{NEXT_STEP}}` | Filled by `/qa:audit-kesiapan` in `readiness.md` |
