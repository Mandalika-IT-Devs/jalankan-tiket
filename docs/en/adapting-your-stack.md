# Adapting your stack

The kit is not tied to one technology. What it requires is the **stack contract**: seven things that any stack must provide, so that the coordinator, the implementer and CI can do their work.

## The contract

1. **One verify command.** It runs, in this order:
   - static analysis or a type check;
   - lint and format checks;
   - dead code detection;
   - a check of the domain module's import boundaries;
   - tests.

   The command stops at the first step that fails.
2. **End-to-end tests** (optional), which CI runs after verify.
3. **A dependency allowlist** in `.github/dependency-allowlist.txt`, which CI checks against the stack's manifest.
4. **A pure domain module**, with import rules that a tool enforces.
5. **Golden calculation examples** in `tests/golden/`.
6. **CI on GitHub Actions** with two jobs:
   - `kebersihan-pr`: the PR closes an issue, protected files need the label, and dependencies are on the allowlist;
   - `verify`.
7. **A reproducible local environment**, for example Docker Compose, and a `.env.ci` without real secrets.

## Default profile: Next.js + PostgreSQL

This profile is tested. It contains:
- Next.js App Router, TypeScript strict, pnpm and Node.js 24;
- PostgreSQL with Drizzle;
- Tailwind and shadcn/ui;
- Vitest and Playwright.

Its verify command is `pnpm verify`. It runs typecheck, lint, knip, dependency-cruiser and the tests. The `[T00]` ticket builds the empty application.

## Another stack

When `/tiket:siapkan-proyek` asks about the stack, choose "another stack". Claude then works in four steps:

1. **It questions you** about the programming language, the framework, the database, the test tools and the deploy target. This uses the `grilling` skill.
2. **It checks the tools and their versions** against official sources, with the `research` skill.
3. **It picks a tool for each contract item**, then records the choices in `docs/adr/0001-stack.md`.
4. **It writes the stack files:**
   - the verify command;
   - the dependency allowlist;
   - CI with a dependency check that reads your stack's manifest;
   - the foundation ticket `[T00]`.

## Equivalent tools

This table is a starting point, not a tested profile.

| Contract item | Node / TypeScript | Python | PHP / Laravel | Go |
|---|---|---|---|---|
| Static analysis / types | `tsc --noEmit` | mypy or pyright | PHPStan / Larastan | `go vet` |
| Lint and format | ESLint, Prettier | ruff | Pint | golangci-lint, gofmt |
| Dead code | knip | vulture, deptry | PHPStan rules | staticcheck |
| Import boundaries | dependency-cruiser | import-linter | deptrac | depguard |
| Tests | Vitest | pytest | Pest or PHPUnit | `go test` |
| End-to-end | Playwright | Playwright for Python | Laravel Dusk or Playwright | Playwright |
| Manifest for the allowlist | `package.json` | `pyproject.toml` | `composer.json` | `go.mod` |
