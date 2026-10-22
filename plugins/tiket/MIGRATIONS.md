# Migrations for project files

Some releases change files that the kit writes into projects: templates, CI, settings or scripts. Each such release adds a section here. `/tiket:cek-proyek` applies every section newer than the project's `kitVersion` on one branch, `kit-v<newest version>`, in one PR for the owner.

Format of a section:

```
## <version>

- **<file>**: what changes, and how to apply it to a project that may have edited the file.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `<version>`.
```

Paths such as `stacks/…` are relative to the plugin folder.

## 1.0.1

- **`AGENTS.md`** (or `CLAUDE.md` when the project keeps its rules there): in the section on the automatic workflow, add the paragraph about requests in a plain conversation from `templates/<language>/AGENTS.md`, unless the file already says it.
- **`docs/GUIDE.md`**: take the new wording of the `/tiket:rencanakan-tahap` line, the closed-milestone line and the UAT findings line from `templates/<language>/docs/GUIDE.md`. Keep the project's other text.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `1.0.1`.

## 0.1.11

- **Projects on the `nextjs-postgres` stack only.** Claude Code may create worktrees in `.claude/worktrees/`, and their files must stay out of the project's checks.
  - **`.gitignore`**: add `.claude/worktrees/`.
  - When `pnpm verify` would read files under `.claude/worktrees/`, add that folder to the ignore lists of ESLint, Vitest and knip.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `0.1.11`.

## 0.1.10

- **`AGENTS.md`** (or `CLAUDE.md` when the project keeps its rules there): add the language section of `templates/<language>/AGENTS.md` right after the summary, unless the file already states that every message to the owner, status lines included, uses the project language.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `0.1.10`.

## 0.1.6

- **`docs/agents/issue-tracker.md`**: replace every `gh issue view <n> --comments` with `gh issue view <n> --json title,body,comments`. With `--comments` alone, `gh` prints the comments without the ticket body. Keep the rest of the file.
- **Projects on the `nextjs-postgres` stack only.** Tests on the owner's machine now use this project's own PostgreSQL instead of whatever listens on port 5432.
  - **`.env.ci`**: in `DATABASE_URL`, set the port to `ports.devPostgres` from `.github/jalankan-tiket.json`. Keep the database name. Take the comment lines from `stacks/nextjs-postgres/files/.env.ci`.
  - **`scripts/postgres-init.sql`**: copy it from `stacks/nextjs-postgres/files/scripts/postgres-init.sql`.
  - **`docker-compose.yml`**: mount that file in the postgres service, as `stacks/nextjs-postgres/files/docker-compose.yml` does.
  - **`.github/workflows/ci.yml`**: in the step that loads `.env.ci`, rewrite the port before loading, as `stacks/nextjs-postgres/ci/<runner>.yml` does. `<runner>` is the `runner` value in the config.
  - **`AGENTS.md`**: in the environment section, replace the CI line and add the test line, both from `stacks/nextjs-postgres/<language>/environment.md`, with the port filled in.
  - **On this machine:** an existing PostgreSQL volume never runs the init script. Create the test database once with `docker compose exec postgres createdb -U app app_test`, unless it already exists. Write in the PR body that every other machine with an existing volume needs the same command.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `0.1.6`.
