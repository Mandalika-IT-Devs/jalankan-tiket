---
name: cek-proyek
description: Check the project against the jalankan-tiket kit, explain any problem in plain words, and name the next step.
disable-model-invocation: true
---

# Check the project

1. **Run the checks.** From the repository root, run `bash ${CLAUDE_PLUGIN_ROOT}/scripts/cek-proyek.sh ${CLAUDE_PLUGIN_ROOT}`. Each line it prints is OK, INFO, WARN or FAIL.
2. **Find the project language.** Read `language` in `.github/jalankan-tiket.json`. Every message to the owner uses this language, including the one-line status updates between tool calls, such as "Sekarang migrasi 0.1.6: .env.ci" in an Indonesian project. Never mix two languages in a message. If the config is missing, use the language the owner writes in.
3. **Explain each FAIL and WARN** in plain words, with its fix. Who carries out a fix depends on what it touches:
   - **No owner decision, no protected file:** fix it yourself.
   - **Labels, rulesets or other repository settings:** give the owner the command to type with `!` in the session. The project's permission rules keep these changes with the owner.
   - **The GitHub account or the remote:** link the guide page `https://github.com/Mandalika-IT-Devs/jalankan-tiket/blob/main/docs/<language>/agent-account.md`. Switching accounts belongs to the owner, and `/tiket:jalankan` does not start until it is done.
   - **A protected file:** follow `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`, with an issue titled `[Kit] …`.
   - **Dependencies with high or critical advisories:** an upgrade ticket. Give the owner `/tiket:rencanakan-tahap` followed by the packages and the versions that close the advisories, then `/tiket:jalankan`.
4. **Handle a kit-version warning.** The script warns only when `${CLAUDE_PLUGIN_ROOT}/MIGRATIONS.md` lists changes to project files after `kitVersion`.
   - Apply every section the warning names in one PR, following `${CLAUDE_PLUGIN_ROOT}/reference/owner-pr.md`.
   - The issue is `[Kit] Pembaruan ke <newest version>` (`[Kit] Update to <newest version>` in English projects), and the branch is `kit-v<newest version>`.
   - The same PR sets `kitVersion` to the newest version.
5. **Name the next step** from the project's state. Use the first row that applies:

   | Project state | Next step |
   |---|---|
   | A setup file FAILs | the fixes above, or `/tiket:siapkan-proyek` |
   | An owner PR (`[Rencana]`, `[Keputusan]`, `[Kit]`, or their English titles) is still open | the owner checks it and adds the owner-approved label; merge it before `/tiket:jalankan` |
   | The dependency check FAILs | an upgrade ticket through `/tiket:rencanakan-tahap`, then `/tiket:jalankan` |
   | `docs/PRD.md` is still the empty template | put material in `docs/input/`, then run `/tiket:rencanakan-produk` |
   | Open issues carry the needs-info label | the owner answers them, then runs `/tiket:catat-keputusan` |
   | Ready tickets are on the frontier | `/tiket:jalankan` |
   | An open milestone has every ticket closed | `/retro`, then UAT with `docs/UAT.md` |
   | Anything else | nothing is due. When the owner has new work, `/tiket:rencanakan-tahap` turns it into tickets |
