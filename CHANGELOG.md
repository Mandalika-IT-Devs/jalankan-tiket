# Changelog

All notable changes to the `tiket` plugin. Versions follow `plugins/tiket/.claude-plugin/plugin.json`. Changes to files the kit writes into projects also get a section in `plugins/tiket/MIGRATIONS.md`.

## 1.0.0

First public release. The workflow is validated end to end on a new project (setup, product and milestone planning, automatic tickets, a parked ticket and its decision, a kit migration) and on an existing project that already ran an earlier copy of the workflow (adoption and a kit migration). Self-hosted runners are not validated through the kit yet; `docs/en/versions.md` lists the validated paths.

## 0.1.12 (unreleased)

- After adopting a project whose PRD already describes the product, the kit no longer names planning a new milestone as the next step. The adoption is complete; `/tiket:rencanakan-tahap` is for when the owner has new work.
- `/tiket:cek-proyek` names parked questions and ready tickets before "plan a milestone", and its last row says that nothing is due. Before, an open milestone with every ticket closed never reached its own row.

## 0.1.11 (unreleased)

More findings from the same adoption:

- In Auto mode, merging the kit's rules into an existing `.claude/settings.json` is refused as self-modification. `EXISTING.md` now prepares the merged file elsewhere, shows the owner the difference, and writes it after the owner agrees, which is what the session did on its own.
- Worktrees that Claude Code creates in `.claude/worktrees/` made lint red. The `nextjs-postgres` `.gitignore` and the foundation ticket keep that folder out of the checks, and migration 0.1.11 does the same for existing projects.

## 0.1.10 (unreleased)

Finding from adopting the kit in a real project that already ran an earlier copy of the workflow (adoption merged, CI and deploy green):

- The session wrote 13 one-line status updates in English during long file work, in an Indonesian project. Every skill now names those updates explicitly, with an example in the project language, and project `AGENTS.md` gets a language section that stays loaded in every session, also after a conversation is compacted. Migration 0.1.10 adds that section to existing projects.

## 0.1.9 (unreleased)

- Adopting an existing project starts the branch from the latest `origin/main`, and works around commands that the project's own permission rules deny.

## 0.1.8 (unreleased)

Preparing the adoption of a project that already runs an earlier copy of this workflow:

- `/tiket:siapkan-proyek` detects an earlier copy (a coordinator skill, agents, CI jobs `kebersihan-pr` and `verify`) and, for an existing project, the labels, milestones, highest ticket number and ruleset.
- `EXISTING.md` gains a section for that case: project rules move into the project's files before the old copy is deleted, same-role files get the kit's names, existing CI jobs are updated in place, protected paths move to `.github/protected-paths.txt`, milestones kept as labels continue as GitHub milestones, ticket numbers continue, and the existing PRD leads to `/tiket:rencanakan-tahap`.
- Setup skips the `M1` milestone when the project already has milestones, and gives the owner the command when the project's own permission rules deny it.
- In an existing project, a kit ADR is skipped when the project already records that decision, and otherwise takes the next free ADR number. `/tiket:cek-proyek` accepts any `docs/adr/0001-*.md`.

## 0.1.7 (unreleased)

Findings from validating `/tiket:catat-keputusan` (five questions from three issues, two answers that differ from the recommendation):

- `/tiket:catat-keputusan` opens the decision issue first. Parked tickets and follow-up tickets list it under "Blocked by", so `/tiket:jalankan` waits until the decision PR has merged. Before, only an instruction held the order.
- Golden cases that change what merged code computes go into a new file that no test reads yet. In an existing file they turn the decision PR red, and it can never merge before its own follow-up ticket.
- When the owner has not answered yet, the skill presents the questions in the owner-question format and waits. It also accepts an answer in the owner's own words, such as an option with a change.
- Decisions also update `GLOSSARY.md` for a new term and `docs/UAT.md` for new behaviour. Source issues are commented after the PR exists, so the comment links it.
- A PR for protected files adds `-2`, `-3` to a branch name that is already taken, for example a second decision PR on the same day.

Findings from validating `/tiket:cek-proyek` and the first migration (0.1.0 → 0.1.6 on the sample project, local end-to-end tests now on the project's own `app_test`):

- `/tiket:cek-proyek` names an open owner PR (plan, decision or kit) as the next step, before `/tiket:jalankan`.
- The 0.1.6 migration replaces the old CI line in `AGENTS.md` instead of adding a second one.
- A PR for protected files waits for CI with `gh pr checks <pr> --watch` before the merge. Without that step, a session stopped after the owner's approval and waited for another message.

Findings from running `/tiket:jalankan #12` (the parked ticket, after its decision) on the sample project:

- The scope argument works: the follow-up ticket that came first on the frontier stayed untouched.
- The implementer has a third kind of ambiguity: a cheap detail that a decided behaviour leaves open. It picks the option closest to the PRD and DESIGN, marks it `Owner check:`, and the coordinator asks it as a non-blocking question instead of parking the ticket.
- The coordinator titles PRs `<ticket id>: <summary>`, as `docs/agents/issue-tracker.md` already says.

## 0.1.6 (unreleased)

Findings from validating `/tiket:jalankan` on the sample project (four tickets merged, one parked):

- Skills, the reviewer and `docs/agents/issue-tracker.md` read issues with `gh issue view <n> --json title,body,comments`. With `--comments` alone, `gh` prints the comments without the ticket body.
- `nextjs-postgres`: `.env.ci` points at the project's own local PostgreSQL port, database `app_test`, created by `scripts/postgres-init.sql` on the first `docker compose up`. Before, local end-to-end tests went to whatever listened on port 5432, which can be another project's PostgreSQL. Both CI templates rewrite the port to their own PostgreSQL service.
- `/tiket:jalankan` takes optional issue numbers or a milestone after the command to limit the run, and recognises follow-up tickets `[T04-b]`.
- `/tiket:jalankan` states that waiting on `gh pr checks --watch` is part of the run, also where the app offers its own CI monitoring.
- The leftover-placeholder check in `/tiket:siapkan-proyek` and the kit's own parity check also match placeholders with digits, such as `{{PORT_CI_E2E}}`.
- First entry in `MIGRATIONS.md` (0.1.6), so `/tiket:cek-proyek` updates existing projects.

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
