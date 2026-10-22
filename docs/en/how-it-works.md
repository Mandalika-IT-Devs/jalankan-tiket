# How it works

## Two roles

- **You: the product owner.** You decide what gets built and what the business rules are. You also approve changes to protected documents, and you run UAT.
- **Claude: the build team.** One coordinator uses two subagents:
  - `tiket:pelaksana`, the implementer, writes the code;
  - `tiket:peninjau`, the reviewer, reviews the result with a clean context.

## The overall flow

```
siapkan-proyek → rencanakan-produk → rencanakan-tahap → jalankan ⇄ catat-keputusan
                                           ↑                      │
                                           └── /retro ←── milestone done
                                                                  │
                                                       UAT → deploy
```

## One round of `/tiket:jalankan`

1. **Pick a ticket.** The coordinator takes the ticket with the lowest number that meets three conditions:
   - it has the label `ready-for-agent`;
   - it does not have the label `needs-info`;
   - every ticket in its "Blocked by" section is closed.
2. **The implementer writes the code, tests first.** Each acceptance criterion goes through a red → green cycle. The implementer stops at the commit, once the verify command is green.
3. **The reviewer checks two axes.**
   - Spec: is this what was asked for?
   - Standards: is it written correctly?

   The result is `PASS` or `FIX`. On `FIX`, the findings go back to the implementer. After three rounds that still end in `FIX`, the ticket is parked.
4. **PR and CI.** The coordinator opens a PR, then waits for CI.
   - If CI is red, the implementer fixes it, in two rounds at most.
   - If the failing test is one that the change does not touch, the failed job is first run again, once.
5. **Merge, then go back to step 1.**

The state of the work is stored on GitHub: issues, labels, branches and PRs. If the session is interrupted, the next `/tiket:jalankan` continues from there.

## Two kinds of ambiguity

This is the core of how the kit works.

- **Technical.** For example file names, code patterns, how to test and display order. Claude decides by itself, then records the decision, its reason and its risk in the PR.
- **Business.** For example formulas, numbers, thresholds, access rights and what users see. Claude does not guess. The ticket is parked with the label `needs-info`, and you get a question with answer options. One of the options is the recommended one. `/tiket:catat-keputusan` records your answers in a decision PR. The parked ticket waits until that PR is merged, and then `/tiket:jalankan` works it again.

Things you have not decided yet are recorded in `docs/OPEN-DECISIONS.md`, each with an example value. Claude may use that example value so that work does not stop. Claude marks it with the example marker (`[CONTOH]` in Indonesian projects, `[EXAMPLE]` in English ones). An example value never becomes a fixed rule.

## Guardrails

- **Protected files.** The PRD, the glossary, the ADRs, the agent rules and CI change only through a PR. That PR must carry the owner-approved label (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones), and only you add that label. CI rejects a PR that changes protected files without that label.
- **Dependency allowlist.** A new library that is not on the list turns CI red, and its ticket is parked until you decide.
- **Green CI is required.** Changes reach `main` only through a PR with green CI.
- **Agent permissions.** `.claude/settings.json` blocks some commands, for example force-push, pushing straight to `main`, changing labels, and any command that names the approval label.
- **One coordinator per repo.** Only one person runs `/tiket:jalankan` at a time.

## When a ticket counts as done

A ticket is done when all four of these conditions are met:
- every acceptance criterion is ticked;
- the verify command is green;
- the reviewer gives `PASS`;
- CI is green.

After that, nothing more is added.
