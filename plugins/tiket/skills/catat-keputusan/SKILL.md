---
name: catat-keputusan
description: Record the owner's answers to parked tickets and open questions in the PRD and the issues, so /tiket:jalankan can continue.
disable-model-invocation: true
---

# Record the owner's decisions

The owner answers the questions that the coordinator or a planning session asked. You turn the answers into rules and update the tickets, so that `/tiket:jalankan` can continue. Use the **project language** (`language` in `.github/jalankan-tiket.json`) for every file you change and every message, short status lines included. Never mix two languages in a message.

## 1. Collect the questions

The questions come from three sources:
- the coordinator's final report, when it is in this conversation;
- every open issue that carries the needs-info label, through the question comment it holds (`gh issue view <n> --json title,body,comments`);
- comments headed as questions for the owner on recently closed issues.

Number the questions the way the report numbered them. When there is no report, number them in issue order.

This step is done when every question has its number, its options, its recommendation and its source issue.

## 2. Read the answers

The owner's answer takes one of these forms:
- "setuju semua" or "agree to all": every recommendation applies;
- "agree to all except 2: pick c": the recommendations apply, except for the questions the owner names, which get the owner's own choice.

When an answer is unclear, ask about that one question only.

## 3. Apply each decision

1. **Write the rule.**
   - Write it as a block under the PRD text it changes or confirms: `▶ Keputusan YYYY-MM-DD: …` in Indonesian projects, `▶ Decision YYYY-MM-DD: …` in English ones.
   - A decision about wording goes to `GLOSSARY.md` instead. One about the look of the interface goes to `docs/DESIGN.md`. One about a technical direction goes to a new ADR.
2. **Update the supporting files.**
   - When the decision settles an entry in `docs/OPEN-DECISIONS.md`, remove its row.
   - When it adds a number or a formula, add the golden cases.
3. **Update the source issue.**
   - Comment the decision on it, quoting the owner's answer.
   - Remove the needs-info label.
4. **Handle merged work.** When a decision changes what an already-merged ticket built, create a small follow-up ticket for the change. Do not change merged work silently. The follow-up ticket has:
   - the title `[<prefix><nn>-b] …`;
   - the ready-for-agent label and the same milestone;
   - "Blocked by" set to none.

This step is done when every answered question has its rule written, its source issue commented, and the needs-info label removed.

## 4. Deliver

The PRD and the other decision files are protected. They reach `main` through the steps in `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`:
- the issue is titled `[Keputusan] …` (`[Decision] …` in English projects);
- the branch is `keputusan-<YYYY-MM-DD>`.

The decision PR must merge before `/tiket:jalankan` runs again. Until then, the reviewer checks the parked tickets against the old PRD.

## 5. Report

Tell the owner, in plain words:
- the decisions recorded;
- the PR link and its state;
- the follow-up tickets created;
- the next step: after the merge, run `/tiket:jalankan`.
