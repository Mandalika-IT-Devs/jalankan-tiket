---
name: rencanakan-tahap
description: Plan the next milestone with the owner and publish its tickets to GitHub, ready for /tiket:jalankan.
argument-hint: "[the feature or change you want, optional]"
disable-model-invocation: true
---

# Plan a milestone

You turn the next part of the PRD, or a feature or change the owner asks for, into tickets that `/tiket:jalankan` can work on its own. The owner answers questions in this session. Use the **project language** (`language` in `.github/jalankan-tiket.json`) for every question and every ticket. Use it also for every message in this conversation, including the one-line status updates between tool calls, such as "Sekarang tiket T05: …" in an Indonesian project. Never mix two languages in a message.

The plugin root is `${CLAUDE_PLUGIN_ROOT}`. Supporting files such as the stack's `PROFILE.md` write it as the literal text `${CLAUDE_PLUGIN_ROOT}`. Read that text as this path.

Every write to GitHub follows `${CLAUDE_PLUGIN_ROOT}/reference/github-use.md`. Before your first write, check the agent account and the coordinator lock, as its sections 1 and 2 describe.

## 1. Gather

The owner's request, typed after the command: "$ARGUMENTS". When it is empty, the milestone delivers the next part of the PRD.

Read all of these:
- the project config, `AGENTS.md`, `docs/PRD.md`, `docs/UAT.md`, `docs/OPEN-DECISIONS.md`, `GLOSSARY.md`, the ADRs and `tests/golden/`;
- the code;
- every issue with its state and milestone: `gh issue list --state all --limit 500 --json number,title,state,milestone,labels`.

This step is done when you can say:
- what is already built;
- what the next milestone should deliver: the owner's request when there is one, otherwise the next part of the PRD;
- which parts of the request the PRD does not describe yet;
- the highest ticket number used so far (`[<prefix><nn>]`);
- the next milestone's name, one after the highest in use, whether the project keeps milestones on GitHub or as labels such as `M3`.

## 2. Agree the scope and its decisions

1. Propose what the milestone delivers, in the owner question format of `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`.
2. **Write new work into the PRD first.** When the request asks for behaviour the PRD does not describe yet, call the Skill tool with "grilling" until every rule of it is clear: each number and formula with a worked example, who may do what, and what the user sees.
   - A new feature gets a new numbered PRD section. A change to existing behaviour gets a `▶ Keputusan YYYY-MM-DD: …` block (`▶ Decision YYYY-MM-DD: …` in English projects) under the text it modifies.
   - Numbers and formulas get golden cases. Behaviour the owner will check gets UAT scenarios, and new terms get `GLOSSARY.md` entries.
   - A rule the owner cannot settle yet goes into `docs/OPEN-DECISIONS.md` with an example value.
3. For every entry in `docs/OPEN-DECISIONS.md` that the milestone's tickets need, ask the owner to decide now or to keep the example value. Call the Skill tool with "grilling" when the answers open further questions.
4. Record the decisions the owner makes now, the way `/tiket:catat-keputusan` does.
   - Each decision goes into the PRD as a `▶` block, and its row leaves OPEN-DECISIONS.
   - The new rules from item 2 and these decisions reach `main` in one PR, through `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`, with an issue titled `[Rencana] …` (`[Plan] …` in English projects).
   - That PR merges before the tickets are published, so the tickets can cite the PRD.

This step is done when every rule the tickets need is in the PRD on `main`, with its examples, or in `docs/OPEN-DECISIONS.md` with an example value.

## 3. Slice into tickets

Each ticket is a **vertical slice**: a narrow path through every layer (data, rules, screen or endpoint, and tests) that one PR can finish.

Each ticket follows these rules:
- **Size:** it stays under about 400 changed lines.
- **Acceptance criteria:** each criterion can be checked as pass or fail. A criterion with a number quotes `tests/golden/` or the PRD.
- **Blocked by:** this section names only the tickets that must be merged first.
- **Business rules** go to the domain module, as described in ADR-0002.
- **The first milestone of a new project** starts with the foundation ticket `[<prefix>00]`. Its body is the stack profile's `ticket-t00.md`, found in `${CLAUDE_PLUGIN_ROOT}/stacks/<stack>/<lang>/`.
- **Deploying to a server** uses the tickets in `${CLAUDE_PLUGIN_ROOT}/stacks/<stack>/<lang>/ticket-deploy.md`, when the owner wants a deploy.

Number the tickets from the next free number, in dependency order (blockers first). Show the owner the list:
- the titles;
- the order;
- the blockers;
- one line each on what it builds.

Change the list until the owner agrees.

## 4. Publish

1. **Check that the milestone exists:** `gh issue list --milestone "M<n>" --limit 1`. If GitHub does not know the milestone, give the owner this command to run with `!`, and wait until they have run it:

   ```
   gh api repos/<owner>/<name>/milestones -f title=M<n>
   ```
2. **Create one issue per ticket, in order:**

   ```
   gh issue create --title "[<prefix><nn>] <title>" --label <readyForAgent> --milestone "M<n>" --body-file <file>
   ```

   The body follows `.github/ISSUE_TEMPLATE/ticket.md`. Put real issue numbers in "Blocked by".
   - Wait at least 30 seconds between two issues, as section 3 of `github-use.md` says. To GitHub, a burst of new issues from one account looks like spam.
   - Before the first issue, tell the owner how long publishing takes: about half a minute per ticket.
3. **Tickets for the owner.** A ticket that needs a person, for example to handle credentials or a domain name, gets the `readyForHuman` label instead.

This step is done when every agreed ticket exists on GitHub with its label, its milestone and its "Blocked by" section.

## 5. Report

Tell the owner in plain words:
- the milestone;
- the tickets, each with its link;
- any tickets that wait for the owner;
- the next step: run `/tiket:jalankan`.
