# Moving an existing project to the kit

You can install the kit in a repo that is already in use, without overwriting your files.

## Steps

1. **Open a Claude Code session in that repo, then type `/tiket:siapkan-proyek`.** Claude reads your repo, then proposes a stack and a verify command based on what is already there.
2. **Claude works on the branch `adopsi-jalankan-tiket`:**
   - Kit files that do not exist yet are created.
   - Existing files are kept. Claude only adds the parts that the kit needs, for example the sources-of-truth section and the "Agent skills" block in `AGENTS.md`.
   - `CONTEXT.md` is renamed to `GLOSSARY.md`, because mattpocock-skills 1.3 and later only read `GLOSSARY.md`.
   - An existing `.claude/settings.json` is merged. Your old rules are not deleted.
   - Existing CI is kept. The kit adds the `kebersihan-pr` job. You then choose: rename your existing test job to `verify` (recommended), or add a separate `verify` job.
3. **Gaps in the contract become the first tickets.** For example: there is no dead code detection yet, no import boundary check yet, or the business rules are not yet gathered in one domain module. Such gaps are not fixed silently. Each one becomes a ticket in milestone M1, starting from `[T00]`.
4. **Add the owner-approved label (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones) to the adoption PR, then merge it.**
5. **Run `/tiket:rencanakan-produk`.** Claude writes the PRD and the glossary from what the code does today, then asks you what it should do. You decide the rules, not the code.

After that, the flow is the same as for a new project: `/tiket:rencanakan-tahap`, then `/tiket:jalankan`.

## Tips

- Start with a small milestone. The first tickets should close the contract gaps first, and only then add features.
- If the repo uses an old copy of this workflow, for example `.claude/skills/jalankan-tiket`, delete that copy in the adoption PR, so that only the plugin version is used.
