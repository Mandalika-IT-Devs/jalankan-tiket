# AGENTS.md: jalankan-tiket kit

This repository is a Claude Code marketplace, `jalankan-tiket`, that ships two plugins. `tiket` runs an autonomous workflow driven by GitHub tickets. Claude first plans the product with its owner through a grilling session. After that, Claude works each ticket with an implementer subagent and a reviewer subagent, opens a pull request, waits for CI and merges. The owner is only needed when a business decision comes up.

`qa` is for a QA engineer who tests web apps built by other teams, in repositories that do not use the kit. It keeps a private QA workspace, audits readiness, and tests from the outside against staging, with bugs on Trello and reports in Google Docs. It never changes the product's repository. ADR-0004 records its design.

## Layout

- `.claude-plugin/marketplace.json`: the marketplace. It lists the `tiket` and `qa` plugins and allows `tiket`'s dependency on the `claude-plugins-official` marketplace.
- `plugins/tiket/`: the plugin root. Everything a user's Claude Code loads lives here: `skills/`, `agents/`, and the templates, stack profiles, CI files and scripts that the skills copy into a project.
- `plugins/qa/`: the qa plugin root, with its own `skills/`, `reference/`, `templates/` and `scripts/`. A plugin cannot read another plugin's files, so `qa` keeps its own reference even where it resembles `tiket`'s.
- `plugins/tiket/reference/`: reference that more than one skill or agent needs, such as the project config keys, the format of questions for the owner, and the steps for a PR that changes protected files. Skills point to these files through `${CLAUDE_PLUGIN_ROOT}/reference/...`. User-invoked skills cannot call each other, so shared reference lives here and not inside a skill.
- `docs/id/` and `docs/en/`: the user guide, in Indonesian and English.
- `docs/adr/`: decisions about the kit itself. Read ADR-0001 first.

## Rules

- **The kit is generic.** Never copy business rules, data, people, hostnames or ports from the projects this workflow came from, or from any other real project. Examples use a fictional domain.
- **Language.** Agent-facing text is written in English: skills, agents, ADRs and this file. Text that the workflow writes for a project owner uses the language chosen for that project at setup.
- **Guide in two languages.** The user guide exists twice, in `docs/id/` and `docs/en/`, with the same pages and the same facts. Change both in the same commit.
- **Templates in two languages.** Templates exist twice, in `plugins/<plugin>/templates/id/` and `plugins/<plugin>/templates/en/`. Change both in the same commit.
- **Project rules stay in the project.** A project's own rules, such as business terms or items on the review checklist, belong in that project's files. They never go into a skill or agent here.
- **Validate manifests.** Before committing a manifest change, run `claude plugin validate .` from the repo root, `claude plugin validate plugins/tiket` and `claude plugin validate plugins/qa`.
- **Check consistency.** Run `bash tools/periksa-kit.sh` before committing. CI runs it too.
- **Dependency.** The `tiket` plugin depends on `mattpocock-skills` from `claude-plugins-official`. The kit is tested with mattpocock-skills 1.3.1 and Claude Code 2.1.299. When you test a newer release, update both numbers.
- **Release steps.** Each plugin is released on its own.
  1. Bump `version` in `plugins/<plugin>/.claude-plugin/plugin.json`.
  2. Add an entry to the plugin's changelog: `CHANGELOG.md` for `tiket`, `plugins/qa/CHANGELOG.md` for `qa`.
  3. Tag the release with `claude plugin tag`. Tags look like `tiket--v1.0.0` and `qa--v0.1.0`.
