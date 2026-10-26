# A PR that changes protected files

Some PRs do not come from a ticket. Examples:
- planning documents;
- the owner's decisions;
- adopting the kit;
- kit migrations.

These PRs change protected files, so they reach `main` through the steps below. CI requires every PR to close an issue, and it requires the owner-approved label on every change to a protected file. Every write to GitHub here follows `${CLAUDE_PLUGIN_ROOT}/reference/github-use.md`.

1. **Open an issue first.**
   - Title it with its kind, in the project language: `[Rencana] …` or `[Plan] …`, `[Keputusan] …` or `[Decision] …`, `[Kit] …`.
   - Leave off the ready-for-agent label. This issue is not a ticket.
   - In the body, quote the owner's instruction and list what will change.
2. **Open the PR.** Create a branch and commit. Once the project has code, run `verifyCommand`, and `e2eCommand` when the config sets it; both must be green before you push. Then push and run `gh pr create --title "…" --body-file <file>`. When the branch name is already taken, locally or on GitHub, add `-2`, `-3` and so on. The ticket template does not fit here. Write the body in this shape:
   1. `Closes #<issue>` on the first line;
   2. what changed, file by file;
   3. the decisions recorded, and any open decisions that are new;
   4. how the owner can check the change.
3. **Ask the owner to add the owner-approved label, then stop.** Give the PR link and say it is ready for the label. Only the owner adds it, and CI runs again when the label is added. Until then CI stays red, so do not wait for it and do not poll the PR.
4. **Merge** after the owner says the label is on. Check CI once with `gh pr checks <pr>`. While checks still run, wait with `gh pr checks <pr> --watch --interval 60`; this wait is part of the task the owner gave, also in apps that offer their own CI monitoring. When CI is green, run `gh pr merge <pr> --squash --delete-branch`.

A PR description is never edited after the PR is created. To correct something, post a PR comment.
