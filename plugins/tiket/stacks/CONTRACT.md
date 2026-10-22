# The stack contract

The workflow runs on any stack that provides the seven items below. The `nextjs-postgres` profile is one implementation of them. A project on another stack writes its own implementation during `/tiket:siapkan-proyek`, and records the choices in its ADR-0001.

1. **One verify command** (`verifyCommand`). It runs the following checks in this order:
   1. static analysis or type checking;
   2. lint and format checking;
   3. dead code: unused files, exports and dependencies;
   4. import boundaries: the pure domain module imports nothing outside itself;
   5. unit and integration tests.

   It stops at the first check that fails and exits non-zero.
2. **End-to-end tests**, which are optional. CI runs `e2eCommand` after the verify command.
3. **A dependency allowlist** in `.github/dependency-allowlist.txt`. CI checks it against the stack's manifest.
4. **A pure domain module** at the path `{{DOMAIN_MODULE_PATH}}`. Its import rules are enforced by the verify command.
5. **Golden fixtures** in `tests/golden/`. They are read-only and serve as test expectations.
6. **CI on GitHub Actions**, with two jobs that the coordinator reads through `gh pr checks`:
   - `kebersihan-pr`:
     - the PR closes an issue;
     - a warning when the PR is large;
     - protected paths need the owner-approved label;
     - dependencies are on the allowlist.
   - `verify`: the verify command, then the end-to-end tests.
7. **A reproducible local environment**, such as Docker Compose, and a `.env.ci` without real secrets.

## Adapting another stack

`/tiket:siapkan-proyek` follows these steps when the owner picks a stack that has no profile:

1. **Grill the owner on the stack.** Call the Skill tool with "grilling". Cover the language, the framework, the database, the test tools and the deployment target. Call the Skill tool with "research" to check current tool versions and the equivalents in the table below.
2. **Choose and record the tools.** Pick a tool for each contract item and record the choices in `docs/adr/0001-stack.md`.
3. **Write the stack files.** Model them on `nextjs-postgres/`:
   - the placeholder values listed in its `PROFILE.md`;
   - the dependency allowlist;
   - a CI workflow with the stack's setup steps and a dependency check that reads the stack's manifest.
4. **Write the foundation ticket `[T00]`** in the shape of `nextjs-postgres/<lang>/ticket-t00.md`.

## Equivalents

These are starting points, not tested profiles.

| Contract item | Node / TypeScript | Python | PHP / Laravel | Go |
|---|---|---|---|---|
| Static analysis or types | `tsc --noEmit` | mypy or pyright | PHPStan / Larastan | `go vet` |
| Lint and format | ESLint, Prettier | ruff (lint and format) | Pint | golangci-lint, gofmt |
| Dead code | knip | vulture, deptry | PHPStan rules | staticcheck (unused) |
| Import boundaries | dependency-cruiser | import-linter | deptrac | depguard (in golangci-lint) |
| Tests | Vitest | pytest | Pest or PHPUnit | `go test` |
| End-to-end | Playwright | Playwright for Python | Laravel Dusk or Playwright | Playwright |
| Manifest for the allowlist check | `package.json` | `pyproject.toml` | `composer.json` | `go.mod` |
