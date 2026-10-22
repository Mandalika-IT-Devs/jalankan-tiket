# CI and runners

The coordinator reads CI results through `gh pr checks`. That is why the kit's CI always runs on **GitHub Actions**. What you can choose is the machine that runs it.

## Two runner options

| | GitHub runner (default) | Your own runner (self-hosted) |
|---|---|---|
| Machine | A fresh machine from GitHub for every run | Your laptop or Linux server |
| Cost | Free in public repos. Private repos get a monthly quota of minutes, based on the account plan. | Free, but the machine must be on |
| Setup | None | Register the runner once (see below) |
| Good for | Most projects | Private repos that run out of minutes, or when you want CI on your own machine |

Your own runner is still GitHub Actions, and the coordinator reads it in the same way. CI outside GitHub, such as GitLab CI or Jenkins, is not supported, because the coordinator depends on `gh` for issues, PRs, CI checks and merges.

## What CI checks

- **`kebersihan-pr`**, for PRs only:
  - the description contains `Closes #n`;
  - a warning when the PR is longer than 400 lines;
  - protected files need the approval label;
  - dependencies are on the allowlist.

  The list of protected files and the label name are read from the target branch. That way, a PR cannot loosen the checks for itself.
- **`verify`**: runs the verify command, then the end-to-end tests if there are any. Until the `[T00]` ticket is done, this job only shows the note "waiting for the foundation ticket".

## Installing your own runner

Requirements: Linux, and Docker that works without `sudo`. GitHub runs service containers, such as a database for tests, only on Linux runners.

1. During `/tiket:siapkan-proyek`, choose the self-hosted runner. Claude picks CI ports that do not clash with other projects on this machine, then copies the install script into the repo.
2. Open a terminal in the repo folder, then run:

   ```
   bash .github/runner/pasang-runner.sh
   ```

   This script downloads GitHub's official runner, registers it for this repo only, and runs it as a service. The script asks for your `sudo` password once.
3. For browser tests, install the system libraries once per machine:

   ```
   sudo npx playwright install-deps chromium
   ```

While the runner is off, CI jobs wait in the queue. That is normal, not an error.

## Several projects on one machine

Each project gets its own ports:
- development PostgreSQL;
- PostgreSQL for CI;
- the end-to-end server.

Each project also gets its own pnpm folder. The list of ports is kept in the plugin's data. That way, the CI of two projects can run at the same time without getting in each other's way.

## Protecting `main`

In public repos, and on paid GitHub accounts, `/tiket:siapkan-proyek` prepares a *ruleset* that:
- requires a PR;
- requires `kebersihan-pr` and `verify` to be green;
- blocks force-push.

You install that ruleset with one command that Claude gives you. GitHub does not offer this feature in private repos on free accounts. There, the agent permissions and CI enforce the same rules.
