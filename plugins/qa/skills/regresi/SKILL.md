---
name: regresi
description: After a new release reaches staging, choose the regression tests from the code diff since the last reported cycle, the critical flows, and the bugs waiting for retest, then open a regression cycle for /qa:jalankan-uji.
disable-model-invocation: true
---

# Choose a regression run

A new version is on staging. You decide what to test again, and why, so that a release never means "test everything from the start" and never means "test only what changed". You open a regression cycle; `/qa:jalankan-uji` runs it. The QA engineer may name the product after the command, such as `/qa:regresi toko-buku`.

Read these first:
- `${CLAUDE_PLUGIN_ROOT}/reference/test-design.md`, sections 2 and 4;
- `${CLAUDE_PLUGIN_ROOT}/reference/workspace.md`, on `cycle.json`;
- `${CLAUDE_PLUGIN_ROOT}/reference/connectors.md`.

## 1. Find the two versions

- Run from the workspace root. Read `language` from `qa-workspace.json`.
- Pick the product as `/qa:audit-kesiapan` does.
- **The old version:** the `version` of the newest cycle whose `status` is `reported`. When there is none, stop: a regression run needs a reported cycle to compare with. Point to `/qa:rencanakan-uji <slug>`.
- **The new version:** run `git -C products/<slug>/source pull --ff-only`, then read the version staging shows, as check 6 of the readiness audit does, or the newest commit on `branch`.
- **The branch staging runs.** Staging can move to another branch without notice, such as a hotfix branch or `main` for a while. When staging shows no version, check its branch as check 6 of the readiness audit describes. When staging runs another branch than `branch`, stop and ask the QA engineer. Once they confirm, change `branch` in `product.json` and check that branch out in `source/`. A diff from the wrong branch chooses the wrong cases.
- When both are the same, nothing new reached staging. Offer a retest-only cycle when bugs wait for retest, and stop otherwise.

## 2. Read the change

- `git -C products/<slug>/source log --oneline <old>..<new>` and `git -C products/<slug>/source diff --stat <old>..<new>`.
- Map every changed file to a **section** of a case file, a `##` heading in `cases/<area>.md`, through the code paths that the requirements and cases cite. One area file can hold several features, and a small change to one of them does not touch the others. An area file without `##` headings counts as one section; recommend adding headings per feature with `/qa:rencanakan-uji`, because such a file pulls in every case.
- Tell apart **a change of behaviour** from **a cosmetic change in a shared component**, such as a new accessible name in a table's pagination that every list page uses. A change of behaviour touches every section that uses it. A cosmetic change touches only the cases that check that very thing, such as the accessibility case of each page. A change you cannot judge, such as a database migration or a dependency upgrade, counts as a change of behaviour. Find the users of a shared file with `grep` in `source/`.
- **A large diff,** with more than about a hundred changed files outside the tests, does not fit in your own reading. Hand the mapping to a subagent with the case files and the rules above, and have it write `cycles/<cycle>/run/diff-map.md`: every changed file, its sections, and whether the change is behaviour or cosmetic.
- Note **new behaviour:** new routes, pages, endpoints, fields or statuses that no requirement covers yet.
- Note **new outward channels and new preconditions:** code that starts sending email, messages or webhooks, such as `git -C products/<slug>/source diff --stat <old>..<new> | grep -iE 'mail|smtp|notif|queue|webhook'`, and changes that make a flow need something tests cannot provide, such as sign-up that now needs a link from an email. Each one is a question for the QA engineer before the run, because it can block many cases at once.

## 3. Choose

1. **Always:** every case of the `smoke` area.
2. **Changed sections:** every P1 and P2 case of each section the change touches, and the P3 cases whose page or rule changed directly. A chosen case that changes a shared setting, such as a store's opening hours, a payment channel or a feature switch, affects everyone on staging. List those cases apart, and ask the QA engineer whether to run them and in which time window. When the QA engineer chooses not to run a P1 case, say in the same question that a P1 case NOT RUN makes the report NO-GO. Offer instead to record it as BLOCKED, with the precondition that would make it safe, such as a second test product, and who can provide it.
3. **Retests:** the bugs waiting for one.
   - Read the cards in `retestListId` with `trelloReadCard`, and the bug files whose card is in that list. When `retestListId` is `null`, ask the QA engineer which bugs the developers marked as fixed.
   - Search the commits between the two versions for bug numbers too: commit messages, merge messages and branch names, such as `hotfix/bug-002-…` or `fix BUG-012`. A bug named there whose card is still elsewhere may be fixed already: ask the QA engineer whether to retest it.
   - The other way round: for each card in the retest list, find its fix with `git -C products/<slug>/source -c gc.auto=0 log --all --oneline -i --grep '<bug number>'`. When the fix exists only on a branch that the new version does not contain yet, the retest would fail for certain. Ask the QA engineer whether to leave it out of this cycle, and name it in the selection.
   - Add the cases each bug links.
4. **New behaviour:** list it as a gap. Write one exploratory charter per new page or flow in `cases/eksplorasi.md` / `cases/exploratory.md`, with the next free `EX-` number after checking the file for IDs already used, and recommend `/qa:rencanakan-uji <slug>` afterwards to give it requirements and cases.
5. **Cases whose expected result a new design replaced,** such as a message the product now words on purpose in another way: name them, with the product document or commit that sets the new behaviour. `/qa:jalankan-uji` updates their expected result from that source, and `/qa:rencanakan-uji` rewrites them later.
6. **Not chosen:** P1 cases of untouched areas are not chosen by default. Name them in the selection, so the QA engineer can add them when the release is risky.

## 4. Open the regression cycle

Ask every question of steps 1 to 3 in one round, in the format of `questions.md`. Mapping a large diff takes a while, so check the version and the uptime again, as check 6 of the readiness audit does, right before you open the cycle.

1. Copy `templates/<language>/cycle/regression.md` into `products/<slug>/cycles/<cycle>/regression.md`, with the cycle ID from the new version as `test-design.md` describes. Fill in both versions, the commits, the changed areas, and every chosen case and charter with its reason, followed by the cases not chosen.
2. Write `cycle.json` with `status` `planned`, `scope` `regression`, `previousCycle`, `cases` and `retest`.
3. Commit with a message in the workspace language that means "Regression plan <name> <cycle>", then `git push`.

## 5. Report

Tell the QA engineer, in plain words:
- the two versions, and the changed areas;
- how many cases were chosen, per reason, and how many retests;
- the new behaviour without cases;
- the P1 cases not chosen, in case they want to add any;
- the next step: `/qa:jalankan-uji <slug>`.
