# Changelog

All notable changes to the `tiket` plugin. Versions follow `plugins/tiket/.claude-plugin/plugin.json`. Changes to files the kit writes into projects also get a section in `plugins/tiket/MIGRATIONS.md`.

## 0.1.5 (unreleased)

- The `nextjs-postgres` profile takes the Node.js version from the owner's machine (the installed LTS, 22 or later) instead of fixing Node.js 24. CI, ADR-0001 and the implementer then run the same version. The foundation ticket points to ADR-0001 for the version.

## 0.1.4 (unreleased)

- Every skill now names short status lines, such as "what I read, what comes next", as part of the project language. Validating `/tiket:rencanakan-tahap` showed a status line in English followed by questions in Indonesian.

## 0.1.3 (unreleased)

Findings from validating `/tiket:rencanakan-produk`:

- PRs that change protected files without coming from a ticket (planning, decisions, adoption, kit migrations) now open an issue first, so CI's `Closes #n` check passes. The steps live in one place, `reference/owner-pr.md`, which also gives these PRs their own body shape instead of the ticket template.
- `/tiket:rencanakan-produk` records a question found while writing as an open decision, and names it in the PR and the report.
- `kitVersion` is documented as changing only through migrations.

## 0.1.2 (unreleased)

Findings from the first validation run (setting up a new public project):

- Skills tell Claude the plugin root and data folder. Supporting files (`RUNNER.md`, `PROFILE.md`, `EXISTING.md`) are read without path substitution, so they now point to the paths given in the skill.
- Port choice counts every port in use: listening services, Docker containers (also stopped ones), other projects in the same parent folder, and the registry. Searches start at 56432 for development and 56500 and 3500 for CI, away from hand-picked ports.
- The leftover-placeholder check matches only kit placeholders, not GitHub Actions `${{ }}` expressions.
- Setup asks for a git identity when the machine has none, and sets it for the project only.
- Setup no longer tries to read the owner's GitHub plan. It always writes the ruleset file, and the owner's command shows whether the plan supports it.
- `/tiket:cek-proyek` warns about the kit version only when `MIGRATIONS.md` lists project-file changes after the project's `kitVersion`.

## 0.1.1 (unreleased)

- Talk to the owner in one language only. Before the project language is chosen, `/tiket:siapkan-proyek` uses the language the owner writes in, or the system locale (`$LANG`). It no longer writes its first questions in two languages.
- `/tiket:siapkan-proyek` connects a GitHub repository the owner already created, when it is empty or holds only a README or license.

## 0.1.0 (unreleased)

First version, extracted from the workflow two projects used before.

- `/tiket:jalankan`: the coordinator, with the `tiket:pelaksana` and `tiket:peninjau` subagents.
- `/tiket:siapkan-proyek` for new and existing projects, and `/tiket:cek-proyek`.
- `/tiket:rencanakan-produk`, `/tiket:rencanakan-tahap` and `/tiket:catat-keputusan`.
- Project templates in Indonesian and English.
- The tested `nextjs-postgres` stack profile, with CI for GitHub-hosted and self-hosted runners and optional SSH deploy.
- Depends on mattpocock-skills from `claude-plugins-official`. Tested with 1.3.1.
