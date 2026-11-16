# Results and evidence

Every check, test case and audit item ends in exactly one state. Use the words in the workspace language.

| State | Indonesian | Means | Needs |
|---|---|---|---|
| PASS | LULUS | The expected result was observed | Evidence: an assertion that ran, a response, a screenshot, a value read back |
| FAIL | GAGAL | The observed result differs from the expected one | The expected and the observed result, the steps, evidence |
| BLOCKED | TERBLOKIR | A precondition is missing, so the check could not start | The missing precondition, and who can supply it |
| NOT RUN | TIDAK DIJALANKAN | Planned, but not attempted in this run | The reason, such as out of time or out of scope |
| INCONCLUSIVE | TIDAK MEYAKINKAN | It ran, but proves nothing either way | Why: no baseline, a result that changed between runs, an oracle that cannot decide |

## Rules

- **No silent pass.** A check without evidence is never PASS. A test that was skipped is BLOCKED or NOT RUN, never PASS.
- **The oracle is outside the model.** A PASS rests on something checked mechanically: an assertion on a URL, a text, a stored value or a status code. "The page looked fine" is not evidence.
- **Business postconditions.** For anything that creates or changes data, read the data back, and where roles matter, check it from the other role too. A success message or a 200 status with wrong stored data is a FAIL.
- **Flaky results.** When the same check passes and fails on repeated runs without a change, it is INCONCLUSIVE, with the count, such as "failed 2 of 5 runs". Never add retries to make it pass.
- **Facts apart from guesses.** A report states what was observed. A guess at the cause is marked as a guess.
- **Counts.** A report always counts each state separately, including BLOCKED and NOT RUN.

## Audit items

`/qa:audit-kesiapan` uses three states per item:
- `OK`: the item is ready, with the evidence named.
- `WARN`: testing can start, but part of it will be BLOCKED or less reliable until the item is fixed.
- `FAIL`: testing cannot start.

The verdict is **READY** (`SIAP`) when no item FAILs, and **BLOCKED** (`TERBLOKIR`) otherwise. When an item WARNs, the verdict is READY WITH NOTES (`SIAP DENGAN CATATAN`).
