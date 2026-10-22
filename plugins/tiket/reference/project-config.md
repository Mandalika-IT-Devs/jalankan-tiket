# Project config: `.github/jalankan-tiket.json`

`/tiket:siapkan-proyek` writes this file. It lives under `.github/`, so it is protected like the rest of that folder, and every tiket skill and agent reads it.

| Key | Meaning | Example |
|---|---|---|
| `kitVersion` | The kit version that the project's kit-made files match. `/tiket:cek-proyek` compares it with the installed plugin. | `"0.1.0"` |
| `language` | The **project language**, used for everything written for the owner: issues, PRs, comments, questions, reports and commit messages. Either `id` or `en`. | `"id"` |
| `verifyCommand` | The one command that must be green before every commit and in CI. | `"pnpm verify"` |
| `e2eCommand` | End-to-end tests that CI runs after the verify command. Set it to `null` when the project has none. | `"pnpm test:e2e"` |
| `ticketPrefix` | The letter in front of ticket numbers. | `"T"` |
| `exampleMarker` | The marker for example values from `docs/OPEN-DECISIONS.md` in seeds and tests. | `"[CONTOH]"` |
| `labels` | The GitHub label names for each role (see below). | see below |
| `stack` | The stack profile the project was set up from, or `"custom"`. | `"nextjs-postgres"` |
| `runner` | Where CI runs: `"github-hosted"` or `"self-hosted"`. | `"github-hosted"` |

The `ticketPrefix` appears in three places:
- issue titles, as `[T12]`;
- commit messages, as `T12:`;
- branch names, as `t12-`.

The `labels` object holds these roles:
- `needsTriage`: the owner still has to look at the issue.
- `needsInfo`: the issue waits for the owner's answer, and the coordinator skips it.
- `readyForAgent`: the issue is fully specified, and the coordinator may pick it.
- `readyForHuman`: the issue needs a person, for example to handle credentials or a domain name.
- `wontfix`: the issue will not be done.
- `ownerApproved`: only the owner sets this label. It goes on a PR that changes protected files.

`docs/agents/triage-labels.md` repeats the triage roles in the format that mattpocock-skills reads. `/tiket:cek-proyek` checks that the two files agree.

Example (Indonesian project):

```json
{
  "kitVersion": "0.1.0",
  "language": "id",
  "verifyCommand": "pnpm verify",
  "e2eCommand": "pnpm test:e2e",
  "ticketPrefix": "T",
  "exampleMarker": "[CONTOH]",
  "labels": {
    "needsTriage": "needs-triage",
    "needsInfo": "needs-info",
    "readyForAgent": "ready-for-agent",
    "readyForHuman": "ready-for-human",
    "wontfix": "wontfix",
    "ownerApproved": "disetujui-pemilik"
  },
  "stack": "nextjs-postgres",
  "runner": "github-hosted"
}
```
