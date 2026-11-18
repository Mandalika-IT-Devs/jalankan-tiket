# Bugs

A bug is a confirmed difference between what the product does and what its requirements, its own messages, or plain correctness say it should do. Only bugs that the `pemeriksa` agent has confirmed are reported. Write every bug in the workspace language.

## Severity

How bad the effect is, whoever is affected.

| Severity | Indonesian | When |
|---|---|---|
| Critical | Kritis | Data is lost or corrupted, money or stock is computed wrongly, a role reaches data it must not see, or a critical flow fails for everyone with no workaround |
| High | Tinggi | A main feature fails, or a business rule is wrong, and the workaround is hard or unknown |
| Medium | Sedang | A feature fails in part, and there is a reasonable workaround |
| Low | Rendah | Cosmetic, wording, layout, or a minor inconvenience |

## Priority

How soon it should be fixed. QA proposes it, and the product team decides.
- **P1:** fix before the release. Usually Critical, or High on a critical flow.
- **P2:** fix in this cycle or the next.
- **P3:** fix when convenient.

Severity and priority are separate fields. A typo on the login page can be Low severity and P1 priority.

## Urgent bugs

A bug is **urgent** when it is Critical, or High because it exposes credentials or personal data, loses data or money, or stops testing. An urgent candidate does not wait for the end of the run. `/qa:jalankan-uji` sends it to the `pemeriksa` agent right after the area that found it. Once it is confirmed, the QA engineer hears about it at once, with a message for the developers, and `/qa:laporkan` can create its card while the run goes on.

## The bug file

`/qa:jalankan-uji` writes each confirmed bug to `cycles/<cycle>/bugs/BUG-<nnn>.md`. `/qa:laporkan` turns it into a Trello card. The file, and the card, hold:

1. **Title:** `[<severity>] <area>: <what goes wrong>`, such as `[Tinggi] Cuti: pengajuan melebihi saldo tetap tersimpan`. Name the symptom, not a guessed cause.
2. **Environment:** the staging URL, the version under test, the browser and the viewport.
3. **Role** used, never its username or password.
4. **Preconditions and data,** including the prefixed records involved.
5. **Steps to reproduce,** numbered, one action each, from a fresh start.
6. **Expected result,** with its source: the requirement ID, the document, or the product's own message.
7. **Actual result,** as observed: texts, values, status codes.
8. **Frequency:** how many of the pemeriksa's runs reproduced it, such as 3/3.
9. **Evidence:** file names in `cycles/<cycle>/evidence/`. After `/qa:laporkan`, the Drive links.
10. **Links:** the case ID, the requirement ID, and the cycle.
11. **Severity and priority,** each with one sentence of reason.
12. **Notes:** a guess at the cause only when it helps, marked as a guess.

Never put a password, a token, a session cookie or a real person's data in a bug.

## Not a bug

- **Not reproduced** by the pemeriksa: it goes into the results as INCONCLUSIVE, with what was seen and how often. No bug file.
- **The requirement is unclear:** it is a question in `questions.md`, not a bug.
- **The test itself was wrong,** such as a stale locator or a wrong assumption: fix the test and run it again.
