# Security and guardrails

## Permission modes

- **Use Auto mode.** It runs without many confirmations, but Claude Code's classifier still checks every action, and the project's *deny* rules still apply.
- **Do not use Bypass mode**, except on an isolated machine such as a container or a VM. That is also Claude Code's official advice.

## What is guarded, and how

| Guardrail | Enforced by |
|---|---|
| Protected files change only with your approval | The `kebersihan-pr` CI job and the owner-approved label (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones). The file list is read from the target branch. |
| New libraries need approval | CI checks the dependency allowlist |
| `main` changes only through a PR with green CI | The GitHub ruleset (when available), *deny* rules for pushing to `main` and for force-push, and the coordinator's instructions |
| Agents do not change labels or the repo, and do not call the GitHub API | *Deny* rules in `.claude/settings.json` |
| Agents do not touch the approval label | *Deny* rules for every command that names that label |

## Limits you should know about

- **Agents use your own `gh` login.** To GitHub, a label added by an agent is the same as a label added by you. The ban on adding the approval label is enforced by permission rules and instructions, not by GitHub.
- **Permission rules are not bulletproof.** They match the text of a command, so they are not an absolute security boundary. An unusual form of a command can slip through. They guard against mistakes, not against bad intent.
- **CI runs from the PR's content.** For a PR from the same repo, GitHub runs the workflow from that PR's content. A PR that changes the CI workflow could skip its own checks. That is why `.github/` is protected, and why the reviewer flags every change there.

## Secrets

- `.env` is never committed.
- `.env.ci` holds only fake values for tests.
- Deploy secrets are stored as repository *secrets*, and only you set them.
- Real personal data never goes into `docs/input/`, seeds or tests.
