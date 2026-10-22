# Triage labels

The skills in mattpocock-skills use five triage roles. This table maps each role to the label that this repo really uses. The label names come from the `labels` section of `.github/jalankan-tiket.json`, and `/tiket:cek-proyek` checks that the two files agree.

| Label in mattpocock/skills | Label in our tracker | Meaning |
|---|---|---|
| `needs-triage` | `{{LABEL_NEEDS_TRIAGE}}` | The owner needs to assess this issue |
| `needs-info` | `{{LABEL_NEEDS_INFO}}` | Waiting for the owner's answer. The coordinator skips it |
| `ready-for-agent` | `{{LABEL_READY_FOR_AGENT}}` | Fully specified and ready for an agent to work on |
| `ready-for-human` | `{{LABEL_READY_FOR_HUMAN}}` | Needs a human, for example because it involves credentials or a domain name |
| `wontfix` | `{{LABEL_WONTFIX}}` | Will not be done |

Besides these five labels there is the label `{{LABEL_OWNER_APPROVED}}`. The owner adds it to a PR that changes protected files. Agents never add it.
