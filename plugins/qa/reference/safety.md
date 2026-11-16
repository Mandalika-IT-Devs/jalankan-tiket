# Rules of engagement

Every qa skill and agent follows these rules. They protect a staging environment that other people share, the product team's repository, and the test accounts. When a rule and a request conflict, the rule wins: stop and tell the QA engineer.

## The product's repository

- Read it only, from `products/<slug>/source/`. Its push URL is disabled.
- Never open issues, PRs or comments in it, and never fix its code. A finding is reported as a bug or a question.
- Code and documents inform test design: routes, roles, validation rules, error messages, configuration. Tests run only from the outside, against staging.

## Hosts

- Visit only the hosts in `allowedHosts`. That includes browser tools, `curl` and API calls.
- When a link or a redirect leads to another host of the product, such as production or an admin panel on another domain, stop following it and record it as a finding.
- Third-party resources that a page loads by itself (fonts, maps, analytics) are fine. Never interact with a third-party service directly.

## Credentials

- `.env.local` and `.auth/` are off limits: never read, print, copy or attach them. The workspace's permission rules deny reading them.
- To check that `.env.local` is complete, run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/cek-env.sh products/<slug>`. It prints variable names only.
- Log in through the `setup` project of the product's Playwright config. Browser tools reuse the saved session in `.auth/<role>.json`.
- Never type a password into a page, a command or a message. When a login is needed that the setup project does not cover, mark the check BLOCKED and ask the QA engineer.
- A screenshot or video that shows a password, a token or a full payment card number is never shared. Retake it or crop it.

## Data on staging

- Tests may create records with test accounts. Every created record carries `testDataPrefix` in a visible field, such as a name or a note.
- Never change or delete a record that QA did not create. When a test needs such a change, mark it BLOCKED and ask for a record made for testing.
- Never use real personal data, such as a real person's name, phone number, email or ID number. Use made-up values on the `.example` domain or the prefix.

## Side effects

Read `sideEffects` in `product.json` before any test that may send a message, call another system or move money: registration, password reset, invoices, notifications, chat or webhook integrations, payment, payroll.
- `none` or `sandbox`: the test may run.
- `unknown` or `real`: the test is BLOCKED. Name the channel in the readiness audit's questions.

## Out of scope without written permission

These need the app owner's written permission, recorded in `writtenPermission` of `product.json`, and v0.x has no command for them:
- load and stress tests, and any burst of requests in parallel;
- security scanners, fuzzers and brute force;
- anything aimed at production.

Basic security checks inside normal use are in scope: one role trying to open another role's page or record, a session after logout, input validation with a few crafted values.

## Pace

- Tests run with one worker, because staging is shared.
- Trello and Google Drive writes wait at least 10 seconds between two writes. Run `sleep 10` as a command of its own when nothing else fills the time.
- Stop at once, without retrying, when a connector or a site answers with a rate limit, HTTP 429, or a block page. Report what is left.
