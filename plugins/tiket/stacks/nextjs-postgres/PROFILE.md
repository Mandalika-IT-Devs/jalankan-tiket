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
| `{{NODE_MAJOR}}` | the major version of the Node.js on the owner's machine (`node --version`) when it is a maintained LTS, 22 or later. When Node.js is missing or older, give the owner the install steps for Node.js 24 LTS and use 24. CI and the implementer then run the same version as the owner's machine. |

## Files to copy

| From | To |
|---|---|
| `files/.gitignore` | `.gitignore`. In an existing project, add the missing lines instead. |
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

A port counts as **used** when any of these holds:
- something listens on it now (`ss -ltn`);
- a Docker container publishes it, including a stopped container. Check `docker ps -aq | xargs -r docker inspect --format '{{json .HostConfig.PortBindings}}'`;
- the `docker-compose.yml`, `.env*` or `.github/workflows/*.yml` files of the other projects in the same parent folder mention it;
- the registry lists it.

Projects set up before the kit existed are missing from the registry, so check all four sources.

- **`devPostgres`** is the host port for the local PostgreSQL in `docker-compose.yml`. Use 5432 when it is not used. Otherwise take the first unused port from 56432 upward.
- **`ciPostgres` and `ciE2e`** are needed only for a self-hosted runner. They are the PostgreSQL service port and the end-to-end server port of CI on the runner machine.
  - `ciPostgres` takes the first unused port from 56500 upward.
  - `ciE2e` takes the first unused port from 3500 upward.
  - On GitHub-hosted runners, both stay `null`.
- **The registry** is `${CLAUDE_PLUGIN_DATA}/ports.json`. It is a JSON object keyed by repository (`owner/name`), and each value holds that project's three ports.
  - Read the registry before choosing ports.
  - Write the new project's entry back after choosing.

## Deploy tickets (optional)

`<lang>/ticket-deploy.md` holds two tickets. `/tiket:rencanakan-tahap` creates them only when the owner wants a deploy:
- **Ticket A** is for the owner: the server, the domain and the repository secrets.
- **Ticket B** is for the agent: the Dockerfile, the production compose file, `deploy/deploy.sh`, backups, and the `docs/DEPLOY.md` runbook. It also adds `.github/workflows/deploy.yml`.
  - The implementer cannot read the plugin's folder. So put the content of `${CLAUDE_PLUGIN_ROOT}/ci/deploy-ssh.yml` in ticket B's body, as a code block.
  - Set `{{DEPLOY_PATH}}` to the repository's folder on the server, for example `/opt/<slug>/repo`.
  - Write in the body that the owner explicitly instructs adding this protected file. Its PR then needs the owner-approved label.

## Foundation ticket

`<lang>/ticket-t00.md` is the body of the first ticket, `[{{TICKET_PREFIX}}00]`. `/tiket:rencanakan-tahap` creates it in the first milestone. The ticket builds the empty application that the copied files expect: `verify.mjs` calls the five scripts that this ticket adds to `package.json`.
