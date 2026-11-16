---
name: jalankan-uji
description: Run a product's planned test cases and exploratory charters against staging through the penguji agent, confirm every bug candidate through the pemeriksa agent, and record each result with evidence in the test cycle.
disable-model-invocation: true
---

# Run the tests

You are the coordinator of one test run. You check the entry criteria, run the smoke suite, hand each area to the `penguji` agent, have every bug candidate confirmed by the `pemeriksa` agent, and record the results in the cycle. You never change the product, its repository or data that QA did not create.

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
- Read the cases and charters in `products/<slug>/cases/`. When `cycle.json` lists `cases`, only those are in the run, as `/qa:regresi` chose them. Then apply the filter.
- When `cycle.json` lists `retest`, those bugs are retested in step 5.

## 2. Check the entry criteria

1. **Staging answers:** the same `curl` as check 4 of the readiness audit.
2. **Sessions:** `npx playwright test -c products/<slug> --project=setup`. A role that fails or is skipped makes every case of that role BLOCKED, with the reason.
3. **Version:** when staging now shows a version other than the cycle's, stop and ask the QA engineer, in the format of `questions.md`: continue in this cycle, or plan a new cycle with `/qa:rencanakan-uji` (recommended, because results from two versions do not mix).
4. **Side effects:** mark every case that triggers an `unknown` or `real` channel as BLOCKED, naming the channel.
5. **Open questions:** mark every case linked to an open question in `questions.md` as BLOCKED, naming the question.

Set `status` in `cycle.json` to `running`.

## 3. Smoke first

Unless the filter excludes it, dispatch the `penguji` agent for the area `smoke` first. When a smoke case fails and the pemeriksa confirms it, the entry criteria are not met: record the results so far, skip the other areas, and go to step 6.

## 4. Hand out the areas

Dispatch the `penguji` agent once per area in the filter, **one area at a time**, because staging is shared. Start with the areas that hold P1 cases. Give each dispatch:
- the product slug, the cycle ID and the area;
- the case IDs to cover, without the ones already BLOCKED in step 2;
- the charter IDs of that area.

After each report:
- record every result;
- add every question to `questions.md` with the next free `Q-` number, and mark the cases it affects as BLOCKED;
- queue every bug candidate for step 5.

## 5. Confirm the bug candidates, and retest

**Retests first.** For each bug in `retest`, dispatch the `pemeriksa` agent with the bug file as the candidate. Its verdict means:
- **NOT REPRODUCED,** with every step followed: the fix holds. The retest is PASS.
- **CONFIRMED:** the bug is still there. The retest is FAIL, and the bug file gets a line under Notes with the cycle and the version.
- **FLAKY,** or steps that could not be followed: the retest is INCONCLUSIVE, with the reason.

**Then the new candidates:**

1. **Merge duplicates first:** candidates with the same symptom on the same page or endpoint become one candidate that links every case.
2. Dispatch the `pemeriksa` agent once per candidate, one at a time.
3. Act on its verdict:
   - **CONFIRMED,** with the expected result supported by its source: write `cycles/<cycle>/bugs/BUG-<nnn>.md` from `templates/<language>/cycle/bug.md`. Numbers run across the whole product: take the next one after the highest in any cycle of this product. Set the severity and priority as `bugs.md` describes, each with its reason. The cases it links are FAIL.
   - **CONFIRMED,** but the source does not support the expected result: a question in `questions.md`. The cases are BLOCKED.
   - **FLAKY:** the cases are INCONCLUSIVE, with the count.
   - **NOT REPRODUCED:** the cases are INCONCLUSIVE, with the pemeriksa's reason.

## 6. Record the results

1. Write `cycles/<cycle>/results.json` as `workspace.md` describes, including `retests`. A case run earlier in this cycle keeps only its newest result. Git keeps the history.
2. Fill `templates/<language>/cycle/results.md` into `cycles/<cycle>/results.md`: the counts per state, every confirmed bug, every INCONCLUSIVE and BLOCKED case with its reason and who can resolve it, every case, and a short summary of each charter's log.
3. Check the exit criteria from the test plan, or from section 8 of `test-design.md`, and write which ones are met.
4. Set `status` in `cycle.json` to `executed`.
5. Commit the specs, probes, cases, `questions.md`, results and bug files, with a message in the workspace language that means "Test run <name> <cycle>", then `git push`. Evidence stays out of git; `/qa:laporkan` uploads it to Drive.

## 7. Report

Tell the QA engineer, in plain words:
- the counts per state, and whether the exit criteria are met;
- each confirmed bug: number, severity, priority and title;
- what is INCONCLUSIVE or BLOCKED, and who can resolve it;
- new questions to forward;
- the next step. When `${CLAUDE_PLUGIN_ROOT}/skills/laporkan/SKILL.md` exists, name `/qa:laporkan <slug>`, which creates the Trello cards and the report. Otherwise point to `cycles/<cycle>/results.md` and the bug files.
