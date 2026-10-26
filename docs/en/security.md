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
| Agents do not write through your account | A check of the `gh` account and the remote before the first write, and *deny* rules for `gh auth`. See [Agent account](agent-account.md). |
| Agents do not flood GitHub | One coordinator per agent account, pauses between writes, and a stop when GitHub sets a limit |

## Limits you should know about

- **The agent account has Write access.** Technically it can add the approval label. The ban is enforced by permission rules and instructions, not by GitHub.
- **Permission rules are not bulletproof.** They match the text of a command, so they are not an absolute security boundary. An unusual form of a command can slip through. They guard against mistakes, not against bad intent.
- **CI runs from the PR's content.** For a PR from the same repo, GitHub runs the workflow from that PR's content. A PR that changes the CI workflow could skip its own checks. That is why `.github/` is protected, and why the reviewer flags every change there.

## Library vulnerabilities

- **Dependabot alerts.** At the end of `/tiket:siapkan-proyek`, Claude gives you one command that turns them on. GitHub then emails you when a library of the project gets a new advisory.
- **`/tiket:cek-proyek`** runs `pnpm audit` or `npm audit`, and reports a FAIL for high or critical advisories. It also warns when Dependabot alerts are still off.
- **The fix goes through a ticket.** Type `/tiket:rencanakan-tahap` followed by the libraries and the versions that close the advisories, then `/tiket:jalankan`.
- **Dependabot's automatic PRs stay off.** They skip the ticket flow and carry no `Closes #n`, so CI rejects them.

## Secrets

- `.env` is never committed.
- `.env.ci` holds only fake values for tests.
- Deploy secrets are stored as repository *secrets*, and only you set them.
- Real personal data never goes into `docs/input/`, seeds or tests.
