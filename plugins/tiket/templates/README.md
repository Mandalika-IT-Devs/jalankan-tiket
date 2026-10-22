# Project templates

`/tiket:siapkan-proyek` copies these files into a project. It fills each placeholder, then commits the result.

## Layout

- `common/` holds files that are the same in every project language.
- `id/` and `en/` hold the same files, with content in Indonesian and in English. Copy the folder that matches the project language.
- Every project uses the same **English file names**, whatever its language. That way the skills can name a file without knowing the language.
- The stack profile in `../stacks/<profile>/` adds its own files and fills the stack placeholders.

## Placeholders

| Placeholder | Filled with |
|---|---|
| `{{PROJECT_NAME}}` | The product's name, as the owner writes it |
| `{{PROJECT_SUMMARY}}` | One or two sentences: what the product is, who uses it, and what it leaves out |
| `{{REPO}}` | `owner/name` on GitHub |
| `{{OWNER_HANDLE}}` | The GitHub user or team that owns protected files, written with its `@` |
| `{{DATE}}` | The setup date, `YYYY-MM-DD` |
| `{{KIT_VERSION}}` | `version` from the plugin's `plugin.json` |
| `{{LANGUAGE}}` | `id` or `en` |
| `{{TICKET_PREFIX}}` | Usually `T` |
| `{{EXAMPLE_MARKER}}` | `[CONTOH]` in Indonesian projects, `[EXAMPLE]` in English ones |
| `{{LABEL_NEEDS_TRIAGE}}`, `{{LABEL_NEEDS_INFO}}`, `{{LABEL_READY_FOR_AGENT}}`, `{{LABEL_READY_FOR_HUMAN}}`, `{{LABEL_WONTFIX}}` | Triage label names. The defaults equal mattpocock-skills' role names. |
| `{{LABEL_OWNER_APPROVED}}` | `disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones |
| `{{STACK}}` | The stack profile name, or `custom` |
| `{{RUNNER}}` | `github-hosted` or `self-hosted` |
| `{{VERIFY_COMMAND}}`, `{{E2E_COMMAND}}` | From the stack profile. `{{E2E_COMMAND}}` becomes JSON `null` when the stack has no end-to-end tests |
| `{{DOMAIN_MODULE_PATH}}` | The pure domain module folder, with a trailing slash. From the stack profile |
| `{{COMMANDS_SOURCE}}` | Where the other commands are listed, such as `` `package.json` ``. From the stack profile |
| `{{STACK_STANDARDS}}` | A block of text from the stack profile |
| `{{ENVIRONMENT}}` | A block of text from the stack profile |
| `{{STACK_ALLOW_RULES}}` | The stack's extra permission rules, as JSON strings separated by commas. From the stack profile |
| `{{PORTS}}` | A JSON object of ports, from the stack profile, or `{}` |

## Lines for projects with a user interface

A line ending in `<!-- ui -->` applies only to a project with a user interface.
- With a UI, remove only the marker and keep the line.
- Without a UI, delete the whole line, and skip `docs/DESIGN.md`.

## Generated files

`/tiket:siapkan-proyek` generates `.github/CODEOWNERS` from `.github/protected-paths.txt`. It writes one line per path, `/<path> {{OWNER_HANDLE}}`, so the two files never disagree.
