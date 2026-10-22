# Domain module

The code in this folder is pure: deterministic input → output. This is where the PRD rules are written (ADR-0002).

- **Imports:** only from `src/domain/` and TypeScript's built-in libraries. This module must not use a database, Next.js, React, I/O, the system clock or npm dependencies. This rule is enforced by dependency-cruiser.
- **Time:** "now" is always passed in as a parameter, never taken from `Date.now()`. The server layer reads the clock, then passes the time on to this module.
- **Functions:** each PRD rule has one function, named with a term from `GLOSSARY.md`.
- **Tests:**
  - Each public function that the issue names is tested with the `tests/golden/` fixtures.
  - Test expectations come from the fixtures or the PRD. They are never recalculated with the same formula.
- **Calculation results:** each calculation result carries the values it was calculated from, so that the user interface can show where every number comes from.
