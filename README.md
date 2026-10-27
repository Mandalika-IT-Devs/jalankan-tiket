# jalankan-tiket

> **Status: v1.0.** Validated end to end on a new project and on an existing one; [Tested versions](docs/en/versions.md) lists the validated paths. Example: [mandalikadev/contoh-perpustakaan](https://github.com/mandalikadev/contoh-perpustakaan), a small library app built with the kit, with its tickets and PRs.

A Claude Code plugin that runs a whole software project from GitHub tickets. You plan the product with Claude once. After that, Claude works every ready ticket on its own, one at a time:

```
implementer (test-first) → independent reviewer → pull request → CI → merge
```

When a ticket needs a business decision, Claude parks it and asks you a clear question with a recommended answer. It never guesses.

*Jalankan tiket* is Indonesian for "run the tickets". [Baca dalam Bahasa Indonesia →](README.id.md)

## Why

Coding agents fail in three predictable ways:
- they build the wrong thing;
- they guess business rules;
- they let quality drift.

This kit puts a guardrail on each of them:
- **Planning by grilling.** Claude interviews you until every rule, number and formula is written down. The result is a PRD, a glossary, open decisions, UAT scenarios, and golden examples of correct calculations.
- **Two kinds of ambiguity.**
  - Technical questions: Claude decides and records the decision.
  - Business questions: Claude parks the ticket and asks you.
- **Guardrails that GitHub enforces.** Protected documents change only through PRs that carry your approval label, every dependency must be on an allowlist, and nothing reaches `main` without green CI.

## Install

In a Claude Code session (CLI or the Claude Desktop Code tab):

```
/plugin marketplace add anthropics/claude-plugins-official
/plugin marketplace add Mandalika-IT-Devs/jalankan-tiket
/plugin install tiket@jalankan-tiket
```

[mattpocock-skills](https://github.com/mattpocock/skills) is installed with it, as a dependency.

## Use

| Step | Command |
|---|---|
| 1. Set up a new or existing project | `/tiket:siapkan-proyek` |
| 2. Plan the product with Claude | `/tiket:rencanakan-produk` |
| 3. Plan a milestone into tickets | `/tiket:rencanakan-tahap` |
| 4. Let Claude work the tickets | `/tiket:jalankan` |
| 5. Answer parked questions | `/tiket:catat-keputusan` |
| Not sure what's next? | `/tiket:cek-proyek` |

## Guide

| English | Bahasa Indonesia |
|---|---|
| [Quickstart](docs/en/quickstart.md) | [Mulai cepat](docs/id/quickstart.md) |
| [How it works](docs/en/how-it-works.md) | [Cara kerja](docs/id/how-it-works.md) |
| [Commands](docs/en/commands.md) | [Daftar perintah](docs/id/commands.md) |
| [Project documents](docs/en/documents.md) | [Dokumen proyek](docs/id/documents.md) |
| [Adapting your stack](docs/en/adapting-your-stack.md) | [Menyesuaikan stack](docs/id/adapting-your-stack.md) |
| [CI and runners](docs/en/ci-and-runners.md) | [CI dan runner](docs/id/ci-and-runners.md) |
| [Existing projects](docs/en/existing-projects.md) | [Proyek lama](docs/id/existing-projects.md) |
| [Updates](docs/en/updates.md) | [Pembaruan](docs/id/updates.md) |
| [Security and guardrails](docs/en/security.md) | [Keamanan dan pagar](docs/id/security.md) |
| [Agent account](docs/en/agent-account.md) | [Akun agen](docs/id/agent-account.md) |
| [FAQ](docs/en/faq.md) | [Tanya jawab](docs/id/faq.md) |
| [Tested versions](docs/en/versions.md) | [Versi teruji](docs/id/versions.md) |

## Requirements

- Claude Code 2.1.299 or later.
- `git`, the GitHub CLI `gh` (logged in with the `repo` and `workflow` scopes), and `jq`.
- A separate GitHub account for the agent, such as a machine account. See [Agent account](docs/en/agent-account.md).
- For the built-in Next.js + PostgreSQL stack, also:
  - Node.js 22 or 24 (LTS);
  - pnpm;
  - Docker.

## Credits and license

- The workflow builds on [mattpocock/skills](https://github.com/mattpocock/skills) (MIT): grilling, domain modeling, TDD and the issue-tracker conventions. Templates adapted from those skills keep their attribution.
- This kit is released under the [MIT license](LICENSE).
