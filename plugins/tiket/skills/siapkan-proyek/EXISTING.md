# Setting up an existing project

An existing project already has its own files, so you add the kit beside them and never overwrite them. All the work happens on the branch `adopsi-jalankan-tiket` and reaches `main` through one PR. That PR changes protected paths, so the owner adds the owner-approved label before it can merge.

- **Start from the latest `main`.** Run `git fetch origin`, then `git switch -c adopsi-jalankan-tiket origin/main`. A local `main` may be behind GitHub.
- **The project's own permission rules may deny a command this setup uses**, such as `gh api` or `gh label`. Read the same facts with another command, for example the labels on issues through `gh issue list --json labels`, or give the owner the command to type with `!`.

## An earlier copy of this workflow

Some projects already run their own copy of this workflow: a coordinator skill in `.claude/skills/`, implementer and reviewer agents in `.claude/agents/`, and CI jobs named `kebersihan-pr` and `verify`. The plugin replaces that copy. On top of the rest of this file:

- **Project rules move, then the copy goes.** Read the old skill and agents. Move every rule that belongs to this project into the project's files: items the reviewer checks go to the review checklist of `CODING_STANDARDS.md`, other rules go to `AGENTS.md`. Then delete the old skill and agents in the adoption PR. One coordinator runs in a repository, and from now on it is `/tiket:jalankan`.
- **Same role, other name.** A project file that plays the role of a kit file under another name, such as `tiket.md` for `.github/ISSUE_TEMPLATE/ticket.md` or `PANDUAN.md` for `docs/GUIDE.md`, gets the kit's name with `git mv`. Update every reference to it. Skills, agents and `/tiket:cek-proyek` look for the kit's names.
- **CI jobs that already exist.** Update the project's `kebersihan-pr` and `verify` jobs in place, instead of adding `jalankan-tiket.yml`. Bring in each kit step the project's job lacks, such as reading the protected paths and the label name from the base branch, and keep the project's own steps.
- **Protected paths.** When the workflow file holds the list of protected paths, move the list to `.github/protected-paths.txt`, one path per line, and let the job read that file.
- **Labels and milestones.** Name the project's existing labels under `labels` in `.github/jalankan-tiket.json`. When the project tracks milestones as labels, such as `M3`, the next milestone becomes a GitHub milestone that continues the count, such as `M4`. `/tiket:rencanakan-tahap` creates it when it publishes the tickets.
- **Ticket numbers** continue after the highest number in use.
- **Planning documents.** Keep the existing PRD, open decisions, UAT, design and ADRs.
- **A ruleset that already protects `main`.** Compare its required checks with `kebersihan-pr` and `verify`. Give the owner a command only for a difference.

## Files

Go through every file that `SKILL.md` step 4 would write:

- **Absent:** create it from the template, exactly as for a new project.
- **Present and owned by the kit** (`.github/ISSUE_TEMPLATE/ticket.md`, `.github/pull_request_template.md`, `.github/protected-paths.txt`, `docs/agents/*.md`): keep the project's version. Add only the parts the kit needs. Write each addition into the PR description.
- **`AGENTS.md` or `CLAUDE.md` present:** keep the project's text. Add any of these sections that is missing:
  - the sources of truth;
  - how the automatic workflow runs;
  - the scope guardrails;
  - the protected-files pointer;
  - the `## Agent skills` block.

  When only `CLAUDE.md` exists, add the sections there instead of creating `AGENTS.md`.
- **ADRs:** skip a kit ADR whose decision the project already records in an ADR of its own, such as its stack. Any other kit ADR takes the next free ADR number.
- **`CONTEXT.md` present:** rename it with `git mv CONTEXT.md GLOSSARY.md`, then update every reference to it. mattpocock-skills 1.3 and later reads only `GLOSSARY.md`.
- **`.claude/settings.json` present:** merge the template into it with `jq`:
  - add the missing allow and deny rules;
  - add the `jalankan-tiket` marketplace and `enabledPlugins`.

  Keep every rule the project already has.

## CI

- **No CI yet:** copy the stack's workflow, as for a new project.
- **CI already exists:** add `.github/workflows/jalankan-tiket.yml`. It holds the `kebersihan-pr` job, copied from the stack's workflow. The coordinator also needs a job named `verify` that runs `verifyCommand`. Ask the owner, in the owner question format, which way to get it:
  - (a) rename the existing test job to `verify` and make it run `verifyCommand` (recommended);
  - (b) add a separate `verify` job to `jalankan-tiket.yml`.

## The verify contract

Compare the project's tools with `${CLAUDE_PLUGIN_ROOT}/stacks/CONTRACT.md`.
- Use the closest existing command as `verifyCommand`.
- Each contract item the project lacks becomes a ticket in milestone M1, before any feature work. Examples: dead-code checks, import boundaries, or a pure domain module. The first of these tickets is `[T00]`, or the next free number when the project already has tickets.
- List these gaps in your report, so the owner can see them before `/tiket:rencanakan-produk` runs.

## Finish

1. Follow the steps in `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md` to open the PR.
   - The issue is titled `[Kit] Adopsi jalankan-tiket` (`[Kit] Adopt jalankan-tiket` in English projects).
   - The branch is `adopsi-jalankan-tiket`.
2. In the PR description, list:
   - every file created;
   - every file changed, with the reason;
   - the gaps in the verify contract.
3. Once the PR is merged, continue with step 6 of `SKILL.md`.
4. The next step after the merge is `/tiket:rencanakan-produk`. It writes the PRD and the glossary from the existing code and from questions to the owner. When the project's PRD already describes the product, the next step is `/tiket:rencanakan-tahap` instead.
