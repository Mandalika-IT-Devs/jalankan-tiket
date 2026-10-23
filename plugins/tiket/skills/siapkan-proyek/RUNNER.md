# Self-hosted CI runner

A self-hosted runner is the owner's own Linux machine running GitHub Actions for this repository. It is still GitHub Actions: the coordinator reads its results with `gh pr checks`, exactly as with GitHub-hosted runners. GitHub runs service containers, such as the CI database, only on Linux, so the runner must be Linux with Docker.

## A runner that already serves this repository

When the project's workflow already runs on a self-hosted runner (`runs-on: [self-hosted, …]`), keep that runner and its ports:
- skip **Registering the runner** below;
- take the CI ports the workflow already uses instead of choosing new ones, and record them in the project config under `ports` and in the registry.

## Ports

Several projects can run CI on one machine, so each one needs its own ports.

1. Read the port registry at `${CLAUDE_PLUGIN_DATA}/ports.json`. It is a JSON object keyed by `owner/name`. If the file does not exist yet, start from `{}`.
2. Choose the ports that the stack profile asks for, such as `ciPostgres` and `ciE2e` for `nextjs-postgres`. The profile's **Ports** section says what counts as a used port, and where each search starts.
3. Write the chosen ports into the project config under `ports`, and into the stack placeholders.
4. Add the project's entry to the registry and save it.

## Registering the runner

Registering the runner installs a system service and asks for the owner's sudo password, so the owner runs it.

1. Copy `${CLAUDE_PLUGIN_ROOT}/templates/runner/pasang-runner.sh` to `.github/runner/pasang-runner.sh`, and fill `{{REPO}}` and `{{PROJECT_SLUG}}`.
2. In the report, tell the owner to open a terminal in the repository and run:

   ```
   bash .github/runner/pasang-runner.sh
   ```

   The script downloads the official runner and registers it for this repository only. It then starts the runner as a service.
3. Browser tests also need system libraries, installed once per machine:

   ```
   sudo npx playwright install-deps chromium
   ```

Until the runner is online, CI jobs wait in the queue. That is expected, not an error.
