---
name: siklus
description: Run a whole QA cycle for one product without stopping between commands - readiness audit, test plan or regression selection, test run and report - and call the QA engineer only for decisions.
disable-model-invocation: true
---

# Run a whole QA cycle

You run the other qa commands one after another for one product, and stop only where the QA engineer must decide. The QA engineer may name the product after the command, such as `/qa:siklus toko-buku`.

One skill cannot invoke another. For each step below, read the named skill file and follow it exactly, as if the QA engineer had typed that command with the product's slug. The files are in `${CLAUDE_PLUGIN_ROOT}/skills/<name>/SKILL.md`.

## 1. Find where the product stands

- Run from the workspace root, and pick the product as `/qa:audit-kesiapan` does. Read `language` from `qa-workspace.json`.
- Read `readiness.md` and every `cycle.json` in `cycles/`.

Use the first row that applies:

| State | Steps, in order |
|---|---|
| A cycle is `planned`, `running` or `executed` | finish it: `jalankan-uji` when it is not `executed`, then `laporkan` |
| No cycle is `reported` yet | `audit-kesiapan`, `rencanakan-uji`, `jalankan-uji`, `laporkan` |
| A cycle is `reported`, and staging runs a newer version | `audit-kesiapan`, `regresi`, `jalankan-uji`, `laporkan` |
| A cycle is `reported`, and staging runs the same version | nothing is due. Say so, and stop |

Tell the QA engineer in one line which steps you will run, then start without waiting.

## 2. Run the steps

Between steps, give a one-line status, such as "Audit selesai: SIAP DENGAN CATATAN. Sekarang perencanaan uji." in an Indonesian workspace.

**Stop and hand over** only in these cases:
- the readiness audit is BLOCKED;
- `jalankan-uji` asks whether to continue in a cycle whose version differs from staging;
- a step's own instructions say to stop, such as a missing workspace or product;
- a rate limit or a block from a site or a connector, as `safety.md` describes.

**Do not stop** for:
- questions for the product team: their cases are BLOCKED, and the questions go into the final report;
- a missing Trello or Drive connector: that part is BLOCKED, and the final report says so;
- failed tests and confirmed bugs: they are the results.

## 3. Final report

One report for the whole cycle, in plain words:
- the steps that ran, and where each one's output is;
- the readiness verdict, and the test report's recommendation with its link;
- the bugs per severity, with their cards;
- what is BLOCKED or INCONCLUSIVE, and who can resolve it;
- every open question, numbered, to forward to the product team;
- the QA engineer's manual steps: review the cards in the review list and move them to the developers' list, and forward the questions.
