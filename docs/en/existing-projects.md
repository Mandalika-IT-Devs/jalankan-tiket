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

## Projects that already use an old copy of this workflow

If your repo already has its own coordinator in `.claude/skills/`, agents in `.claude/agents/`, and the CI jobs `kebersihan-pr` and `verify`, the plugin replaces that copy:
- The project's own rules in the old copy move into the project's files first: what the reviewer checks goes to `CODING_STANDARDS.md`, other rules go to `AGENTS.md`. Then the old copy is deleted in the adoption PR. The command is now `/tiket:jalankan`.
- Files with the same role under another name, such as `tiket.md` or `PANDUAN.md`, are renamed to the kit's names (`ticket.md`, `GUIDE.md`).
- Existing CI jobs are updated in place, without adding a duplicate job.
- Existing labels stay in use. If milestones are labels such as `M3`, the next milestone becomes the GitHub milestone `M4`.
- Ticket numbers continue from the last one.
- The existing PRD, open decisions, UAT, design and ADRs are kept. If the PRD already describes the product, the step after the adoption PR is merged is `/tiket:rencanakan-tahap`.

## Tips

- Start with a small milestone. The first tickets should close the contract gaps first, and only then add features.
