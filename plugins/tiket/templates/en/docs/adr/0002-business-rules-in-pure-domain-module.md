---
status: accepted
date: {{DATE}}
---

# Business rules only in the pure domain module

Autonomous agents build this project one ticket at a time. We want business rules to be testable without a database, and we do not want them to spread into the user interface or into handlers. So every rule from the PRD goes in `{{DOMAIN_MODULE_PATH}}`.

That module holds pure functions with deterministic input → output. These functions use no database, no I/O, no framework and no system clock. "Now" is always passed in as a parameter.

## Consequences

- Each PRD rule has a function named with a `GLOSSARY.md` term, plus unit tests that use the `tests/golden/` fixtures.
- Other layers, such as the server and the user interface, call the domain, then show its result together with the values it was calculated from.
- The import check in `{{VERIFY_COMMAND}}` rejects every import that crosses this boundary.
