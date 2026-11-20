# Rules of engagement

Every qa skill and agent follows these rules. They protect a staging environment that other people share, the product team's repository, and the test accounts. When a rule and a request conflict, the rule wins: stop and tell the QA engineer.

## The product's repository

- Read it only, from `products/<slug>/source/`. Its push URL is disabled. Run git there with `-c gc.auto=0`, so that a search such as `git log -S` does not start a cleanup that rewrites the clone's `.git`.
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
- Never type a password into a page, a command or a message. When a login is needed that the setup project does not cover, mark the check BLOCKED and ask the QA engineer. `playwright.md` describes the two ways a spec may log in by itself.
- **Test output can keep what a test typed.** The Playwright HTML report stores the value of every fill step. Traces, videos, screenshots, `ariaSnapshot()` output and the `error-context.md` of a failed test can show a field that holds a password. The templates have no HTML report, and the `setup` project records no trace, video or screenshot. Never turn either back on, and never read a `playwright-report/` folder: delete it.
- A screenshot or video that shows a password, a token, a full payment card number, a shared test account's email or avatar, or a real person's data is never shared. Retake it with `mask`, or cover the part with `scripts/samarkan.mjs`, as `playwright.md` describes.
- **Secrets you come across.** A card, a document, a file in `source/` or a page may hold a key, a token or a password. Never copy, quote or use it, and do not open it further. Tell the QA engineer where it is, so the team can move it and change it.
- **Secrets in URLs.** A URL can carry a credential in its query. Print URLs only through `redactUrl` from `tests/support/redact.ts`, and redact the query of every URL you copy into a file, a card or a report. When a test account's password ever appears in a URL, the login setup stops: report it as a bug candidate, and ask the QA engineer to change that account's password, because the server may have logged it.

## GitHub accounts

The QA engineer's own GitHub account owns the workspace and reaches the product's repository. The active `gh` account can be another one, such as an agent account that the `tiket` plugin uses for other projects. Then git in the workspace and in `source/` needs the QA engineer's account, which `${CLAUDE_PLUGIN_ROOT}/scripts/akun-git.sh` sets per repository. The QA engineer runs that script, never an agent: it hands git a token from `gh`. Never switch, add or remove a `gh` account yourself.

## Data on staging

- Tests may create records with test accounts. Every created record carries `testDataPrefix` in a visible field, such as a name or a note.
- Never change or delete a record that QA did not create. When a test needs such a change, mark it BLOCKED and ask for a record made for testing.
- A shared setting or shared content that the QA engineer allowed you to change goes back to its first value when the test ends. Restore only what changed, with as few writes as possible. Never publish content again when its published version did not change: many apps keep every publication in a permanent history.
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
- Trello and Google Drive writes wait at least 10 seconds between two writes. Send `sleep 10` as a command in the same message as each write, so the pause costs no extra round.
- Stop at once, without retrying, when a connector or a site answers with a rate limit, HTTP 429, or a block page. Report what is left.
- Logins count against the app's rate limit, and a limit that is reached can lock out the other people on staging. Run the `setup` project once per run, and keep the logins that specs make few. After an HTTP 429 on a login, `logIn` pauses every login for 15 minutes.
