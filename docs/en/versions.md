# Tested versions

| Component | Version |
|---|---|
| Kit (the `tiket` plugin) | 1.0.0 |
| Claude Code | 2.1.299 |
| mattpocock-skills | 1.3.1 |
| GitHub Actions | `actions/checkout@v7`, `actions/setup-node@v7`, `pnpm/action-setup@v6` |
| The `nextjs-postgres` profile | Node.js 22 or 24 (the installed LTS), PostgreSQL 17 |

## Validated paths

| Path | Status |
|---|---|
| New project, GitHub runner | Validated from setup to merged tickets, including parked tickets and owner decisions |
| Existing project that already used an old copy of this workflow, GitHub runner | Validated from adoption to a kit version update |
| Your own runner (self-hosted) | Not yet validated through the kit |
| Agent account and pace (1.1.0) | Not yet validated through the kit |
| Stacks other than `nextjs-postgres` | Through [Adapting your stack](adapting-your-stack.md), no tested profile yet |

The tested versions of mattpocock-skills are also recorded in `plugins/tiket/reference/tested-versions.json`. `/tiket:cek-proyek` reads that file.
