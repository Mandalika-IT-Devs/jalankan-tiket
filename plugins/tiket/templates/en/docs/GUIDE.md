# Product Owner Guide

You are the product owner. Claude Code works on, reviews and merges the tickets by itself, through the `tiket` plugin. You have four tasks:
- plan the product and each milestone;
- answer business questions when a ticket is parked;
- add the label `{{LABEL_OWNER_APPROVED}}` to PRs that change protected files;
- run UAT.

## The one-coordinator rule

Only one person may run `/tiket:jalankan` in this repo at a time. If two coordinators run at the same time, both take the same ticket and overwrite each other's work on `main`.

## Running tickets

1. Prepare your laptop:
   - start Docker, if this project uses it;
   - plug the laptop into power;
   - turn off automatic sleep.
2. Open a Claude Code session in the repo folder, then choose the **Auto** permission mode.
3. Type `/tiket:jalankan`, then let it run. Each round works on one ticket: implementer → reviewer → PR → CI → merge.

If the session is interrupted, for example because the quota runs out or the laptop shuts down, open a new session and type `/tiket:jalankan` again. The work continues from the last state on GitHub.

## When the coordinator stops with a final report

- **Some tickets are parked.** The report holds numbered questions, and each question has one recommended option.
  1. Run `/tiket:catat-keputusan`.
  2. Answer, for example "agree to all" or "agree to all except 2: pick c".
  3. Run `/tiket:jalankan` again.
- **Your decision changes a protected file**, for example the PRD. Its PR needs the label `{{LABEL_OWNER_APPROVED}}`, and you add that label yourself on GitHub.
- **Every ticket in this milestone is closed.** Run UAT. The next milestone is planned when there is new work.

## Planning

Two sessions need you to answer questions actively:
- `/tiket:rencanakan-produk`: once at the start of the project, or when the product changes a lot. This session writes the PRD, the glossary, the ADRs, the open decisions, the UAT scenarios and the calculation examples, from the material in `docs/input/`.
- `/tiket:rencanakan-tahap`: once per milestone, and also when you want to add or change a feature. Write the request after the command, for example `/tiket:rencanakan-tahap add a PDF export of the report`. This session writes the feature's rules into the PRD through a PR, asks about the decisions it needs, then creates the tickets in that milestone.

After a milestone is finished, run `/retro` from mattpocock-skills. This command improves the rules and CI, based on what happened in that milestone.

## Checking the project's health

`/tiket:cek-proyek` checks the kit files, labels, milestones, CI and the plugin version, then names the next step. Run it whenever you are unsure.

## UAT

When the UAT package ticket is done, follow `docs/UAT.md`. Report each finding with `/tiket:rencanakan-tahap` followed by its description.
