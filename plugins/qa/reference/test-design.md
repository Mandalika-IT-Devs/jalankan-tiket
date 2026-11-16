# Test design

`/qa:rencanakan-uji` follows this file to turn a product's documents and code into requirements, risks and test cases. The files it writes are described in `workspace.md`.

## 1. Requirements

- One entry per checkable behaviour, with a stable ID: `REQ-001`, `REQ-002`, and so on.
- Each entry cites its source: a document path and section, or a code path and line.
- A requirement taken only from code is marked `(dari kode)` / `(from code)`. The code shows what the product does, not what it should do, so the requirement stays unconfirmed until the product team agrees.
- **IDs never change.** On a later run, keep every existing ID, append new requirements at the end, and mark a requirement that no longer applies as dropped, with the date. Never renumber.
- When a document leaves a rule, a number or a threshold open, do not invent it. Write a question (see section 5) and link it from the requirement.

## 2. Risk and priority

Score each feature or flow on two scales from 1 to 3:
- **Impact,** if it breaks: 3 for money, stored data, legal or HR obligations, or a flow that every user needs; 2 for a feature many users need, with a workaround; 1 for the rest.
- **Likelihood** of a defect: 3 for complex rules, many recent changes (`git -C source log --since=<date> --oneline -- <path> | wc -l`), or past bugs on the Trello board; 2 for moderate; 1 for simple and stable.

Priority comes from impact × likelihood: **P1** for 6 to 9, **P2** for 3 or 4, **P3** for 1 or 2.

**Critical flows** are the P1 flows that a user cannot work without, such as login, the main transaction and the main report. They form the smoke suite and the core of every regression run. Keep the list short, usually 5 to 8 flows.

## 3. Techniques

Choose the technique from the shape of the rule. Name it in each case.

| Shape of the rule | Technique | How |
|---|---|---|
| An input with valid and invalid classes, such as a quantity, an email or a date | **Equivalence partitioning** | One case per class: one valid value, and one value per invalid class |
| A numeric or length limit, such as "1 to 100 items" or "at most 50 characters" | **Boundary value analysis** | Test the boundary and the values just inside and outside it: 0, 1, 100, 101 |
| A rule with several conditions, such as a discount, a leave approval or a tax | **Decision table** | One column per combination of conditions that changes the outcome. Merge columns whose outcome is the same |
| A record with statuses, such as an order or a leave request | **State transition** | One case per allowed transition, and one per forbidden transition that the UI or the API might still allow |
| A flow across several pages | **Use case / end to end** | The main path, then each alternative path the documents name |
| Roles with different rights | **Authorization matrix** | A role × feature table of allow and deny from the code's permission rules. One case per deny that matters, run as the denied role, by URL and by API as well as through the menu |

Read limits and classes from the code where the documents are silent, such as validation rules, database column lengths and enums, and mark them `(dari kode)` / `(from code)`.

## 4. Test cases

Cases live in `cases/<area>.md`, one file per area, such as `cases/cuti.md`. Each case:

```
### TC-CUTI-004: Pengajuan cuti melebihi sisa saldo ditolak
- Requirement: REQ-012
- Prioritas: P1
- Jenis: negatif · Teknik: nilai batas
- Peran: karyawan
- Prasyarat: karyawan dengan sisa cuti 2 hari
- Data: alasan "QA-AUTO cuti batas"
- Eksekusi: otomatis

| # | Langkah | Hasil yang diharapkan |
|---|---|---|
| 1 | Buka Pengajuan Cuti | Form tampil, sisa cuti tertulis 2 hari |
| 2 | Isi tanggal 3 hari kerja, lalu kirim | Muncul pesan "Sisa cuti tidak cukup", pengajuan tidak tersimpan |
| 3 | Buka Riwayat Cuti | Tidak ada pengajuan baru |
```

The labels follow the workspace language. In an English workspace they are Requirement, Priority, Type, Technique, Role, Preconditions, Data and Execution.

**Rules for a case:**
- One behaviour per case.
- One action per step, and an expected result that can be observed: a text, a value, a status, a page. Never "works correctly", "properly", "as expected" or "normally".
- Concrete data, with `testDataPrefix` on every record the case creates.
- The role, and any data the case needs before it starts.
- Execution: `otomatis` / `automated` (a Playwright spec), `manual` (a person must judge, such as a printout's layout), or `eksplorasi` / `exploratory` (covered by a charter).
- Where the expected result depends on an open question, link the question. The case is BLOCKED until the question is answered.

## 5. Questions

Questions live in `questions.md`, numbered `Q-001` and on, in the format of `questions.md` in this folder, with who can answer and the requirements they affect. Each one is `terbuka` / `open` or `terjawab` / `answered` with the answer and its date. When the QA engineer passes on an answer, update the question and the requirements and cases it affects.

## 6. Exploratory charters

Exploratory testing covers what scripted cases miss. Each charter lives in `cases/eksplorasi.md` / `cases/exploratory.md`:

```
### EX-03: Jelajahi pembayaran di kasir dengan diskon dan retur untuk menemukan total yang salah
- Peran: kasir
- Batas: 30 probe atau 45 menit
- Ide: diskon bertumpuk, retur sebagian, pembulatan, koneksi lambat
```

The heading follows "Explore <area> with <resources> to discover <information>". Write one charter per P1 area, and for areas where the documents are thin.

## 7. Traceability

`requirements.md` ends with a matrix: each requirement and the cases that cover it. List separately:
- requirements without a case, each with a reason: covered by a charter, out of scope, or deferred;
- cases without a requirement. They should come only from exploration or from code, and say so.

## 8. Entry and exit criteria

The test plan states them. Defaults, unless the QA engineer sets others in the plan:
- **Entry:** the readiness audit is READY or READY WITH NOTES, and the smoke suite passes.
- **Exit:** every P1 case has a result other than NOT RUN; at least 90% of P2 cases are executed; no confirmed Critical or High bug is open; every BLOCKED case names who can unblock it.
