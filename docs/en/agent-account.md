# Agent account

## Why the agent needs its own account

The kit writes a lot to GitHub: issues, PRs, comments, pushes and merges. When all of that goes through your personal account, GitHub sees one person who opens dozens of issues and PRs in a few days. To GitHub's abuse detection, that pattern looks like a spam account. Your account can be suspended, and that locks you out of every repository.

Large repositories avoid this by running their automation through bot identities, such as `dependabot[bot]` or a machine account like `k8s-ci-robot`. The kit works the same way:
- the agent writes through an **agent account**;
- you keep your personal account for the approval label, PR reviews and repository settings.

Before writing anything to GitHub, every kit skill checks two things:
- **The active `gh` account.** When it is listed in `.github/CODEOWNERS`, it is the owner's account.
- **The address of the `origin` remote.** When it uses SSH, pushes use the owner's SSH key.

When either applies, the skill stops and points to this page. The only exception is `/tiket:siapkan-proyek`, which creates the repository and its labels with your account.

## Choosing an account

| | Machine account | GitHub App |
|---|---|---|
| What it is | An ordinary GitHub account that only the agent uses | An app installed on the repository, shown as `name[bot]` |
| Setup on a laptop | Easy: `gh auth login` with that account | Harder: its token has to be created again every hour |
| Good for | Claude Code on a laptop (recommended) | Teams that already work with GitHub Apps |

This page walks through a machine account.

[GitHub's Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) let one person hold one free personal account plus one machine account. The machine account is used only for automation, and you are responsible for it.

**Do not create a machine account while your personal account is suspended or under review by GitHub.** That can count as evading the suspension. Wait until the account is back, or ask GitHub Support first.

## Setup steps

One machine account is enough for all of your projects.

1. **Create the machine account.** Sign out of GitHub in the browser, or use a private window. Sign up with another email address, for example `name+bot@domain.com`. Pick a clear name, such as `<your-name>-bot`. Turn on two-factor authentication.
2. **Give it access to the repository.** With your personal account, open the repository → **Settings** → **Collaborators** → **Add people**, and invite the machine account with the **Write** role. Sign in as the machine account and accept the invitation. Repeat for every project repository.
3. **Log `gh` in with the machine account.** In a terminal:

   ```
   gh auth login --hostname github.com --git-protocol https --scopes workflow
   ```

   When the browser opens, make sure the machine account is the one signed in. `gh` keeps both accounts, and the account that logged in last becomes the active one.
4. **Send pushes through the machine account.** In the project folder:

   ```
   git remote set-url origin https://github.com/<owner>/<repo>.git
   gh auth setup-git
   ```

5. **Check.** Type `/tiket:cek-proyek`. The `agent account` line must be OK and name the machine account.

## Switching accounts

- **See the active account:** `gh auth status --active`.
- **Switch to your personal account**, for example for a `!` command that needs admin rights, such as applying a ruleset: `gh auth switch --user <personal-account>`.
- **Switch back to the machine account** before you run a kit skill: `gh auth switch --user <machine-account>`.

The agent never switches accounts itself. The project's permission rules deny the agent `gh auth login`, `logout`, `switch`, `refresh`, `token` and `setup-git`.

You still add the approval label and review PRs on GitHub's pages, with your personal account.

## The agent's pace

Besides using its own account, the agent keeps a steady pace:
- **One coordinator per agent account.** `/tiket:jalankan` does not start while another coordinator is still running in another repository on the same laptop. Do not run another project with the same agent account from a second laptop at the same time either.
- **Pauses.** The agent waits at least 10 seconds between two writes to GitHub, and 30 seconds between two new issues. Publishing 20 tickets takes about 10 minutes.
- **Few comments.** The agent comments only when there is something you need to read.
- **CI is checked every 60 seconds.**
- **No waiting on you.** A PR that needs the approval label is reported and then left alone until you add the label.
- **Stopping at a limit.** When GitHub answers 403 or 429, or mentions a rate limit or a suspended account, the agent stops at once without retrying. It then reports the last state.
- **Local checks first.** The agent pushes only after the verify command and the end-to-end tests are green on the laptop, so the Actions quota is not spent on builds that are bound to fail.

Read next: [Security and guardrails](security.md) · [FAQ](faq.md)
