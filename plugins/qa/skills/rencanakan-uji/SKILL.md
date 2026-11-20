---
name: rencanakan-uji
description: Turn a product's documents and code into requirements with IDs, questions for the product team, risk-based priorities, test cases and exploratory charters, then open a test cycle with its test plan in Google Docs.
disable-model-invocation: true
---

# Plan the tests

You turn one product's documents and code into a test plan, and open a **test cycle**: one round of testing one version of the product. You never change the product or its data. The QA engineer may name the product and a scope after the command, such as `/qa:rencanakan-uji toko-buku kasir dan retur`. Without a scope, plan the whole product.

Read these first, and follow them throughout:
- `${CLAUDE_PLUGIN_ROOT}/reference/test-design.md`: requirements, risks, techniques, cases, charters, traceability, entry and exit criteria;
- `${CLAUDE_PLUGIN_ROOT}/reference/workspace.md`: the files and `cycle.json`;
- `${CLAUDE_PLUGIN_ROOT}/reference/questions.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/connectors.md`;
- `${CLAUDE_PLUGIN_ROOT}/reference/safety.md`.

## 1. Check the starting point

- Run from the workspace root. Read `language` from `qa-workspace.json`; every message and file uses it.
- Pick the product as `/qa:audit-kesiapan` does, and read its `product.json`.
- Read `products/<slug>/readiness.md`. When it is missing, or its verdict is BLOCKED, stop and point to `/qa:audit-kesiapan <slug>`.
- Run `git -C products/<slug>/source pull --ff-only`, and note the newest commit on `branch` and the version under test from the readiness audit.
- When `requirements.md`, `questions.md`, `risks.md` or `cases/` already exist, this is a later run: keep every ID, as `test-design.md` says.

## 2. Read the product

Only read. From `source/`:
- the PRD, specs, user stories, README and `docs/`;
- routes and pages, forms and their validation rules, database columns and enums, statuses and their transitions, permission rules per role, API endpoints;
- recent changes per area: `git -C products/<slug>/source log --since=<90 days ago> --name-only --format=` grouped by folder.

From Trello, when the connector works: cards on the board about earlier bugs (`trelloSearch` with `search_cards` and `boardIds`). They raise the likelihood of their area.

This step is done when you can list the product's areas, the roles, and the rules each area enforces.

**A large product,** with many feature documents, does not fit in one agent's reading. Split steps 3 to 5 by groups of areas across subagents, with one shared brief: the roles, the conventions of `test-design.md`, and temporary IDs per group, such as `REQ-KASIR-01` and `Q-KASIR-01`. Then merge their work yourself: renumber the IDs across the product, merge questions that ask the same thing, and build the traceability matrix from the merged files.

## 3. Write requirements and questions

1. Copy `templates/<language>/product/requirements.md` and `questions.md` into `products/<slug>/` when they do not exist yet.
2. Write the requirements as section 1 of `test-design.md` describes: one per checkable behaviour, with its source, its priority from step 4, and links to its questions. A requirement says what its source says, and no more. When the documents name a few accessibility rules, such as contrast and labels, the requirement names those, not a whole standard such as WCAG 2.2 AA. When they name no accessibility target at all, ask the product owner which one applies.
3. Write a question for every rule, number or threshold the documents leave open, and for every requirement taken only from code that matters for a P1 area. Use the format of `questions.md` in the reference folder, with who can answer and the requirements it affects.

## 4. Score the risks

Copy `templates/<language>/product/risks.md` when it does not exist yet, and fill it as section 2 of `test-design.md` describes: one row per feature or flow, with impact, likelihood, score, priority and a reason that cites the evidence, such as "23 commits in 90 days" or "3 earlier bug cards". List the critical flows.

## 5. Design the test cases and charters

1. Write `products/<slug>/cases/<area>.md` per area in scope, as sections 3 and 4 of `test-design.md` describe. Give each feature of the area its own `##` heading, even in a small file: `/qa:regresi` chooses cases per heading, and a file without headings is chosen as a whole. Cover every P1 requirement, then P2, then P3 as far as it is useful. Choose the technique from the shape of each rule.
2. Always include:
   - the **critical flows** as cases in an area named `smoke`, short and read-only where possible;
   - an **authorization matrix** for every area where roles differ, with the denied cases that matter;
   - **negative and boundary cases** for every input that stores data;
   - **API cases** where the UI calls an endpoint that changes data;
   - one **accessibility** case per main page type, and one **responsive** case per main page that users open on a phone.
3. Write the exploratory charters in `cases/eksplorasi.md` / `cases/exploratory.md`, as section 6 describes.
4. **Check your cases** against the rules in section 4 of `test-design.md`. Search the case files for vague expected results, such as "berhasil" or "works" alone, "sesuai", "correctly" or "properly", and rewrite each one into something observable. A word inside a quoted UI text, such as the message "Alamat berhasil disimpan.", is not vague: it is the exact text to check.
5. **Suspicions from the code,** such as a status change the API allows but the documents forbid, go into the charters as their goals, or into a case with the code location under its notes. They are not bugs until a test shows them.
6. Write the traceability matrix at the end of `requirements.md`, as section 7 describes.

This step is done when every P1 requirement has a case or a charter, and every case has a role, data, steps and observable expected results.

## 6. Open the cycle

1. The cycle ID is `<YYYY-MM-DD>-<short version>`, such as `2026-03-02-a1b2c3d`. Use the version from the readiness audit, or the first 7 characters of the newest commit on `branch`.
2. Create `products/<slug>/cycles/<cycle>/cycle.json` as `workspace.md` describes, with `status` `planned`.
3. **The test plan.** Fill `templates/<language>/product/test-plan.html`: scope and out of scope, the approach (kinds of testing and techniques), the roles by label only, the entry and exit criteria from section 8 of `test-design.md`, the risks and critical flows, the case counts per priority and kind, and the open questions. When the Drive connector works, create it as a Google Doc named `Rencana uji – <name> – <cycle>` (`Test plan – <name> – <cycle>` in English) in `folderId`, as `connectors.md` describes, and store its link in `cycle.json`. Otherwise save it as `cycles/<cycle>/test-plan.html` and report that the Doc is BLOCKED.
4. Commit everything under `products/<slug>/` except ignored files, with a message in the workspace language that means "Test plan <name> <cycle>", then `git push`.

## 7. Report

Tell the QA engineer, in plain words:
- the cycle ID and the link to the test plan;
- the counts: requirements, cases per priority, charters, and requirements without a case;
- the open questions, numbered, to forward to the product team. Cases that depend on an open question will be BLOCKED until it is answered;
- the next step: `/qa:jalankan-uji <slug>`.
