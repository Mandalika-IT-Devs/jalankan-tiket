# Changelog

All notable changes to the `qa` plugin. Versions follow `plugins/qa/.claude-plugin/plugin.json`. ADR-0004 records the design.

## 0.3.0

- **Card moves after a retest.** `/qa:laporkan` proposes moving each retested card along the team's flow, and moves only the cards the QA engineer agrees to:
  - a retest that passed goes to `retestPassedListId`, such as a UAT list;
  - a retest that failed goes back to `retestFailedListId`, such as the developers' list.

  It never moves a card that passed as "obsolete: new design", one that is already in its target list, or a passed one already further along the board. New bug cards still wait in the review list for the QA engineer.
- **List keys.** `product.json` has the two new keys in `trello`. `/qa:siapkan-produk` asks for them together with `retestListId` once it can read the board, and `/qa:laporkan` asks the first time it needs one. A workspace made before 0.3.0 needs no change. Check 14 of `/qa:audit-kesiapan` checks that every list named exists.
- `/qa:siklus` waits for the move question at the end, and names the moved cards in its final report.

## 0.2.0

The first validated version. Fixes from the second regression cycle on a real product: 183 cases, 7 of 7 retests passed, and a run that continued in a new session from its handoff file alone. None of them is specific to that product.

- **Regression.**
  - `/qa:regresi` tells a change of behaviour from a cosmetic change in a shared component, such as a new label in a table's pagination. The cosmetic change chooses only the cases that check it.
  - A large diff goes to a subagent, which writes `run/diff-map.md`.
  - New outward channels and new preconditions in the diff, such as sign-up that now needs a link from an email, become questions before the run.
  - Cards in the retest list whose fix exists only on an unmerged branch are put to the QA engineer, not retested blindly.
  - Charter IDs are checked for duplicates.
  - Cases whose expected result a new design replaced are named, with their source.
  - The version is checked again right before the cycle opens.
- **Skipped P1 cases.** When the QA engineer decides not to run a P1 case, `/qa:regresi` and `/qa:jalankan-uji` warn at once that it makes the report NO-GO. They offer to record it as BLOCKED, with the precondition that would make it safe and its owner. `/qa:laporkan` asks before it changes such a state, and never softens a recommendation on its own.
- **Planning.**
  - Every case file has a `##` heading per feature, because regression chooses per heading.
  - A requirement says what its source says, and no more: no whole accessibility standard when the documents name a few rules. When they name none, the product owner is asked which target applies.
- **Readiness audit.** Check 13 looks for senders added since the last cycle. Its questions also go into `questions.md`, so reports find them.
- **The run.**
  - A run that stopped before its smoke suite runs it on resuming.
  - A `pemeriksa` that stopped before its deciding run starts again from the beginning.
  - `run/brief.md` stores staging's start time as a full timestamp, because a time of day breaks after midnight. It holds the quotas that agents share, each with a ledger written before a request is sent, so that a retry uses no second unit.
  - The run's files may exist while the cycle is still `planned` and waits for an entry criterion.
  - Questions for the QA engineer go to `run/handoff.md`, and questions for the product team to `questions.md`.
  - A candidate that an open question already describes joins that question without a `pemeriksa`.
  - A retest whose expected result a written new design replaced passes with the note "obsolete: new design", and the report proposes closing the card.
- **`scripts/hasil.mjs`.** It records results in `results.json` (`init`, `set`, `charter`, `retest`, `summary`). It refuses an unknown state, and a BLOCKED case without an owner, now stored in the new field `owner`.
- **Tests and evidence.**
  - Accessibility scans wait for content the client renders later, because an early scan passes falsely.
  - An expected result may be updated only from a product document or commit, marked `EXPECTED UPDATED`.
  - Element screenshots are the simplest way to avoid personal data. Masks behind an open dialog use CSS locators.
  - Agents run git in `source/` with `-c gc.auto=0`.
- **Reports.**
  - Image uploads set `disableConversionToGoogleType`, because Drive could turn a PNG into an empty Doc. Each upload's type and size is checked from its result.
  - Evidence cited by the cycle's new questions is uploaded too.
  - Cards get their ARI in the bug file next to the URL.
  - Every card in the retest list that was not retested is named, with the reason.
  - A retest that passed while its case fails on another bug says which.
  - The report notes newer commits on the branch that staging does not run yet. It groups open questions by who can answer them, the audit's included, and has sections for data left on staging and for evidence links.
  - Pauses between writes go in the same message as the write.

Products set up with 0.1.3 keep their files. Case files without `##` headings still work, but regression then chooses the whole file. Add headings per feature when you next plan.

## 0.1.3

Fixes from the first regression cycle on a real product: 93 cases, two retests that passed, and a staging that changed branch twice. None of them is specific to that product.

- **Regression picks by feature.**
  - `/qa:regresi` maps the diff to sections of a case file (`##` headings), not to whole areas, because one area file can hold several features.
  - Chosen cases that change a shared setting are listed apart and put to the QA engineer, with a time window.
- **Retests that the retest list misses.** `/qa:regresi` searches commit messages, merge messages and branch names between the two versions for bug numbers, and asks about a named bug whose card has not moved yet.
- **The branch staging runs.**
  - The readiness audit's version check now also checks that staging runs `branch`, by comparing something visible, such as an HTML attribute or an asset name, with each branch's code.
  - `/qa:regresi` stops when staging runs another branch.
- **Deploys during a check.**
  - The coordinator checks the version before every `pemeriksa` too, not only before every area.
  - The `pemeriksa` notes the version or uptime before and after its runs. It answers the new verdict STOPPED when it changed, instead of a misleading FLAKY.
- **Retests of a fix that prevents a step.** When a retest's step cannot be done because the product now prevents it, such as a field that stays disabled until the page is ready, and that is what the fix does, the retest is PASS.
- **Several login pages.** `tests/support/login.ts` holds a `loginPages` table: the `default` entry for `loginPath`, and one entry per other host, such as a back office.
- **Fewer logins.** `/qa:jalankan-uji` skips the `setup` project when it ran less than an hour ago, such as in the audit of the same `/qa:siklus`.
- **State that survives.**
  - The `penguji` and `pemeriksa` keep their notes in `cycles/<cycle>/run/`, never in a scratchpad.
  - The `penguji` writes `run/<area>-status.md` after each case that changes shared data, so an interrupted area can be restored.
  - `playwright.md` warns that Playwright empties `test-results/` at every run.
- **Restore with few writes.** Shared settings and content go back to their first values with as few writes as possible. Content whose published version did not change is never published again, because apps keep a permanent history.
- **Reports.**
  - `/qa:laporkan` uploads the evidence of bugs, retests, and FAIL and INCONCLUSIVE cases, not of every PASS case.
  - A recommendation states when staging already runs a newer version than the one tested.
- **Smaller fixes.**
  - Question IDs are matched as whole words, because `REQ-462` contains `Q-462`.
  - A cycle's short version is always 7 characters.
  - A case from another area may join the dispatch that tests the same feature.

Products set up with 0.1.2 keep their `login.ts`. To use the table, move its locators into a `loginPages` entry, as in the template.

## 0.1.2

Fixes from the first full cycle on a real product: 805 cases, 40 confirmed bugs, three sessions. None of them is specific to that product.

- **Test output no longer keeps passwords.**
  - The Playwright HTML report is gone from the template. It stored the value of every fill step, so the login setup wrote the shared accounts' passwords to disk.
  - The `setup` project records no trace, video or screenshot.
  - The workspace denies reading `playwright-report/`.
  - `safety.md` lists every place a typed value can stay: the HTML report, traces, videos, screenshots, `ariaSnapshot()` output and `error-context.md`.
  - The readiness audit's guardrail check now checks the Playwright config too. It fixes an older config and deletes an old report without opening it.
- **One login helper.** The new `tests/support/login.ts` holds the product's login steps, and `auth.setup.ts` calls it. It empties the password field after each attempt, so a failure snapshot cannot record it. After an HTTP 429 it pauses every login for 15 minutes, because a reached login limit can lock out other people on staging.
  - `playwright.md` describes the only two ways a spec may log in by itself: with an account the test created, using a password generated at runtime, or with a shared account when the QA engineer allowed it for the run.
  - Agents run the `setup` project once per run, and `--no-deps` after that.
- **Runs that outlast a conversation.** `/qa:jalankan-uji` keeps the run's state in `cycles/<cycle>/run/` and updates it after every area and every verdict, then commits:
  - `brief.md`: the decisions, permissions, data and rate limits every agent needs;
  - `candidates.md`: the bug candidates and their status;
  - `handoff.md`: where the run stands.

  `results.json` grows area by area. The same command, typed in a new session, continues a stopped run. The skill also checks the version before every area, because staging can be redeployed in the middle of a run.
- **Urgent bugs reach developers early.** `bugs.md` defines an urgent bug: Critical, or High because it exposes credentials or personal data, loses data or money, or stops testing. The `penguji` marks such candidates. The coordinator has them confirmed right after their area, and gives the QA engineer a message for the developers at once.
- **Cards during a run.** `/qa:laporkan` on a cycle that is still `running` creates the cards of bugs confirmed so far, and nothing else. The full report follows when the run ends.
- **Screenshots without people.**
  - Screenshots mask a shared test account's email and avatar, and real people's data, with Playwright's `mask` option.
  - The new `scripts/samarkan.mjs` paints black boxes over part of an existing PNG, using the workspace's own Playwright.
  - `/qa:laporkan` covers such parts instead of leaving the image out.
- **Smaller fixes.**
  - Agents never copy a secret they come across, such as keys on a Trello card. They tell the QA engineer where it is.
  - Google Docs made from HTML keep their numbering.
  - `/qa:rencanakan-uji` splits a large product across subagents and merges their IDs. It does not treat a word inside a quoted UI text as vague, and puts suspicions from code into charters.
  - `/qa:siapkan-produk` names the Google account that owns the Drive folder, and works on `.env.local.example` with file tools, since the deny rule blocks shell commands that name it.

Products set up with 0.1.1 keep their files. Run `/qa:audit-kesiapan <slug>` to bring the Playwright config and the deny rules up to date. To use `logIn` in specs, copy `tests/support/login.ts` from the templates, and fill in the locators from your `auth.setup.ts`.

## 0.1.1

Four fixes from the first run on a real product. None of them is specific to that product.

- **Server-rendered login pages.** `auth.setup.ts` waits for a new ready check, `{{PAGE_READY}}`, before it fills the form. A form used before it hydrates submits natively: the fields empty, and the password can land in the URL.
- **A password in a URL stops the login setup** as BLOCKED, with the URL redacted, and asks the QA engineer to change that test account's password. The new `tests/support/redact.ts` gives `redactUrl` and `urlHasSecret`. Probes print URLs only through `redactUrl`, and `/qa:laporkan` redacts URL queries in bug files, cards and reports.
- **Sessions that survive refresh-token rotation.** The new `tests/support/session.ts` fixture loads a role's saved session and writes it back after every test. Specs and probes import `test` from it and pick a role with `test.use({ role })`. Before, the second test that started from the same `.auth` file was logged out in apps that rotate their refresh token.
- **A `gh` account that cannot reach the product.** When the active `gh` account is another one, such as an agent account for `tiket` projects, the new `scripts/akun-git.sh` makes git use the QA engineer's own account per repository, and can clone with pushing disabled. The QA engineer runs it. `/qa:siapkan-produk` and `/qa:audit-kesiapan` give the command. Creating the workspace now asks for the QA engineer's own account.
- **Roles with their own login page,** such as a back office on another host, take an optional `loginURL` in `product.json`.

Workspaces made with 0.1.0 keep their files. To use the fixtures there, copy `tests/support/` from the templates and switch specs to `import { test, expect } from '../support/session'`.

## 0.1.0

The first version, with all three stages. Not validated end to end.

**Stage 1: setup and readiness**
- **New plugin `qa`** in the `jalankan-tiket` marketplace, for a QA engineer who tests web apps built by other teams.
- **`/qa:siapkan-produk`.** Creates a private QA workspace on the first run, then adds or completes one product:
  - a read-only clone of the product's repository, with pushing disabled;
  - `product.json`, which holds the staging URL, the allowed hosts, roles, side effects, and the Trello and Drive IDs;
  - a Playwright login setup that saves one session per role, so no password passes through the model;
  - a "QA – Perlu Ditinjau" / "QA – Needs review" list on the team's Trello board;
  - a product folder and an evidence folder on Google Drive.
- **`/qa:audit-kesiapan`.** Runs 15 readiness checks and ends in READY, READY WITH NOTES or BLOCKED. It writes `readiness.md`, publishes it as a Google Doc, and lists questions for the product team.

**Stage 2: planning and running**
- **`/qa:rencanakan-uji`.** Writes requirements with stable IDs, questions for gaps, risk scores (impact × likelihood → P1 to P3), the critical flows, test cases designed with ISTQB techniques, exploratory charters and a traceability matrix. It opens a test cycle and publishes the test plan as a Google Doc.
- **`/qa:jalankan-uji`.** Checks the entry criteria, runs the smoke suite first, hands each area to the `penguji` agent one at a time, and has every bug candidate and every retest reproduced by the `pemeriksa` agent. Only 3-of-3 reproductions become bugs.
- **Agents `penguji` and `pemeriksa`.**
- **Probes:** short `.probe.ts` specs, run in their own Playwright project, for exploratory sessions and reproductions.

**Stage 3: reporting and regression**
- **`/qa:laporkan`.** Checks every screenshot for secrets before it uploads it to Drive, creates one Trello card per confirmed bug in the review list (or comments on an existing card), comments retest results, and publishes a test report with a NO-GO, GO WITH CONDITIONS or GO recommendation.
- **`/qa:regresi`.** Chooses regression tests from the diff since the last reported cycle, the critical flows and the bugs waiting for a retest, and opens a regression cycle.
- **`/qa:siklus`.** Runs the commands that are due in order, and stops only for decisions.

**Guardrails**
- Permission rules deny reading `.env.local` and `.auth/`, and deny every `gh` write to issues and PRs.
- `playwright.config.ts` stops when the base URL's host is not in `allowedHosts`.
- Tests run with one worker and no retries.

**Pinned tools:** `@playwright/test` 1.65.1 and `@axe-core/playwright` 4.14.0.
