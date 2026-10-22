---
name: cek-proyek
description: Check the project against the jalankan-tiket kit, explain any problem in plain words, and name the next step.
disable-model-invocation: true
---

# Check the project

1. **Run the checks.** From the repository root, run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/cek-proyek.sh ${CLAUDE_PLUGIN_ROOT}`. Each line it prints is OK, INFO, WARN or FAIL.
2. **Find the project language.** Read `language` in `.github/jalankan-tiket.json`. Everything you tell the owner uses this language. If the config is missing, use the language the owner writes in.
3. **Explain each FAIL and WARN** in plain words, with its fix. Who carries out a fix depends on what it touches:
   - **No owner decision, no protected file:** fix it yourself.
   - **Labels, rulesets or other repository settings:** give the owner the command to type with `!` in the session. The project's permission rules keep these changes with the owner.
   - **A protected file:** make the change on a branch, open a PR, and ask the owner to add the owner-approved label.
4. **Handle a kit-version warning.** The script warns only when `${CLAUDE_PLUGIN_ROOT}/MIGRATIONS.md` lists changes to project files after `kitVersion`. Apply every section it names on one branch, `kit-v<newest version>`, in one PR. That PR also sets `kitVersion` to the newest version. Then ask the owner to add the owner-approved label.
5. **Name the next step** from the project's state. Use the first row that applies:

   | Project state | Next step |
   |---|---|
   | A setup file FAILs | the fixes above, or `/tiket:siapkan-proyek` |
   | `docs/PRD.md` is still the empty template | put material in `docs/input/`, then run `/tiket:rencanakan-produk` |
   | No open milestone holds open tickets | `/tiket:rencanakan-tahap` |
   | Open issues carry the needs-info label | the owner answers them, then runs `/tiket:catat-keputusan` |
   | Ready tickets are on the frontier | `/tiket:jalankan` |
   | Every ticket of the milestone is closed | `/retro`, then either `/tiket:rencanakan-tahap` for the next milestone or UAT with `docs/UAT.md` |
