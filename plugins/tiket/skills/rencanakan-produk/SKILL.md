---
name: rencanakan-produk
description: Interview the owner and turn raw material (and existing code) into the PRD, glossary, ADRs, open decisions, UAT scenarios and golden fixtures.
disable-model-invocation: true
---

# Plan the product

You turn what the owner knows into the documents that the automatic workflow builds from. This session needs the owner to answer questions, and it is the longest one in the workflow. Use the **project language** (`language` in `.github/jalankan-tiket.json`) for every document and every question. Use it also for every message in this conversation, short status lines included. Never mix two languages in a message.

## 1. Gather

Read everything below:
- `docs/input/`, all of it;
- `AGENTS.md`;
- the current `docs/PRD.md`, `GLOSSARY.md`, `docs/adr/`, `docs/OPEN-DECISIONS.md`, `docs/UAT.md` and `tests/golden/`.

**Existing projects** also need the code. Dispatch an Explore subagent to map the current behaviour: its domain rules, its data model, its roles and permissions, and its screens or endpoints. The code shows what the system does today. The owner decides what it should do.

This step is done when you can list:
- every feature area the material mentions;
- every number, formula or rule stated in it;
- every gap or contradiction between the sources.

## 2. Grill

Call the Skill tool twice, once for "grilling" and once for "domain-modeling". Run the interview with them. It covers these topics, in this order:

1. **Purpose and boundaries:** the problem the product solves, and what it deliberately leaves out.
2. **Users and roles:** who uses the product, and what each role may see and do.
3. **Each feature area:**
   - its rules;
   - every number, threshold and formula, each with a worked example;
   - what the user sees;
   - the failure and edge cases.
4. **Rough milestones:** what M1, M2 and later milestones deliver.

Some questions have no answer yet. For each one, agree an example value with the owner and name who decides it. The question then becomes an entry in OPEN-DECISIONS rather than a guess.

This step is done when every feature area has its rules stated, and every number in them has a worked example. Every question must be either answered or recorded as an open decision.

## 3. Write

Write each document in the shape its template already gives (see the comment at the top of each file):

- **`docs/PRD.md`**:
  - numbered sections, so tickets can cite "PRD §3.2";
  - rules written with their numbers and examples;
  - a list of what is deliberately not built.
- **`GLOSSARY.md`**: every domain noun the PRD uses, with `_Avoid_` synonyms. Follow the domain-modeling skill's format.
- **`docs/adr/`**: only for decisions that are hard to reverse, surprising, and a real trade-off. The domain-modeling skill decides when.
- **`docs/OPEN-DECISIONS.md`**: one row per open question. Each row gives the decision owner, what the question blocks, and the example value.
- **`docs/UAT.md`**: scenarios for every PRD section, each with an ID, steps, the expected result and the PRD reference.
- **`tests/golden/`**: one JSON file per rule that has a number or a formula. Each file lists cases with inputs, expected outputs and the PRD reference. Rules that have no golden case yet go into `tests/golden/NOTES.md`.
- **`docs/DESIGN.md`**, for projects with a user interface only. Suggest the impeccable plugin (`/impeccable`) for this file, or write a first version from the owner's answers.

Writing can reveal a question that the interview missed. Record each such question as an open decision, with an example value and the owner as the person who decides. Name it in the PR and in your report. Never settle it in the text.

This step is done when all of these hold:
- every PRD rule that has a number is covered by a golden case or listed in `NOTES.md`;
- every PRD section has a UAT scenario;
- every domain noun in the PRD is in `GLOSSARY.md`.

## 4. Deliver

These documents are protected files. They reach `main` through the steps in `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`:
- the issue is titled `[Rencana] …` (`[Plan] …` in English projects);
- the branch is `rencana-produk`.

## 5. Report

Tell the owner, in plain words:
- the PRD sections that were written;
- how many open decisions there are, with their IDs;
- the PR link and its state;
- the next step: `/tiket:rencanakan-tahap`.
