---
name: siapkan-produk
description: Add a web app built by another team to the QA engineer's QA workspace, creating the workspace first when there is none. Clones the product read-only and prepares its config, logins, Trello list and Drive folder.
disable-model-invocation: true
---

# Set up a product for QA

You add one product to the QA engineer's QA workspace. When there is no workspace yet, you create it first. The QA engineer may name the product's repository after the command, such as `/qa:siapkan-produk contoh-org/toko-buku`.

Read these before you start, and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/reference/safety.md`: the rules of engagement;
- `${CLAUDE_PLUGIN_ROOT}/reference/workspace.md`: the workspace layout and `product.json`;
- `${CLAUDE_PLUGIN_ROOT}/reference/questions.md`: how to ask;
- `${CLAUDE_PLUGIN_ROOT}/reference/connectors.md`: Trello and Google Drive.

The templates are in `${CLAUDE_PLUGIN_ROOT}/templates/`, and `templates/README.md` lists every placeholder.

Talk to the QA engineer in **one language only**. Before the workspace language is known, use the language they write in. When they typed nothing but the command, run `echo $LANG`: Indonesian when it starts with `id`, English otherwise. Once the workspace language is set, use it for every message and every file.

## 1. Explore (read only)

Find out, without changing anything:
- **Where you are.**
  - `qa-workspace.json` in the current folder: this is the workspace. Read `language` and list `products/`.
  - The product already has a folder in `products/`: complete it instead of adding it again. Fill only what is missing, such as empty Trello or Drive IDs after a connector was connected, or a missing file. Never overwrite an earlier answer without asking.
  - An empty folder: the workspace will be created here.
  - A folder with application code, or the product's own repository: stop. The QA workspace is a separate repository. Tell the QA engineer to open a session in an empty folder, such as `~/qa-workspace`, and run the command again.
- **GitHub.** `gh auth status` shows a login. Note whether `git config user.name` and `git config user.email` are set.
- **Tools.** `node --version` is 20.12 or newer, and `jq` and `git` exist.
- **Connectors.** Among your tools, find the Trello tools (names ending in `trelloReadBoard`) and the Google Drive tools (names ending in `create_file`).
- **The product's repository,** when the QA engineer named it: `gh repo view <owner/name> --json name,visibility,defaultBranchRef,viewerPermission`.

This step is done when you can say whether a workspace exists and name every fact above. When Node.js, `jq` or a GitHub login is missing, stop and tell the QA engineer how to install or log in. A missing connector does not stop setup: its part is skipped and reported.

## 2. Ask about the workspace and the repository

Ask in one round, in the format of `questions.md`. Skip what you already know.
1. **Workspace language,** only when there is no workspace: Indonesian or English. Recommend the language you are speaking. Reports, Trello cards, questions and commit messages use it.
2. **Workspace repository,** only when there is no workspace: its name, `qa-workspace` by default, as a **private** repository under the active `gh` account. It holds test cases and results about other teams' products, so it never becomes public.
3. **The product's repository** (`owner/name`), unless it was named after the command.
4. **Git identity,** only when step 1 found none: the name and email for commits in the workspace. Recommend the values from `gh api user --jq '.name, .email'`, set inside the workspace only with `git config user.name` and `git config user.email` after `git init`. The machine's global settings stay as they are.

## 3. Create the workspace (first run only)

1. Run `git init -b main`.
2. Copy `templates/common/workspace/` and `templates/<language>/workspace/` into the folder, including the dot files. Fill `{{KIT_VERSION}}` from `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` and `{{LANGUAGE}}`.
3. Run `npm install`, then `npx playwright install chromium`. Tell the QA engineer that the browser download is about 150 MB.
4. Commit with a message in the workspace language that means "Create the QA workspace".
5. Create the repository and push: `gh repo create <name> --private --source . --remote origin --push`.

## 4. Clone the product and read it

1. **Clone** into `products/<slug>/source/`, where `<slug>` is the repository name in lowercase, such as `toko-buku`: `git clone --filter=blob:none https://github.com/<owner/name>.git products/<slug>/source`.
2. **Disable pushing** from the clone: `git -C products/<slug>/source remote set-url --push origin DISABLED`.
3. **Read the product** to prepare recommendations. Only read; never run its code or install its dependencies.
   - **Documents:** the PRD, specs, user stories, README and `docs/`. Note their paths.
   - **Staging:** deploy workflows and environment files that name a staging branch or host.
   - **Roles:** role names in the code, such as enums, permission maps and seed users. Never copy a password from a seed file.
   - **Login:** the login route, its field labels and submit button text, and something that only a logged-in user sees, such as a logout button. Look in the components and translation files.
   - **Side effects:** integrations that send email, SMS or WhatsApp, take payments, or call other outward channels such as chat webhooks, push notifications or webhooks to other systems: packages, config keys in `.env.example`, service clients.

This step is done when you can propose a slug, a branch, the roles, the login locators and a value for each side-effect channel.

## 5. Ask about the product

Ask in one round, in the format of `questions.md`, with your recommendations from step 4:
1. **Name and slug** of the product.
2. **Branch** that staging runs.
3. **Staging URL.** Ask the QA engineer to confirm it is not production. Ask for every other host the app needs, such as an API subdomain. Together they become `allowedHosts`.
4. **Roles with test accounts.** List the roles you found, and ask which have an account. Each role gets a `key`, a `label` and an `env` prefix, such as `QA_KASIR`.
5. **Side effects.** For each channel, propose `none`, `sandbox`, `real` or `unknown`. Add a key for every other outward channel you found, such as `chat` or `webhook`. Recommend `unknown` whenever the code shows the channel and nobody has confirmed a sandbox.
6. **Trello board** for bugs: its URL. Propose creating a list named `QA – Perlu Ditinjau` (`QA – Needs review` in English) when the board has no such list. New bug cards land there, and the QA engineer moves each one to the developers.
7. **Google Drive folder:** recommend a new folder `QA – <product name>` with a subfolder `Bukti` (`Evidence`) in the QA engineer's Drive. The other option is the link of an existing folder.

Never ask for passwords or usernames. The QA engineer writes them into `.env.local` in step 8.

## 6. Prepare Trello and Drive

Skip a part when its connector is missing, and report it in step 9. Wait at least 10 seconds between two writes.
- **Trello.** Read the board with `trelloReadBoard` (`get`, with the board URL) and its lists with `trelloReadList`. Create the review list with `trelloWriteList` only when the QA engineer agreed in step 5. Keep the board ARI, the board URL and the list ARI.
- **Drive.** Create the folder and its evidence subfolder with `create_file`, or read the existing folder with `get_file_metadata`. Keep both IDs.

## 7. Write the product files

1. Copy `templates/common/product/` into `products/<slug>/`. The language files in `templates/<language>/product/` are written later by the other commands.
2. Fill the placeholders in `product.json` and `.env.local.example` with the answers and the IDs from step 6. A missing Trello or Drive ID becomes an empty string.
3. Fill the login locators in `tests/auth.setup.ts` from what you found in step 4. Prefer `getByLabel` and `getByRole` with the visible text. When the code leaves a locator unclear, open the staging login page with your browser tools and read its accessibility tree, without typing anything. When a role logs in differently, such as with a PIN, add a branch for that role in the same file.
4. **Check your work.**
   - `grep -rnE '\{\{[A-Z0-9_]+\}\}' products/<slug> --exclude-dir=source` finds nothing.
   - `npx playwright test -c products/<slug> --list` lists the login tests without an error.
   - `git status` does not show `source/`, `.env.local` or `.auth/`.

## 8. Commit, push, and hand over

1. Commit `products/<slug>/` with a message in the workspace language that means "Add product <name>", then `git push`.
2. Give the QA engineer the one step that is theirs: copy the example file and fill in the test accounts in their editor. They type this in the session:

   ```
   ! cp products/<slug>/.env.local.example products/<slug>/.env.local
   ```

## 9. Report

Tell the QA engineer, in plain words:
- what was created: the workspace repository link (first run), the product folder, the Trello list and the Drive folder links;
- what was skipped, and why, such as a missing connector;
- the open steps: fill in `.env.local`, and share the Drive folder with the developers who will read the reports;
- the next step: `/qa:audit-kesiapan <slug>`.
