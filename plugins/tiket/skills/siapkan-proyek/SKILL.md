---
name: siapkan-proyek
description: Set up a new or existing project for the jalankan-tiket workflow, including its GitHub repository, labels, milestone, CI and agent guardrails.
disable-model-invocation: true
---

# Set up a project

You set up the current folder for the jalankan-tiket workflow. Ask the owner first, then write. The templates, the stack profiles and the scripts all live in `${CLAUDE_PLUGIN_ROOT}`.

Talk to the owner in **one language only**, and never mix two languages in a message.
- Before the project language is chosen, speak the language the owner writes in.
- If the owner has typed nothing but the command, run `echo $LANG`. Speak Indonesian when it starts with `id`, and English otherwise.
- Once the owner chooses the **project language** in step 2, use it for every file you create and for everything you tell the owner.

## 1. Explore (read only)

Find out, without changing anything:
- Whether the folder is a git repository, what its GitHub remote is (`git remote -v`), and whether `gh auth status` shows a login.
- Whether `.github/jalankan-tiket.json` already exists. If it does, the project is already set up: stop and tell the owner to run `/tiket:cek-proyek`.
- Which **mode** applies:
  - **new project**: an empty or nearly empty folder;
  - **existing project**: a folder that holds application code.
- For an existing project:
  - its language, framework and package manifest;
  - its test and lint tools and its CI files;
  - any `AGENTS.md`, `CLAUDE.md`, `CONTEXT.md`, `GLOSSARY.md`, `docs/` or `.claude/settings.json`.
- Whether the `grilling` and `tdd` skills from mattpocock-skills are available.

This step is done when you can name the mode and every fact above. If mattpocock-skills is missing, stop and give the owner the steps in `${CLAUDE_PLUGIN_ROOT}/reference/install.md`.

## 2. Ask the owner

Ask everything in one round, in the format of `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`, in the language you are speaking.

1. **Project language:** Indonesian or English. Recommend the language you are already speaking. It sets the language of the documents, issues, PRs and commits, and of every later conversation about this project.
2. **Product name and summary:** one or two sentences on what the product is, who uses it, and what it leaves out.
3. **Repository:**
   - **New project:** the repository name and its visibility, or the name of the empty repository the owner already created on GitHub. For a new repository, recommend public when the owner has no paid GitHub plan. Two reasons:
     - rulesets that protect `main` exist only on public repositories or paid plans;
     - Actions minutes are free on public repositories.
   - **Existing project:** confirm the remote you found.
4. **Stack:**
   - **New project:** recommend `nextjs-postgres`. Any other choice follows `${CLAUDE_PLUGIN_ROOT}/stacks/CONTRACT.md`.
   - **Existing project:** propose the stack you found.
5. **CI runner:**
   - GitHub-hosted is recommended.
   - Self-hosted on this machine is the other option. It needs Linux with Docker, and it suits private repositories that run out of Actions minutes.
6. **User interface:** does the product have one?
7. **Code owner for protected files:** default to the account that `gh auth status` shows.

These have defaults, so do not ask about them:
- the ticket prefix `T`;
- the five triage labels, each named after its role;
- the owner-approved label: `disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones;
- the example marker: `[CONTOH]` or `[EXAMPLE]`.

This step is done when every question has an answer.

## 3. Prepare GitHub

Do this step before you write `.claude/settings.json`. That file's permission rules deny agents some of these commands, and the rules apply as soon as the file exists.

1. **Connect the repository, new projects only.** Run `git init -b main` if the folder is not a repository yet. Then check whether the owner already created the repository on GitHub, with `gh repo view <owner>/<name> --json isEmpty`.
   - **It exists and is empty:** add it with `git remote add origin https://github.com/<owner>/<name>.git`.
   - **It exists and holds only a README or a license:** add it as `origin`, then run `git pull origin <its default branch>` before you write anything.
   - **It exists and holds anything else:** it is an existing project, not a new one. Tell the owner, and continue with `EXISTING.md`.
   - **It does not exist:** create it with `gh repo create <owner>/<name> --<visibility> --source . --remote origin`.
2. **Write the config.** Copy `templates/common/.github/jalankan-tiket.json` and fill its placeholders. `${CLAUDE_PLUGIN_ROOT}/templates/README.md` lists every placeholder. `kitVersion` is the `version` in `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json`. The stack values come from the stack profile.
3. **Create the labels.** Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/buat-label.sh`. It creates every configured label that the repository lacks.
4. **Create the first milestone.** Run `gh api repos/<owner>/<name>/milestones -f title=M1`.
5. **Self-hosted runner only.** Choose the ports as described in `${CLAUDE_PLUGIN_ROOT}/skills/siapkan-proyek/RUNNER.md`.

## 4. Write the files

- **Existing project:** follow `${CLAUDE_PLUGIN_ROOT}/skills/siapkan-proyek/EXISTING.md` instead of this step. It writes the same files on a branch and never overwrites the project's own files.
- **New project:** write the files directly in the folder:
1. **Templates.** Copy `templates/<lang>/` and `templates/common/CLAUDE.md` into the project root, and fill every placeholder. Handle `<!-- ui -->` lines as `templates/README.md` describes.
2. **Stack files.** Follow `stacks/<profile>/PROFILE.md`: values, files to copy, ports and CI. For a custom stack, follow `stacks/CONTRACT.md`.
3. **CODEOWNERS.** Run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/buat-codeowners.sh <@owner>`.
4. **Ruleset file, public repositories and paid plans only.** Copy `templates/common/.github/ruleset-main.json` to `.github/ruleset-main.json`.
5. **Permissions, last.** Copy `templates/common/.claude/settings.json` and fill `{{STACK_ALLOW_RULES}}` and `{{LABEL_OWNER_APPROVED}}`.
6. **Check your work.**
   - `grep -rn '{{' --exclude-dir=.git .` must find no unfilled placeholder.
   - `bash ${CLAUDE_PLUGIN_ROOT}/scripts/cek-proyek.sh ${CLAUDE_PLUGIN_ROOT}` must report no FAIL. The one exception is the missing foundation code, which is reported as INFO.

## 5. Commit and push (new project)

Make one commit on `main`. Its message, in the project language, means "Set up the jalankan-tiket kit". Then run `git push -u origin main`.

## 6. Steps the owner takes

Some steps change GitHub settings or need the owner's password. Give the owner each of these as a ready-to-run command.

- **Protect `main`** (when `.github/ruleset-main.json` was written). The owner types this in the Claude Code session:

  ```
  ! gh api -X POST repos/<owner>/<name>/rulesets --input .github/ruleset-main.json
  ```

  A 403 response means the plan has no rulesets. In that case the agent guardrails and CI enforce the rule instead.
- **Self-hosted runner.** Use the steps in `RUNNER.md`.

## 7. Report

Tell the owner, in plain words:
- what was created: the repository link, the labels, milestone M1 and the CI runner;
- the steps from step 6 that are still open;
- the next step: put raw material about the product in `docs/input/`, then run `/tiket:rencanakan-produk`.
