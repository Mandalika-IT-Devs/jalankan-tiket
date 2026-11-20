---
name: jalankan-uji
description: Run a product's planned test cases and exploratory charters against staging through the penguji agent, confirm every bug candidate through the pemeriksa agent, and record each result with evidence in the test cycle. Continues a run that stopped, from the state kept in the cycle folder.
disable-model-invocation: true
---

# Run the tests

You are the coordinator of one test run. You check the entry criteria, run the smoke suite, hand each area to the `penguji` agent, have every bug candidate confirmed by the `pemeriksa` agent, and record the results in the cycle. You never change the product, its repository or data that QA did not create.

A run over many areas can outlast one conversation. Its state therefore lives in the cycle folder, in `run/` and `results.json`, and the same command continues a run that stopped.

The QA engineer may name the product and a filter after the command:
- `/qa:jalankan-uji toko-buku` runs every case and charter of the open cycle;
- `smoke`, `P1`, area names such as `kasir`, case IDs such as `TC-KASIR-004`, or `eksplorasi` / `exploratory` limit the run.

Read these first, and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/reference/safety.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/evidence.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/bugs.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/test-design.md`, section 8 on exit criteria;
- `${CLAUDE_PLUGIN_ROOT}/reference/workspace.md`, on `cycle.json` and `results.json`.

## 1. Find the cycle

- Run from the workspace root. Read `language` from `qa-workspace.json`; every message and file uses it.
- Pick the product as `/qa:audit-kesiapan` does.
- Pick the newest cycle in `products/<slug>/cycles/` whose `status` is `planned`, `running` or `executed`. When there is none, stop and point to `/qa:rencanakan-uji <slug>`, or `/qa:regresi <slug>` after a release.
- **A run that stopped.** When the cycle is `running` and `cycles/<cycle>/run/handoff.md` exists, continue that run instead of starting over. Read `run/handoff.md`, `run/brief.md`, `run/candidates.md` and `results.json`. Skip the areas and the verdicts that are done. In step 2, run the `setup` project only for roles whose session has ended. Run the smoke suite of step 3 unless `results.json` shows it already passed on this version: a run can stop before its smoke suite, for example while it waits for an answer about the build. A `pemeriksa` that stopped before its deciding run is dispatched again from the start, not continued.
- Read the cases and charters in `products/<slug>/cases/`. When `cycle.json` lists `cases`, only those are in the run, as `/qa:regresi` chose them. Then apply the filter.
- When `cycle.json` lists `retest`, those bugs are retested in step 5.

## 2. Check the entry criteria

1. **Staging answers:** the same `curl` as check 4 of the readiness audit.
2. **Sessions:** `npx playwright test -c products/<slug> --project=setup`, once for the whole run. Skip it when it ran less than an hour ago, such as in the readiness audit of the same `/qa:siklus`: a role whose session has ended shows up as BLOCKED in the first area, and then gets one new login. The agents run with `--no-deps` after that, because every login counts against the app's rate limit. A role that fails or is skipped makes every case of that role BLOCKED, with the reason.
3. **Version:** when staging now shows a version other than the cycle's, stop and ask the QA engineer, in the format of `questions.md`: continue in this cycle, or plan a new cycle with `/qa:rencanakan-uji` (recommended, because results from two versions do not mix).
4. **Side effects:** mark every case that triggers an `unknown` or `real` channel as BLOCKED, naming the channel.
5. **Open questions:** mark every case linked to an open question in `questions.md` as BLOCKED, naming the question. Match question IDs as whole words, such as `\bQ-\d{3}\b`: a requirement ID like `REQ-462` contains `Q-462`.

Write `cycles/<cycle>/run/brief.md`: what every `penguji` and `pemeriksa` of this run needs beyond its own area.
- **The version under test,** and how to read it from staging. When a health endpoint shows an uptime, write the time staging started as a full timestamp with its offset, such as `2026-03-02T13:42:25+07:00`. A time of day alone breaks after midnight.
- **The QA engineer's decisions and permissions** for this run. When a decision leaves out a P1 case, warn at once that a P1 case NOT RUN makes the report NO-GO, and offer to record it as BLOCKED instead, with the precondition that would make it safe and who can provide it.
- **The data** that may be used or changed, and how to restore it.
- **The rate limits** you know of, and the channels that block cases.
- **Quotas the agents share,** such as "two sign-up emails for the whole run" or "five chat messages per role". Each quota gets a ledger file in `run/`. An agent writes the request's key to the ledger before it sends the request, so that a retry of the same request does not use up a second unit.

Add to it whenever the QA engineer decides something during the run. When an entry criterion waits for an answer, such as which build staging runs, the run's files may already exist while `status` stays `planned`. Set `status` in `cycle.json` to `running` once the criteria are met.

## 3. Smoke first

Unless the filter excludes it, dispatch the `penguji` agent for the area `smoke` first. When a smoke case fails and the pemeriksa confirms it, the entry criteria are not met: record the results so far, skip the other areas, and go to step 6.

## 4. Hand out the areas

Dispatch the `penguji` agent once per area in the filter, **one area at a time**, because staging is shared. Start with the areas that hold P1 cases.

**Before each dispatch** of a `penguji` or a `pemeriksa`, check the version again, as in step 2.3, with the uptime of a health endpoint where there is one. Staging can be redeployed in the middle of a run, such as an API that restarts with a newer build. Results from two versions do not mix, so stop and ask as step 2.3 does.

A case that the change put in this run from another area, such as one back-office case about a store page, may join the dispatch of the area that tests the same feature. Write the reason in `run/handoff.md`. One agent for one case costs more than it gives.

Give each dispatch:
- the product slug, the cycle ID and the area;
- the case IDs to cover, without the ones already BLOCKED in step 2;
- the charter IDs of that area;
- the path of `run/brief.md`.

After each report:
1. Record every result in `results.json` with `node ${CLAUDE_PLUGIN_ROOT}/scripts/hasil.mjs`, as `workspace.md` describes. The newest result of a case wins. A BLOCKED case names who can unblock it; the script refuses one that does not.
2. Sort the questions. A question for the product team goes into `questions.md` with the next free `Q-` number, and the cases it affects are BLOCKED. A question for the QA engineer, such as a permission for one more message or a time window, goes under "Waiting for the QA engineer" in `run/handoff.md`, and you ask it in the next round of questions.
3. Add every bug candidate to `run/candidates.md`, with its draft and the status `waiting`.
4. Send every candidate marked `URGENT` to the `pemeriksa` agent now, as "Urgent candidates" below describes.
5. Update `run/handoff.md`, then commit the specs, probes, `questions.md`, `results.json` and `run/` with a message in the workspace language that means "Progress <name> <cycle>: <area>", and `git push`.

### Urgent candidates

A candidate that fits "Urgent bugs" in `bugs.md` does not wait for step 5. Confirm it with the `pemeriksa` agent right after the area's report, and act on the verdict as step 5 describes. When it is CONFIRMED, tell the QA engineer at once, before the next area:
- the bug number, severity, priority and title;
- a short message they can paste to the developers, in the workspace language: the symptom, the page, short steps, the impact, and a general direction for the fix. Every URL is redacted, and no credential appears;
- that `/qa:laporkan <slug>` can create its Trello card now, while this run goes on.

### Keep the run resumable

Keep every piece of the run's state in the cycle folder, never in `/tmp` or a scratchpad: a session can end, and a computer can shut down. `run/handoff.md` holds what a new session needs to continue:
- the areas done, and the areas left in order, with their case and charter IDs;
- the candidates still waiting for the pemeriksa;
- data to clean up or restore, and changes that cannot be undone;
- when the last logins happened, for the rate limits;
- the questions waiting for the QA engineer.

When the conversation grows long, finish the current area or verdict, update `run/handoff.md`, commit, and tell the QA engineer to open a new session in the workspace and type `/qa:jalankan-uji <slug>` there.

## 5. Confirm the bug candidates, and retest

**Retests first.** For each bug in `retest`, dispatch the `pemeriksa` agent with the bug file as the candidate. Its verdict means:
- **NOT REPRODUCED,** with every step followed: the fix holds. The retest is PASS.
- **NOT REPRODUCED, because the product now prevents a step,** such as a field that stays disabled until the page is ready: when that prevention is what the fix does, the retest is PASS, with the observation. Read the fix's commit to judge it.
- **CONFIRMED:** the bug is still there. The retest is FAIL, and the bug file gets a line under Notes with the cycle and the version.
- **NOT REPRODUCED, because a new design replaced the expected result,** such as a generic answer that now replaces the message the bug asked for, on purpose and written in a product document or commit: the retest is PASS, with the note "obsolete: new design" and its source. The report proposes closing the card, not moving it as fixed, and rewriting the requirement.
- **FLAKY,** or steps that could not be followed for another reason: the retest is INCONCLUSIVE, with the reason.
- **STOPPED:** staging changed version during the check. Nothing is concluded. Ask the QA engineer as step 2.3 does, then run the check again on the version you continue with.

**Then the new candidates:**

1. **Merge duplicates first:** candidates in `run/candidates.md` with the same symptom on the same page or endpoint become one candidate that links every case. A candidate that an open question in `questions.md` already describes joins that question instead, without a `pemeriksa`.
2. Dispatch the `pemeriksa` agent once per candidate, one at a time, with the path of `run/brief.md`. Candidates that change shared settings, such as a feature switch or a store's opening hours, wait for a time the QA engineer chooses.
3. Act on its verdict:
   - **CONFIRMED,** with the expected result supported by its source: write `cycles/<cycle>/bugs/BUG-<nnn>.md` from `templates/<language>/cycle/bug.md`. Numbers run across the whole product: take the next one after the highest in any cycle of this product. Set the severity and priority as `bugs.md` describes, each with its reason. The cases it links are FAIL.
   - **CONFIRMED,** but the source does not support the expected result: a question in `questions.md`. The cases are BLOCKED.
   - **FLAKY:** the cases are INCONCLUSIVE, with the count.
   - **NOT REPRODUCED:** the cases are INCONCLUSIVE, with the pemeriksa's reason.
   - **STOPPED:** staging changed version during the check. Handle it as for a retest.
4. After each verdict, set the candidate's status in `run/candidates.md`, update `results.json` and `run/handoff.md`, and commit with the bug file.

## 6. Record the results

1. Complete `cycles/<cycle>/results.json` as `workspace.md` describes, including `retests`. A case run earlier in this cycle keeps only its newest result. Git keeps the history.
2. Fill `templates/<language>/cycle/results.md` into `cycles/<cycle>/results.md`: the counts per state, every confirmed bug, every INCONCLUSIVE and BLOCKED case with its reason and who can resolve it, every case, and a short summary of each charter's log.
3. Check the exit criteria from the test plan, or from section 8 of `test-design.md`, and write which ones are met.
4. Set `status` in `cycle.json` to `executed`.
5. Commit the specs, probes, cases, `questions.md`, results, bug files and `run/`, with a message in the workspace language that means "Test run <name> <cycle>", then `git push`. Evidence stays out of git; `/qa:laporkan` uploads it to Drive.

## 7. Report

Tell the QA engineer, in plain words:
- the counts per state, and whether the exit criteria are met;
- each confirmed bug: number, severity, priority and title;
- what is INCONCLUSIVE or BLOCKED, and who can resolve it;
- new questions to forward;
- the next step: `/qa:laporkan <slug>`, which creates the remaining Trello cards and the report. Recommend typing it in a new session when this conversation is long.
