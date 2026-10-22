## What to build

The repo foundation: an empty Next.js application that passes `pnpm verify` and CI. This ticket does not build any business feature yet.

## In scope

- **Application:**
  - Next.js App Router, TypeScript strict, pnpm and the Node.js LTS version recorded in ADR-0001. Set `packageManager` and `engines` in `package.json`.
  - One home page that shows the product name.
- **Database:**
  - PostgreSQL through Drizzle ORM. `docker-compose.yml` and `.env.example` already exist.
  - `drizzle.config.ts` and the first migration, which is still empty.
- **User interface:** Tailwind 4 and shadcn/ui installed, with the default theme.
- **Scripts in `package.json`:** `typecheck`, `lint`, `knip`, `depcruise`, `test`, `test:e2e` and `verify`.
  - `verify` runs `node scripts/verify.mjs`. That file already exists.
  - `depcruise` runs dependency-cruiser with `.dependency-cruiser.cjs`. That file also exists already.
- **Tests:**
  - Vitest, with one example test in `src/domain/`.
  - Playwright, with one e2e test for the home page.
  - The e2e server uses the port from the `E2E_PORT` variable; if it is not set, it uses 3100.
  - The e2e server loads `.env.ci` with override, so that e2e tests never use the development database.
- **Tool configuration:** ESLint, Prettier and knip are configured so that `pnpm verify` is green.

## Out of scope

- Any business feature.
- Login or authentication.
- Pages other than the home page.

## Acceptance criteria

- [ ] `pnpm verify` is green locally.
- [ ] The `verify` job in CI is green, including the e2e tests.
- [ ] Every dependency is in `.github/dependency-allowlist.txt`.
- [ ] Code in `src/domain/` imports only from `src/domain/`. If it does not, `pnpm depcruise` fails.

## References

ADR-0001, ADR-0002, AGENTS.md, CODING_STANDARDS.md.

## Blocked by

- None
