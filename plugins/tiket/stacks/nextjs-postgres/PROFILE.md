# Stack profile: nextjs-postgres

A single Next.js application on PostgreSQL. This is the kit's tested reference profile.

`/tiket:siapkan-proyek` uses this file to fill the stack placeholders of `../../templates/` and to copy the stack's own files. `<lang>` stands for the project language folder, `id` or `en`.

## Placeholder values

| Placeholder | Value |
|---|---|
| `{{VERIFY_COMMAND}}` | `pnpm verify` |
| `{{E2E_COMMAND}}` | `"pnpm test:e2e"` |
| `{{DOMAIN_MODULE_PATH}}` | `src/domain/` |
| `{{COMMANDS_SOURCE}}` | `` `package.json` `` |
| `{{STACK_ALLOW_RULES}}` | `"Bash(pnpm *)", "Bash(docker compose *)"` |
| `{{STACK_STANDARDS}}` | the content of `<lang>/standards.md` |
| `{{ENVIRONMENT}}` | the content of `<lang>/environment.md` |
| `{{PORTS}}` | `{"devPostgres": <n>, "ciPostgres": <n or null>, "ciE2e": <n or null>}` |
| `{{PORT_DEV_POSTGRES}}` | `devPostgres` (see **Ports**) |
| `{{PORT_CI_POSTGRES}}`, `{{PORT_CI_E2E}}` | `ciPostgres` and `ciE2e`. Used only in `ci/self-hosted.yml` |
| `{{PROJECT_SLUG}}` | the repository name, in lowercase kebab-case |

## Files to copy

| From | To |
|---|---|
| `files/scripts/verify.mjs` | `scripts/verify.mjs` |
| `files/.dependency-cruiser.cjs` | `.dependency-cruiser.cjs` |
| `files/docker-compose.yml` | `docker-compose.yml` |
| `files/.env.example` | `.env.example` |
| `files/.env.ci` | `.env.ci` |
| `<lang>/domain-AGENTS.md` | `src/domain/AGENTS.md` |
| `<lang>/adr-0001-stack.md` | `docs/adr/0001-stack.md` |
| `<lang>/dependency-allowlist.txt` | `.github/dependency-allowlist.txt` |
| `ci/github-hosted.yml` or `ci/self-hosted.yml` | `.github/workflows/ci.yml` |

## Ports

Several projects can share one machine, both for development and as a self-hosted CI runner. Each project therefore needs its own ports.

- **`devPostgres`** is the host port for the local PostgreSQL in `docker-compose.yml`.
  - Use 5432 when nothing listens on it (check with `ss -ltn`) and no other project in the registry holds it.
  - Otherwise take the next free port from 55432 upward.
- **`ciPostgres` and `ciE2e`** are needed only for a self-hosted runner. They are the PostgreSQL service port and the end-to-end server port of CI on the runner machine.
  - Pick ports that no other registered project uses: from 55500 for PostgreSQL and from 3500 for end-to-end tests.
  - On GitHub-hosted runners, both stay `null`.
- **The registry** is `${CLAUDE_PLUGIN_DATA}/ports.json`. It is a JSON object keyed by repository (`owner/name`), and each value holds that project's three ports.
  - Read the registry before choosing ports.
  - Write the new project's entry back after choosing.

## Deploy tickets (optional)

`<lang>/ticket-deploy.md` holds two tickets. `/tiket:rencanakan-tahap` creates them only when the owner wants a deploy:
- **Ticket A** is for the owner: the server, the domain and the repository secrets.
- **Ticket B** is for the agent: the Dockerfile, the production compose file, `deploy/deploy.sh`, backups, and the `docs/DEPLOY.md` runbook. It also adds `.github/workflows/deploy.yml`, copied from `${CLAUDE_PLUGIN_ROOT}/ci/deploy-ssh.yml` with `{{DEPLOY_PATH}}` set to the repository's folder on the server (for example `/opt/<slug>/repo`). This is a protected file, so ticket B's PR needs the owner-approved label.

## Foundation ticket

`<lang>/ticket-t00.md` is the body of the first ticket, `[{{TICKET_PREFIX}}00]`. `/tiket:rencanakan-tahap` creates it in the first milestone. The ticket builds the empty application that the copied files expect: `verify.mjs` calls the five scripts that this ticket adds to `package.json`.
