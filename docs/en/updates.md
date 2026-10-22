# Updates

Three things can be updated. Each one updates in a different way.

| What is updated | Source | Automatic? |
|---|---|---|
| mattpocock-skills | Anthropic's official marketplace | Yes, by default in Claude Code |
| The `tiket` plugin | The `jalankan-tiket` marketplace | Yes, when auto-update is on |
| The files in each project | The kit templates | No, on purpose. Through a PR that you approve. |

## mattpocock-skills

The kit says that it "needs mattpocock-skills", without pinning a version. A new version of Matt's skills reaches your laptop when Anthropic updates it in the official marketplace.

A new version of Matt's skills sometimes changes something that the kit uses. For example, version 1.3 renamed `CONTEXT.md` to `GLOSSARY.md`. That is why the kit has three safeguards:
- **A release watcher.** The kit repo watches Matt's releases every day, and tests compatibility before a new version reaches users.
- **`/tiket:cek-proyek`.** This command warns you when the installed version of Matt's skills has not been tested with the kit.
- **`/tiket:jalankan`.** Before it starts, the coordinator checks the coupling points with Matt's skills. If one is broken, the coordinator stops with a clear message. It does not guess.

## The `tiket` plugin

- The kit is released in steps, with version numbers. You never receive a half-finished change.
- A project set up with `/tiket:siapkan-proyek` turns on auto-update for the kit automatically, through `.claude/settings.json`.
- To turn on auto-update by hand: `/plugin` → Marketplaces → `jalankan-tiket` → Enable auto-update.
- To update right now, run:

  ```
  claude plugin marketplace update jalankan-tiket
  claude plugin update tiket@jalankan-tiket
  ```

  Then type `/reload-plugins` in the session that is open.

## Project files

The files that the kit writes into your project do not change automatically, because they belong to the project and are protected. Examples are CI, templates and agent rules.

When a kit release changes those files, `/tiket:cek-proyek` tells you. Claude then prepares one update PR. All you need to do is add the owner-approved label (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones) to that PR.

The tested versions are listed in [Versions](versions.md).
