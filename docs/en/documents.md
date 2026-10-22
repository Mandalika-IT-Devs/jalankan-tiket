# Project documents

Every project uses the same file names, whatever its language. The content is written in the project language.

| File | Content | Created by | Protected |
|---|---|---|---|
| `docs/input/` | Raw material: notes, documents, sample files. Not rules. | You | no |
| `docs/PRD.md` | Business rules, in numbered sections | `rencanakan-produk` | yes |
| `GLOSSARY.md` | Terms, with the synonyms to avoid (_Avoid_) | `rencanakan-produk` | yes |
| `docs/adr/` | Technical decisions. ADR-0001 covers the stack, ADR-0002 the pure domain module | `siapkan-proyek`, `rencanakan-produk` | yes |
| `docs/OPEN-DECISIONS.md` | Business decisions not made yet, with their example values | `rencanakan-produk` | yes |
| `docs/UAT.md` | Acceptance scenarios for each PRD section | `rencanakan-produk` | yes |
| `tests/golden/` | Correct calculation examples, in JSON format | `rencanakan-produk` | yes |
| `docs/DESIGN.md` | The design system, if the product has a user interface | `rencanakan-produk` or `/impeccable` | yes |
| `AGENTS.md` + `CLAUDE.md` | A map of the sources of truth, the guardrails and the commands, for agents | `siapkan-proyek` | yes |
| `CODING_STANDARDS.md` | Coding standards and the project's own review checklist | `siapkan-proyek` | yes |
| `docs/agents/*.md` | Configuration for the mattpocock-skills skills | `siapkan-proyek` | yes |
| `docs/GUIDE.md` | The owner's guide for this project | `siapkan-proyek` | no |
| `.github/` | Issue and PR templates, CI, the list of protected files, the dependency allowlist, the kit configuration | `siapkan-proyek` | yes |
| `.claude/settings.json` | Agent permissions and the project's plugins | `siapkan-proyek` | yes |
| `docs/DEPLOY.md` | The deploy runbook | Deploy ticket | no |

## Conventions

- **▶ Decision.** Your decisions are written in the PRD as a decision block (`▶ Keputusan YYYY-MM-DD: …` in Indonesian projects, `▶ Decision YYYY-MM-DD: …` in English ones). Each block goes right below the text that it changes or confirms, and it overrides the text above it.
- **OD-xx and the example marker.** Each business question that is not decided yet gets an OD number. Its example value is used in seeds and tests with the example marker (`[CONTOH]` in Indonesian projects, `[EXAMPLE]` in English ones), and the PR names it.
- **Golden.** Every rule with a number or a formula has a calculation example in `tests/golden/`. Tests take their expected values from the golden files, not from the same formula as the code.
- **Glossary.** Names in code, tests, issues and PRs use the exact terms from `GLOSSARY.md`. The synonyms in the _Avoid_ lists are not used.
- **Review checklist.** Project rules that must be checked on every ticket are written at the end of `CODING_STANDARDS.md`.
- **Protected files.** They are listed in `.github/protected-paths.txt`, and `.github/CODEOWNERS` is generated from that list.
