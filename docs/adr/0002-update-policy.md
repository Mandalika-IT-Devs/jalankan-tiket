---
status: accepted
date: 2026-10-22
---

# Update policy: mattpocock-skills, the plugin, and project files

The owner wants both the kit and mattpocock-skills to update automatically. Three layers update in different ways, and only two of them may update without the owner.

## Decision

**mattpocock-skills updates through Anthropic's official marketplace.**
- The plugin declares the dependency without a version range. The reason is in ADR-0001: Matt's `v<version>` tags do not satisfy Claude Code's `<plugin>--v<version>` format, so a range would fail to install.
- `claude-plugins-official` auto-updates by default, so users receive Matt's releases once Anthropic moves its pin.

**The `tiket` plugin updates by release.**
- Each release bumps `version` in `plugin.json` and gets a `tiket--v<version>` tag. Users never receive a half-finished commit.
- Third-party marketplaces do not auto-update by default. To turn it on, `/tiket:siapkan-proyek` writes two entries into the project's `.claude/settings.json`:
  - `extraKnownMarketplaces.jalankan-tiket`, with `autoUpdate: true`;
  - `enabledPlugins["tiket@jalankan-tiket"]`.

  Everyone who opens the project, including a new teammate, then gets the kit and its updates without installing it.
- The guide also tells manual installers how to switch on auto-update in `/plugin` → Marketplaces.

**Project files change only through a PR the owner approves.**
- These are files such as `AGENTS.md`, `.github/` and the templates.
- `/tiket:cek-proyek` compares `kitVersion` in `.github/jalankan-tiket.json` with the installed plugin. When the templates changed, it prepares a PR that needs the `ownerApproved` label.

**Breaking changes in mattpocock-skills are caught early.** The kit depends on Matt only through a short list of **coupling points**:
- the skills `grilling`, `domain-modeling` and `tdd`;
- the file `GLOSSARY.md`;
- the format of `docs/agents/*.md`;
- the triage labels.

Three safeguards watch those points:
1. **A watcher.** A scheduled GitHub Action in this repo checks Matt's GitHub releases daily. On a new release it opens an issue with the changelog and the coupling points to test. The official marketplace lags Matt's releases by days, which leaves time to release a compatible kit first.
2. **Version warnings.** `/tiket:cek-proyek` warns when the installed mattpocock-skills version is newer than the versions tested.
3. **The coordinator's coupling check.** `/tiket:jalankan` checks the coupling points before its first round. When a point breaks, it stops and reports instead of guessing.

## Consequences

- Users may run a Matt release the kit has not tested yet. The coupling checks turn a silent breakage into a clear stop.
- Every Matt release costs one compatibility check in this repo.
- A project's kit-made files lag the plugin until the owner merges the update PR. That is the price of keeping those files under the owner's control.
