# Changelog

All notable changes to the `tiket` plugin. Versions follow `plugins/tiket/.claude-plugin/plugin.json`. Changes to files the kit writes into projects also get a section in `plugins/tiket/MIGRATIONS.md`.

## 0.1.1 (unreleased)

- Talk to the owner in one language only. Before the project language is chosen, `/tiket:siapkan-proyek` uses the language the owner writes in, or the system locale (`$LANG`). It no longer writes its first questions in two languages.
- `/tiket:siapkan-proyek` connects a GitHub repository the owner already created, when it is empty or holds only a README or license.

## 0.1.0 (unreleased)

First version, extracted from the workflow two projects used before.

- `/tiket:jalankan`: the coordinator, with the `tiket:pelaksana` and `tiket:peninjau` subagents.
- `/tiket:siapkan-proyek` for new and existing projects, and `/tiket:cek-proyek`.
- `/tiket:rencanakan-produk`, `/tiket:rencanakan-tahap` and `/tiket:catat-keputusan`.
- Project templates in Indonesian and English.
- The tested `nextjs-postgres` stack profile, with CI for GitHub-hosted and self-hosted runners and optional SSH deploy.
- Depends on mattpocock-skills from `claude-plugins-official`. Tested with 1.3.1.
