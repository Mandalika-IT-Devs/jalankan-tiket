---
status: accepted
date: {{DATE}}
---

# One Next.js application with PostgreSQL

Autonomous agents build this project one ticket at a time. Every extra layer of technology is one more place where an agent can get lost, with no real benefit. So we chose a single monolithic application:

- **Language and framework:** Node.js 24 LTS, pnpm, Next.js App Router and TypeScript strict.
- **Data:** PostgreSQL with Drizzle ORM. Docker Compose is used for the local environment.
- **Validation and user interface:**
  - Zod for validation;
  - Tailwind 4 and shadcn/ui (Radix) for the user interface;
  - React Hook Form for forms.
- **When the product needs them:**
  - Better Auth, when the product needs login;
  - pg-boss, when the product needs background jobs. Background jobs do not use Redis.
- **Tests:**
  - Vitest and Testing Library for unit and component tests;
  - Playwright for end-to-end tests.

  `pnpm verify` runs typecheck, lint, knip, dependency-cruiser and the tests.
- **Deploy:** when the product needs a deploy, the application runs on one server (VPS) with Docker Compose.

## Considered Options

These options were rejected: a monorepo or Turborepo, a separate API, Prisma, Redis with BullMQ, and microservices. The reason is the same for all of them: one application is enough, and every extra layer adds another place where an agent can get lost.

## Consequences

- The approved dependencies are listed in `.github/dependency-allowlist.txt`. Every new dependency needs the owner's approval.
- There is no public REST API, unless the PRD asks for one.
