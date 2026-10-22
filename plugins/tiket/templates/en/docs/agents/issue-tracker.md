# Issue tracker: GitHub Issues

The tickets in this repo are GitHub Issues, and they are reached with `gh`. `gh` finds the repo from `git remote`.

## Operations

- **Read a ticket** with the owner's answers: `gh issue view <n> --comments`.
- **List ready tickets:** `gh issue list --state open --label {{LABEL_READY_FOR_AGENT}} --json number,title,body,labels`.
- **Create a ticket:**

  ```
  gh issue create --title "[{{TICKET_PREFIX}}xx] ..." --label {{LABEL_READY_FOR_AGENT}} --milestone <milestone> --body-file <file>
  ```

  The ticket body uses the format of `.github/ISSUE_TEMPLATE/ticket.md`.
- **Comment:** `gh issue comment <n> --body-file <file>`.
- **Labels:** `gh issue edit <n> --add-label <label>`, or `--remove-label <label>`.
- **Close an issue:** an issue is closed by `Closes #n` in a merged PR, never with `gh issue close`.

## Dependencies between tickets

Dependencies are written in the "Blocked by" section of the ticket body, as `- #12`, or as "None" when the ticket depends on no other ticket. The coordinator reads that text section. That is why this repo does not use GitHub's built-in dependency feature, and does not use sub-issues either.

## Ticket shape

One ticket is done in one PR. Its required sections:
- What to build.
- In scope.
- Out of scope.
- Acceptance criteria. Each item must be checkable as pass or fail.
- References: PRD §, ADR, golden, UAT.
- Blocked by.

A criterion that names a number quotes `tests/golden/` or the PRD.

## Pull request

- **Create:** `gh pr create --title "{{TICKET_PREFIX}}<nn>: <summary>" --body-file <file>`, with a body that follows `.github/pull_request_template.md`.
- **Updates** are written as PR comments. The PR description is not edited after it is created.
- **Feature requests** from humans are always created as issues, never as PRs.

**PRs as a request surface: no.**

## When a skill says "publish to the issue tracker"

Create a GitHub issue in the format above.

## When a skill says "fetch the relevant ticket"

Read the issue with `gh issue view <n> --comments`.
