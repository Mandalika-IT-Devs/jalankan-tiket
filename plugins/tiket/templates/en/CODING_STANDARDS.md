# Coding Standards

Two subagents use this document:
- `tiket:pelaksana`, when it writes code;
- `tiket:peninjau`, on the Standards axis.

Rules that tools already enforce through `{{VERIFY_COMMAND}}` are not repeated here. The stack is recorded in ADR-0001.

## Language and naming

- Domain concepts use the exact terms from `GLOSSARY.md`. General programming concepts use English, for example `parse`, `result` and `handler`.
- UI text, error messages, commit messages and PR bodies are written in English.
- Every error message states its cause and the next step.
- Outside data (forms, requests, imported files) is validated at the system boundary before it is used.

## Module boundaries

- `{{DOMAIN_MODULE_PATH}}` holds the pure business rules (ADR-0002). It contains deterministic input → output functions: no database, no I/O, no framework and no system clock.
- Other layers call the domain, never the other way round. A tool in `{{VERIFY_COMMAND}}` enforces this import rule.

{{STACK_STANDARDS}}

## Tests

- Tests are written at the seams that the issue names.
- A ticket that touches business rules must add unit tests in the domain module.
- Test expectations come from `tests/golden/`, from the PRD or from literal examples in the issue. An expectation must never be computed with the same formula as the code.
- Real data is never committed. Seeds and tests use synthetic data, and values from `docs/OPEN-DECISIONS.md` carry the marker `{{EXAMPLE_MARKER}}`.

## Dependencies

- A new dependency may only come from `.github/dependency-allowlist.txt`. Any other dependency needs the owner's approval.
- There must be no unused files, exports or dependencies.

## Review checklist

<!-- Rules specific to this project, which tiket:peninjau checks on every ticket.
Write one item per line. Each item must be checkable as pass or fail.
Example: "Every stock change writes one row to the stock history, with the person who made the change."
Items can be added by an owner decision or from the results of /retro. -->

- (none yet)
