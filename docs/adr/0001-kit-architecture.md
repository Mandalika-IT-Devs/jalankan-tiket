---
status: accepted
date: 2026-10-22
---

# Kit architecture: one plugin, project-owned files, stack profiles

The `/jalankan-tiket` workflow grew inside two of the owner's projects as files copied into each repository. The copies had three problems:
- they drifted apart;
- they mixed generic rules with project rules;
- nobody outside those projects could set the workflow up.

This kit replaces the copies with one installable source.

## Decision

Three layers, each with a single owner:

1. **Plugin `tiket`** lives in this repo at `plugins/tiket/` and holds the generic workflow:
   - the skills and the `pelaksana` and `peninjau` subagents;
   - project templates, stack profiles, CI files and scripts.

   Users install it once and receive updates by version.
2. **Project files** are written into each project by `/tiket:siapkan-proyek`, and are owned and protected by that project:
   - PRD, GLOSSARY, ADRs, OPEN-DECISIONS, UAT, golden fixtures and DESIGN;
   - `AGENTS.md` and `CODING_STANDARDS.md`;
   - `.github/` and `.claude/settings.json`.

   Every project-specific rule lives here. That includes the reviewer's project checklist, which is a section of `CODING_STANDARDS.md`.
3. **Stack profiles** live in `plugins/tiket/stacks/`. A profile supplies the toolchain behind the workflow's contract:
   - one `verify` command;
   - a dependency allowlist;
   - a pure domain module with enforced import rules;
   - golden fixtures;
   - the CI jobs `kebersihan-pr` and `verify`;
   - Docker Compose and a `.env.ci` without secrets.

   v1 ships one tested profile, Next.js with PostgreSQL. Projects on other stacks go through a guided adaptation that produces ADR-0001 and an equivalent for each contract item.

The commands are plugin skills, invoked as `/tiket:<skill>`:
- `siapkan-proyek`
- `rencanakan-produk`
- `rencanakan-tahap`
- `jalankan`
- `catat-keputusan`
- `cek-proyek`

### Choices made with the owner on 2026-10-22

- **Names.** The plugin is named `tiket`. The repository and the marketplace are both named `jalankan-tiket`.
- **Language of agent instructions.** Instructions for agents are written in English. Everything written for a project owner uses the project's language: questions, issue comments and PRs.
- **Templates and guide in two languages.** Project templates exist in Indonesian and English, and the language is chosen at setup. The user guide is written in both languages.
- **One stack profile in v1.** Projects on other stacks follow the adaptation guide instead.
- **CI on GitHub Actions only.** Runners can be GitHub-hosted or self-hosted. The reason is that the coordinator depends on `gh`.
- **Deploy template.** v1 includes an optional template that deploys to a VPS over SSH.
- **How tickets are created.** `/tiket:rencanakan-tahap` creates tickets with a textual "Blocked by" section, and the coordinator reads that section. We do not use `/to-tickets` from mattpocock-skills 1.3, for two reasons:
  - it sets native GitHub dependencies and drops the textual section;
  - reading native dependencies needs `gh api`, and agents are denied `gh api`.
- **Private until v1.0.** The repository stays private during development and becomes public at v1.0, after a privacy review.
- **Validation before v1.0.** Two runs must succeed:
  - a small project built from scratch with the kit;
  - an existing project moved onto the kit.
- **License.** MIT, with attribution to mattpocock/skills for derived templates.

### Technical choices

- **Plugin location.** The plugin lives in `plugins/tiket/`, not at the repo root. That way the guide and the repo's own `AGENTS.md` are not shipped to users, and Claude Code does not warn about a root `CLAUDE.md`.
- **Protected paths.** Each project lists its protected paths once, in `.github/protected-paths.txt`. CI and `AGENTS.md` read that file, and CODEOWNERS is generated from it.
- **Guardrails.** Agent guardrails are permission rules in the project's `.claude/settings.json`, because plugins cannot ship permissions. v1 has no hooks, because plugin hooks run in every project where the plugin is enabled.
- **Matt's skills work without a second setup.** `/tiket:siapkan-proyek` writes the same configuration as `setup-matt-pocock-skills`: the `docs/agents/*.md` files, the triage labels and the `## Agent skills` block.
- **Grilling.** `/tiket:rencanakan-produk` calls the model-invoked `grilling` and `domain-modeling` skills directly. That is all `grill-with-docs` 1.3.1 does, and one skill cannot call a user-invoked skill.
- **Glossary.** The glossary file is `GLOSSARY.md`, following the convention of mattpocock-skills 1.3.
- **Milestones and `main`.** Milestones are GitHub Milestones. Where GitHub offers rulesets (public repositories or paid plans), a ruleset protects `main`. Elsewhere, the agent guardrails and CI enforce the same rule.
- **Dependency on mattpocock-skills.** The plugin declares `mattpocock-skills@claude-plugins-official` without a version range. Version ranges need `<plugin>--v<version>` tags, and Matt's repository does not create them. Instead, `/tiket:cek-proyek` warns when the installed version is outside the tested range.
- **Releases.** Each release sets its version in `plugin.json` and is tagged `tiket--v<version>`. Users move to a new version only when a release is published.

## Consequences

- A fix to the workflow is made once and reaches every project on its next update. Projects keep only their own rules.
- Plugin commands carry the `tiket:` prefix. How to type them in the Claude Desktop Code tab is not documented, so that is tested first.
- Templates and the guide exist in two languages and must change together.
- A project that still carries a copied workflow keeps that copy until it is migrated.
