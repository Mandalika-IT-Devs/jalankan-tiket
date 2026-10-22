# Setting up an existing project

An existing project already has its own files, so you add the kit beside them and never overwrite them. All the work happens on the branch `adopsi-jalankan-tiket` and reaches `main` through one PR. That PR changes protected paths, so the owner adds the owner-approved label before it can merge.

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
- Each contract item the project lacks becomes a ticket in milestone M1, before any feature work. Examples: dead-code checks, import boundaries, or a pure domain module. The first of these tickets is `[T00]`.
- List these gaps in your report, so the owner can see them before `/tiket:rencanakan-produk` runs.

## Finish

1. Commit on `adopsi-jalankan-tiket` and push the branch.
2. Open the PR with `gh pr create`. In its description, list:
   - every file created;
   - every file changed, with the reason;
   - the gaps in the verify contract.
3. Ask the owner to add the owner-approved label and to merge the PR. After that, continue with step 6 of `SKILL.md`.
4. The next step after the merge is `/tiket:rencanakan-produk`. It writes the PRD and the glossary from the existing code and from questions to the owner.
