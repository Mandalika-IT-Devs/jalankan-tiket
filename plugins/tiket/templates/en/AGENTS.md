# AGENTS.md: {{PROJECT_NAME}}

{{PROJECT_SUMMARY}}

## Language

Everything written for the owner is in English: every message in the conversation, including the short status lines between commands such as "Now the CI: …", and issues, PRs, comments and commits. One message uses one language.

## Sources of truth

- **Business rules:** `docs/PRD.md`. A `▶ Decision` block overrides the text above it. The files in `docs/input/` are not rules.
- **Terms** for names in code, tests, issues and PRs: `GLOSSARY.md`, including its _Avoid_ lists.
- **Technical decisions per area:** `docs/adr/`. The stack is recorded in ADR-0001. Business rules may live only in the pure domain module (ADR-0002).
- **Things the owner has not decided yet:** `docs/OPEN-DECISIONS.md`. Their example values are used in seeds and tests with the marker `{{EXAMPLE_MARKER}}`, not as rules.
- **Writing code:** `CODING_STANDARDS.md`. The domain module has its own rules in `{{DOMAIN_MODULE_PATH}}AGENTS.md`.
- **Building or changing the user interface:** `docs/DESIGN.md`. <!-- ui -->
- **Correct calculation examples:** `tests/golden/` (read-only).
- **Acceptance scenarios** for each PRD section: `docs/UAT.md`.
- **Configuration of the jalankan-tiket kit:** `.github/jalankan-tiket.json`.

## Way of working: automatic

The `tiket` plugin from the jalankan-tiket kit works on tickets without waiting for a human. It follows this order:

```
/tiket:jalankan → subagent tiket:pelaksana → subagent tiket:peninjau → PR → CI → merge
```

The product owner only answers parked tickets and runs UAT. The owner's guide is in `docs/GUIDE.md`.

When the owner asks for a feature or a change in a plain conversation, without a `/tiket:` command, suggest `/tiket:rencanakan-tahap` followed by the description, so that its rules reach the PRD and the work becomes tickets. Do the work directly only when the owner asks for that.

A ticket counts as done when all four of these conditions are met:
- every acceptance criterion is ticked;
- `{{VERIFY_COMMAND}}` is green;
- the reviewer gives `PASS`;
- CI is green.

### Two kinds of ambiguity

- **Technical** — decide it yourself. Then record it in the PR as a technical decision, with its reason and its risk. Examples:
  - code structure, file names, patterns and how to test;
  - the display order of a list, when the PRD does not set it;
  - small visual details that `docs/DESIGN.md` does not set.
- **Business** — do not guess, because a guess counts as a failure. Park the ticket with the label `{{LABEL_NEEDS_INFO}}`. Write the question and its answer options for the owner, then move on to another ticket. Examples:
  - formulas, numbers and thresholds;
  - who may do what, and what users see;
  - behaviour outside the issue or the PRD;
  - rules that contradict each other.

The items in `docs/OPEN-DECISIONS.md` are business questions that already have an example value, so the ticket does not need to be parked. Use the example value with the marker `{{EXAMPLE_MARKER}}`, name the OD in the PR, then carry on.

## Scope limits

The work must match exactly what the issue lists under "In scope".

- Add features, pages, tables, columns, env vars, options and abstractions only when the issue names them.
- Dependencies may only come from `.github/dependency-allowlist.txt`. If you need a dependency outside that list, park the ticket.
- A refactor touches only the files that the issue really needs.
- Formulas and thresholds are implemented exactly as in the PRD and `tests/golden/`.
- A red test is fixed in the code, not in the golden fixtures.
- Changes reach `main` only through a PR with green CI. Only a human may force-push.

### Protected files

The list of protected files is in `.github/protected-paths.txt`. The rules:
- These files change only on an explicit instruction from the owner, in an issue or in a comment.
- A PR that changes them must carry the label `{{LABEL_OWNER_APPROVED}}`, and CI rejects a PR without that label.
- Only the owner adds that label.

## Environment

{{ENVIRONMENT}}

## Commands

`{{VERIFY_COMMAND}}` is the required gate before every commit and in CI. The other commands are in {{COMMANDS_SOURCE}}.

## Agent skills

### Issue tracker

GitHub Issues, through `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

The five default triage roles. See `docs/agents/triage-labels.md`.

### Domain docs

One context: `GLOSSARY.md` and `docs/adr/` at the root. See `docs/agents/domain.md`.
