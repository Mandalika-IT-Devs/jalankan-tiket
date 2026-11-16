---
name: laporkan
description: Publish a test cycle's results - evidence to Google Drive, one Trello card per confirmed bug in the review list, retest comments on existing cards, and a Google Docs test report with a Go/No-Go recommendation.
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
- Pick the product as `/qa:audit-kesiapan` does, and the named cycle, or the newest one whose `status` is `executed` or `reported`. When there is none, stop and point to `/qa:jalankan-uji <slug>`.
- Read `cycle.json`, `results.json`, `results.md` and every file in `bugs/`.
- Check that the Trello and Drive connectors work: `trelloReadBoard` (`get`) on `boardId`, and `get_file_metadata` on `evidenceFolderId`. A missing connector makes its part BLOCKED. Do the other parts and report it.

## 2. Check and upload the evidence

1. List the evidence that the bug files and `results.json` cite, in `cycles/<cycle>/evidence/`.
2. **Look at every image** before it leaves the machine. When one shows a password, a token, a full card number or a real person's personal data, do not upload it: crop or retake it with a probe, or leave it out and say so in the bug.
3. Create a subfolder named after the cycle in `evidenceFolderId`, unless it exists. Upload each file into it with `create_file`, as `connectors.md` describes. Wait at least 10 seconds between two uploads.
4. Replace the file names in each bug file's Evidence section with their Drive links.
5. **Check the text too.** Every URL in a bug file, a card or the report has its query values replaced by `REDACTED`, as `redactUrl` does, unless a value is needed to reproduce the bug and is not a secret.

Never upload traces, `test-results/` folders or anything from `.auth/`.

## 3. Bug cards

For each bug file whose Trello card is still a dash:
1. **Look for an existing card** on the board about the same symptom (`trelloSearch` with `search_cards`, `boardIds` and the key words of the title).
   - **One exists and is open:** add a comment with the cycle, the version and the link to the new evidence. Put that card's URL in the bug file.
   - **Otherwise:** create a card in `reviewListId` with `trelloWriteCard` (`create`). Its name is the bug's title. Its description is the bug file's content, in Markdown, with the Drive links. Attach a board label that matches the severity, when one exists. Put the new card's URL in the bug file.
2. Wait at least 10 seconds between two writes.

## 4. Retest comments

For each entry in `retests` of `results.json`, add a comment to the bug's card: the cycle, the version, and the result in plain words, such as "Retest LULUS di versi a1b2c3d: tidak muncul lagi dalam 3 dari 3 percobaan" in an Indonesian workspace. Never move or close a card. The QA engineer and the developers do that.

## 5. The test report

1. **Recommendation.** It is a recommendation; the team decides.
   - **NO-GO** when any of these holds: a confirmed Critical bug is open; a confirmed High bug is open on a critical flow; the smoke suite failed; a P1 case is NOT RUN.
   - **GO WITH CONDITIONS** when a confirmed High bug is open outside the critical flows, or a P1 case is BLOCKED or INCONCLUSIVE with a known owner. Name each condition.
   - **GO** otherwise.

   Use the workspace language: `NO-GO`, `GO DENGAN SYARAT` / `GO WITH CONDITIONS`, `GO`.
2. Fill `templates/<language>/cycle/test-report.html`:
   - the recommendation and its reasons;
   - the counts per state, and the exit criteria;
   - the bugs with their severity, priority and card links;
   - the retests;
   - what is INCONCLUSIVE or BLOCKED, and who can resolve it;
   - requirement coverage: requirements with an executed case, against all;
   - highlights from the exploratory logs;
   - open questions, and the next steps.
3. When the Drive connector works, create it as a Google Doc named `Laporan uji – <name> – <cycle>` (`Test report – <name> – <cycle>` in English) in `folderId`. Store its link in `cycle.json` as `reportDocUrl`. When the cycle already has a report Doc, append a dated section to it with `update_doc`, as `connectors.md` describes, instead of creating a second one.

## 6. Keep the regression list alive

When a confirmed Critical or High bug sits in a flow that is not in the critical flows of `risks.md`, propose adding that flow to the list in the report to the QA engineer. Change `risks.md` only when they agree.

## 7. Save and report

1. Set `status` in `cycle.json` to `reported`. Commit the bug files, `cycle.json` and `results.md` with a message in the workspace language that means "Report <name> <cycle>", then `git push`.
2. Tell the QA engineer, in plain words:
   - the recommendation, the report link, and the cards created or commented on;
   - their one manual step: review the cards in the review list and move each to the developers' list;
   - what was BLOCKED, such as a missing connector or evidence left out;
   - a short message they can paste into the team's chat, in the workspace language: the recommendation, the bug count per severity, and the report link.
