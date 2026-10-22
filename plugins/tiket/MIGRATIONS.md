# Migrations for project files

Some releases change files that the kit writes into projects: templates, CI, settings or scripts. Each such release adds a section here. `/tiket:cek-proyek` applies every section newer than the project's `kitVersion` on one branch, `kit-v<newest version>`, in one PR for the owner.

Format of a section:

```
## <version>

- **<file>**: what changes, and how to apply it to a project that may have edited the file.
- Last step: set `kitVersion` in `.github/jalankan-tiket.json` to `<version>`.
```

Paths such as `stacks/…` are relative to the plugin folder.

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
