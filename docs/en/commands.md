# Commands

## Kit commands

| Command | When | Do you need to take part? | Result |
|---|---|---|---|
| `/tiket:siapkan-proyek` | Once per project | Yes, one round of questions | Repo, labels, milestone, CI, starting documents |
| `/tiket:rencanakan-produk` | At the start of the project, or when the product changes a lot | Yes, this is the longest session | PRD, glossary, ADRs, open decisions, UAT, calculation examples (in a PR) |
| `/tiket:rencanakan-tahap` | Once per milestone | Yes | The tickets in that milestone |
| `/tiket:jalankan` | Whenever there are ready tickets | No | Merged PRs and a final report |
| `/tiket:catat-keputusan` | After a report with questions | Yes, briefly | A decision PR, and tickets that can continue |
| `/tiket:cek-proyek` | Whenever you are unsure | No | A list of problems and the next step |

`/tiket:jalankan` works every ready ticket. To limit a run, add issue numbers or a milestone name after the command, for example `/tiket:jalankan #12 #15` or `/tiket:jalankan M2`.

In Claude Desktop, type `/tiket`, then pick the command from the menu.

## Skills from mattpocock-skills that the kit uses

| Skill | Used by | Purpose |
|---|---|---|
| `grilling` | `rencanakan-produk`, `rencanakan-tahap`, stack adaptation | Questions and answers until each decision is clear, with recommended answers |
| `domain-modeling` | `rencanakan-produk` | Writes the glossary (`GLOSSARY.md`) and the ADRs |
| `tdd` | `tiket:pelaksana` | The red → green test cycle |
| `research` | Adapting another stack | Checks tools and versions against official sources |
| `wizard` | Deploy tickets | Guide scripts for steps that only a human can do |
| `/retro` | You, after a milestone is finished | Proposed improvements to the rules, CI and documents, based on that milestone |

## Skills from mattpocock-skills that this workflow does not use

| Skill | Reason |
|---|---|
| `/to-tickets` | It removes the "Blocked by" text section, but the coordinator reads that section. Use `/tiket:rencanakan-tahap` instead. |
| `pr` | Its PR format has no `Closes #n`, but CI requires it. The coordinator uses the project's PR template. |
| `implement-spec` | It works on many tickets at once. The kit works on one ticket per round on purpose, so that `main` moves forward in a straight line. |
| `/setup-matt-pocock-skills` | `/tiket:siapkan-proyek` already does this. |
