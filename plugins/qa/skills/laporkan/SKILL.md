---
name: laporkan
description: Publish a test cycle's results - evidence to Google Drive, one Trello card per confirmed bug in the review list, retest comments on existing cards, and a Google Docs test report with a Go/No-Go recommendation. On the QA engineer's yes, moves retested cards along the team's lists. During a run, creates the cards of bugs confirmed so far.
disable-model-invocation: true
---

# Report a test cycle

You publish one cycle's results where the team reads them. You write to the team's Trello board and the QA engineer's Google Drive, and nowhere else. The QA engineer may name the product and the cycle after the command, such as `/qa:laporkan toko-buku 2026-03-02-a1b2c3d`.

Read these first, and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/reference/connectors.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/bugs.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/evidence.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/safety.md`, on credentials in evidence and on pace.

## 1. Find the cycle

- Run from the workspace root. Read `language` from `qa-workspace.json`; every message, card and document uses it.
- Pick the product as `/qa:audit-kesiapan` does, and the named cycle, or the newest one whose `status` is `running`, `executed` or `reported`. When there is none, stop and point to `/qa:jalankan-uji <slug>`.
- **A cycle that is still `running` gets an early report.** It is meant for urgent bugs, and for long runs where developers should start on confirmed bugs before the run ends. Do steps 2 and 3 only, for the bug files that have no card yet. Skip steps 4 to 7 and leave `status` as it is. In step 8, commit only the bug files, with a message that means "Bug cards <name> <cycle>". The run may be committing in the same folder, so add the bug files by name. The full report follows once the run has ended.
- Read `cycle.json`, `results.json`, `results.md` and every file in `bugs/`. A cycle that is still running has no `results.md` yet.
- Check that the Trello and Drive connectors work: `trelloReadBoard` (`get`) on `boardId`, and `get_file_metadata` on `evidenceFolderId`. A missing connector makes its part BLOCKED. Do the other parts and report it.

## 2. Check and upload the evidence

1. List the evidence to share, in `cycles/<cycle>/evidence/`: what the bug files cite, the evidence of retests and of FAIL and INCONCLUSIVE cases in `results.json`, and what the cycle's new questions cite, because the product team decides those questions from it. The evidence of PASS cases stays on the machine; the report counts them.
2. **Look at every image** before it leaves the machine. When one shows a password, a token, a full card number, a shared test account's email or avatar, or a real person's personal data, do not upload it as it is. Cover that part with `node ${CLAUDE_PLUGIN_ROOT}/scripts/samarkan.mjs <in.png> <out.png> <x,y,width,height> …` and upload the covered copy, retake it with a probe that uses `mask`, or leave it out and say so in the bug.
3. Create a subfolder named after the cycle in `evidenceFolderId`, unless it exists. Upload each file into it with `create_file`, as `connectors.md` describes, and check each result as it comes back: the type is `image/png` and the size matches the local file. Do not search the folder afterwards to check: a search returns every file's details and fills your context. Wait at least 10 seconds between two uploads.
4. Replace the file names in each bug file's Evidence section with their Drive links.
5. **Check the text too.** Every URL in a bug file, a card or the report has its query values replaced by `REDACTED`, as `redactUrl` does, unless a value is needed to reproduce the bug and is not a secret.

Never upload traces, `test-results/` folders, `error-context.md` files or anything from `.auth/`.

## 3. Bug cards

For each bug file whose Trello card is still a dash:
1. **Look for an existing card** on the board about the same symptom (`trelloSearch` with `search_cards`, `boardIds` and the key words of the title).
   - **One exists and is open:** add a comment with the cycle, the version and the link to the new evidence. Put that card's URL and ARI in the bug file.
   - **Otherwise:** create a card in `reviewListId` with `trelloWriteCard` (`create`). Its name is the bug's title. Its description is the bug file's content, in Markdown, with the Drive links. Attach a board label that matches the severity, when one exists. Put the new card's URL and ARI in the bug file: a comment later needs the ARI.
2. Wait at least 10 seconds between two writes.

## 4. Retest comments

For each entry in `retests` of `results.json`, add a comment to the bug's card: the cycle, the version, and the result in plain words, such as "Retest LULUS di versi a1b2c3d: tidak muncul lagi dalam 3 dari 3 percobaan" in an Indonesian workspace.
- A retest that passed with the note "obsolete: new design" says so, names the source, and proposes closing the card rather than treating it as fixed.
- When a retest passed but a case it links still fails on another bug, say which bug, so nobody reads it as the fix failing.

Then read the cards in `retestListId`. Name every card there that this cycle did not retest, in the report and in a comment on the card, with the reason, such as a fix that is only on a branch the tested version does not contain.

Leave moves out of these comments, such as "QA did not move this card": step 7 offers them after the report.

## 5. The test report

1. **Recommendation.** It is a recommendation; the team decides.
   - **NO-GO** when any of these holds: a confirmed Critical bug is open; a confirmed High bug is open on a critical flow; the smoke suite failed; a P1 case is NOT RUN.
   - **GO WITH CONDITIONS** when a confirmed High bug is open outside the critical flows, or a P1 case is BLOCKED or INCONCLUSIVE with a known owner. Name each condition.
   - **GO** otherwise.

   Use the workspace language: `NO-GO`, `GO DENGAN SYARAT` / `GO WITH CONDITIONS`, `GO`.

   The recommendation is about the version this cycle tested. Check whether something newer exists: the version or uptime staging shows now, and newer commits on `branch` with `git -C products/<slug>/source -c gc.auto=0 fetch` and `log <version>..origin/<branch>`. When staging already runs a newer version, or the branch holds commits that staging does not run yet, say so next to the recommendation: it does not cover them, and they need their own cycle.

   When a P1 case is NOT RUN because the QA engineer decided so in writing, ask them, before you write the recommendation, whether it is rather BLOCKED, with the precondition that would make it safe and who can provide it, as `/qa:regresi` offers. Change its state only on their answer, with `hasil.mjs`. Never change it on your own to soften the recommendation.
2. Fill `templates/<language>/cycle/test-report.html`:
   - the recommendation and its reasons;
   - the counts per state, and the exit criteria;
   - the bugs with their severity, priority and card links;
   - the retests;
   - what is INCONCLUSIVE or BLOCKED, and who can resolve it;
   - requirement coverage: requirements with an executed case, against all;
   - highlights from the exploratory logs;
   - the open questions, grouped by who can answer them: the product owner, the developers, and the QA engineer. Include the readiness audit's questions;
   - data the run left on staging for good, such as messages, history entries or suspended accounts, and what was restored;
   - links to the evidence;
   - the next steps.
3. When the Drive connector works, create it as a Google Doc named `Laporan uji – <name> – <cycle>` (`Test report – <name> – <cycle>` in English) in `folderId`. Store its link in `cycle.json` as `reportDocUrl`. When the cycle already has a report Doc, append a dated section to it with `update_doc`, as `connectors.md` describes, instead of creating a second one.

## 6. Keep the regression list alive

When a confirmed Critical or High bug sits in a flow that is not in the critical flows of `risks.md`, propose adding that flow to the list in the report to the QA engineer. Change `risks.md` only when they agree.

## 7. Move retested cards

A retest decides where its card belongs in the team's flow. Moving a card is a write that developers see, so it waits for the QA engineer's yes.

1. **Propose.** Read the board's lists with `trelloReadList` (`list_by_board`), and each retested card's current list with `trelloReadCard` (`get`). Propose:
   - a retest that passed: to `retestPassedListId`;
   - a retest that failed: to `retestFailedListId`.

   No move for:
   - a retest that passed with the note "obsolete: new design": the team decides whether to close the card;
   - a retest that is BLOCKED, INCONCLUSIVE or NOT RUN;
   - a card that is already in its target list;
   - a passed card that sits in a list to the right of its target on the board (a higher `position`), such as one for released work;
   - a target that is `"none"`.
2. **Ask** in one round, in the format of `questions.md`: each card with its bug number, its current list and its target list.
   - When a target key is `null` or missing, add a question for it in the same round. Offer the board's lists. For passed retests, recommend the list right after `retestListId`, such as a UAT list. For failed retests, recommend the list the developers work from. `"none"` is also an answer.
   - Write each answer into `product.json`.
3. **Move** only the cards the QA engineer agreed to, with `trelloWriteCard` (`move`, `pos` `bottom`).
   - Read the card's list again right before you move it. When someone has moved it since step 1, leave it and say so.
   - Wait at least 10 seconds between two writes.

Never close or archive a card. Never move a new bug card out of `reviewListId`: the QA engineer reviews it first.

## 8. Save and report

1. Set `status` in `cycle.json` to `reported`. Commit the bug files, `cycle.json`, `results.md`, and `product.json` when step 7 changed it, with a message in the workspace language that means "Report <name> <cycle>", then `git push`.
2. Tell the QA engineer, in plain words:
   - the recommendation, the report link, the cards created or commented on, and the cards moved after their retest, with their new list;
   - their one manual step: review the cards in the review list and move each to the developers' list;
   - what was BLOCKED, such as a missing connector or evidence left out;
   - a short message they can paste into the team's chat, in the workspace language: the recommendation, the bug count per severity, and the report link.
