---
name: catat-keputusan
description: Record the owner's answers to parked tickets and open questions in the PRD and the issues, so /tiket:jalankan can continue.
disable-model-invocation: true
---

# Record the owner's decisions

The owner answers the questions that the coordinator or a planning session asked. You turn the answers into rules and update the tickets, so that `/tiket:jalankan` can continue. Use the **project language** (`language` in `.github/jalankan-tiket.json`) for every file you change and every message, including the one-line status updates between tool calls, such as "Sekarang PRD §4.1: blok ▶ Keputusan" in an Indonesian project. Never mix two languages in a message.

## 1. Collect the questions

The questions come from three sources:
- the coordinator's final report, when it is in this conversation;
- every open issue that carries the needs-info label, through the question comment it holds (`gh issue view <n> --json title,body,comments`);
- comments headed as questions for the owner on recently closed issues.

Number the questions the way the report numbered them. When there is no report, number them in issue order.

This step is done when every question has its number, its options, its recommendation and its source issue.

## 2. Get the answers

When the owner has not answered in this conversation yet, present every question with its source issue, in the format of `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`. Then end your turn and wait.

The owner's answer takes one of these forms:
- "setuju semua" or "agree to all": every recommendation applies;
- "agree to all except 2: pick c": the recommendations apply, except for the questions the owner names, which get the owner's own choice;
- the owner's own words for a question, such as an option with a change. Record it as the owner wrote it.

When an answer is unclear, ask about that one question only.

## 3. Open the decision issue

Follow step 1 of `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`, with the title `[Keputusan] …` (`[Decision] …` in English projects).

The tickets that wait for these decisions list this issue under "Blocked by". `/tiket:jalankan` then picks them up only after the decision PR has merged and closed the issue.

## 4. Apply each decision

1. **Write the rule.**
   - Write it as a block under the PRD text it changes or confirms: `▶ Keputusan YYYY-MM-DD: …` in Indonesian projects, `▶ Decision YYYY-MM-DD: …` in English ones.
   - A decision about wording goes to `GLOSSARY.md` instead. One about the look of the interface goes to `docs/DESIGN.md`. One about a technical direction goes to a new ADR.
2. **Update the supporting files.**
   - When the decision settles an entry in `docs/OPEN-DECISIONS.md`, remove its row.
   - A new term gets an entry in `GLOSSARY.md`. New behaviour that the owner will check gets a scenario in `docs/UAT.md`.
   - When the decision adds a number or a formula, add the golden cases.
   - When the decision changes what merged code computes, put its golden cases in a new golden file that no test reads yet. The follow-up ticket connects that file to the tests. In a file the tests already read, the new cases would turn the verify command red, and the decision PR could never merge.
3. **Handle merged work.** When a decision changes what an already-merged ticket built, create a small follow-up ticket for the change. Do not change merged work silently. The follow-up ticket has:
   - the title `[<prefix><nn>-b] …`;
   - the ready-for-agent label and the same milestone;
   - the decision issue under "Blocked by".

This step is done when every answered question has its rule written and every follow-up ticket exists.

## 5. Deliver

1. **Open the PR** with step 2 of `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`, on the branch `keputusan-<YYYY-MM-DD>`.
2. **Update each source issue.**
   - Comment the decision on it. Quote the owner's answer, link the PR, and use the issue's own question numbers.
   - On a parked ticket, add the decision issue to its "Blocked by" section with `gh issue edit <n> --body-file <file>`. Then remove the needs-info label.
3. **Finish** with steps 3 and 4 of `owner-pr.md`: the owner adds the label, and you merge once CI is green and the owner agrees.

This step is done when every source issue is commented and no parked ticket still carries the needs-info label.

## 6. Report

Tell the owner, in plain words:
- the decisions recorded;
- the PR link and its state;
- the follow-up tickets created;
- the next step: after the merge, run `/tiket:jalankan`.
