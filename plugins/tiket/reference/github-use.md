# Using GitHub as the agent

Every tiket skill and agent that writes to GitHub follows these rules. A write is anything that creates or changes something on GitHub:
- creating or editing an issue, a comment, a PR or a milestone;
- merging;
- `git push`.

Reads such as `gh issue view` or `gh pr checks` are not writes.

`/tiket:siapkan-proyek` is the one exception. It creates the repository, its labels and its milestone, so it runs under the owner's own account.

## 1. The agent account

The agent writes through its own GitHub account: a machine account or a GitHub App that only the agent uses. It never writes through the owner's personal account. To GitHub, a personal account that opens dozens of issues and PRs in a few days looks like a spam bot, and a suspension then locks the owner out of every repository. A separate account keeps the owner's account out of reach.

Before the first write of a session, check both of these:
1. **The `gh` account.** Run `gh auth status --active` and read the login. Then read the owners in `.github/CODEOWNERS`. When the login is one of them, stop.
2. **The remote.** Run `git remote get-url origin`. When it starts with `git@` or `ssh://`, stop. A push over SSH uses the owner's key, so it reaches GitHub as the owner.

When you stop here, tell the owner in plain words what to change, and link the guide page `https://github.com/Mandalika-IT-Devs/jalankan-tiket/blob/main/docs/<language>/agent-account.md`, where `<language>` is `id` or `en`. Never switch, add or remove a `gh` account yourself, and never change git credentials. Those steps belong to the owner.

## 2. One coordinator per account

Only one `/tiket:jalankan` runs per agent account at a time, across all repositories. A lock file on this machine guards it: `~/.cache/jalankan-tiket/koordinator.lock`. It holds one line with the repository root and the time, such as `/home/ana/perpustakaan 2026-03-02T09:15:00+07:00`.

- **Taking the lock (`/tiket:jalankan` only, before the first round).** Read the file. When it names another repository and its time is less than 3 hours old, stop: a coordinator is already running there. Otherwise create the folder with `mkdir -p ~/.cache/jalankan-tiket`, then write this repository's root and the current time into the file.
- **Keeping the lock.** At the start of every round, write the current time into the file again.
- **Releasing the lock.** Delete the file with the final report, and with every stop.
- **Other skills that write** read the file before their first write. When it names another repository and is less than 3 hours old, stop and tell the owner which repository is running. They never take the lock.

## 3. Pace

- **Between two writes:** wait at least 10 seconds. Usually other work already fills that time. The wait matters in a loop, such as posting several comments in a row.
- **Between two new issues:** wait at least 30 seconds.
- **To wait,** run `sleep <seconds>` as a command of its own.
- **Comments:** comment only when the owner must read it, for example to park a ticket, to ask a question or to record a decision. The PR description holds everything else.
- **Waiting for CI:** use `gh pr checks <pr> --watch --interval 60`, and never check more often.
- **Waiting for the owner:** when the next step needs the owner, such as a label or an answer, do not wait or poll. Report what the owner must do, then move on or stop.

## 4. Stop at a limit

Stop the whole run at once when a `gh` command or `git push` gives any of these signs:
- HTTP 403 or 429;
- a message about a rate limit, a secondary rate limit or abuse detection;
- a message about a suspended account.

Do not retry the command, and do not look for another command that does the same thing. Delete the coordinator lock when you hold it. Then report the last state to the owner: the command that failed, its message, and what is left. The next run resumes from the state on GitHub.
