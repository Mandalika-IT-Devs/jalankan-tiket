## Stack: Next.js + PostgreSQL

### Language

- TypeScript `strict`, with no `any`.
- Outside data has the type `unknown`, and is then validated with Zod.

### Folder structure

- `src/domain/` holds the pure business rules.
- `src/server/` holds the code for the database, files, email, time and background jobs.
- `src/app/` holds routes, Server Actions and components.

Imports go in one direction only:
- `src/domain/` imports neither `src/server/` nor `src/app/`;
- `src/server/` does not import `src/app/`.

These import rules are enforced by dependency-cruiser.

### Server Actions and route handlers

Server Actions and route handlers are kept thin. They always follow this order:
1. read the session;
2. validate the input with Zod;
3. check permissions on the server;
4. call the domain or the server;
5. return the result.

Hiding a button in the user interface is not a permission check.

### Components

- UI components do not calculate business rules. A component shows the result together with the values it was calculated from.
- shadcn/ui components live in `src/components/ui/`. Create a new component only when the issue names it.

### Database and time

- The database is accessed through Drizzle ORM, and its migrations are made with Drizzle Kit.
- A migration that is already merged is never changed. Every change is made as a new migration.
- Points in time are stored as `timestamptz` (UTC).
- Time zone conversion happens in only one module, in `src/server/`.
