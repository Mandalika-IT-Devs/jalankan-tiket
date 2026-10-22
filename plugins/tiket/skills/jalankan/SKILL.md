---
name: jalankan
description: Work every ready GitHub ticket through to a merge, one ticket per round, without waiting for a human.
disable-model-invocation: true
---

# Run tickets

You are the **coordinator**. Your job is to:
- pick tickets;
- dispatch the `tiket:pelaksana` and `tiket:peninjau` subagents;
- open pull requests, wait for CI and merge.

The application code itself is written by `tiket:pelaksana`. Work without asking the human and without progress summaries along the way. Stop only for a reason listed under **Stop**.

The state of the work lives on GitHub: issues, labels, branches and PRs. Running this skill again after an interruption therefore resumes where it stopped. Only one coordinator runs in a repository at a time.

## Before the first round

1. **Read the project config.** Read `.github/jalankan-tiket.json` (its keys are explained in `${CLAUDE_PLUGIN_ROOT}/reference/project-config.md`) and `AGENTS.md`.
   - Done when you can state `language`, `verifyCommand`, `ticketPrefix`, `exampleMarker` and every name under `labels`.
   - Everything you write for the owner uses the **project language** from `language`. That covers issues, PR bodies, comments and the final report.
   - If the config file is missing, stop and tell the owner to run `/tiket:siapkan-proyek`.
2. **Check the mattpocock-skills coupling.**
   - `GLOSSARY.md` exists at the repo root.
   - The `tdd` skill is available to you.

   If either check fails, stop and report it. The project or the kit needs an update, and `/tiket:cek-proyek` explains which.

## Round: repeat until the frontier is empty

1. **Sync.** Run `git checkout main`, then `git pull --ff-only`. The working tree must be clean. If it is not, run `git stash` and note the stash for the final report.
2. **Pick a ticket.** The **frontier** is every open issue that meets all three conditions:
   - it carries `labels.readyForAgent`;
   - it does not carry `labels.needsInfo`;
   - every issue in its "Blocked by" section is closed.

   Match `[<ticketPrefix><nn>]` in the title and take the smallest number. If a branch `<prefix in lower case><nn>-…` or an open PR already exists for that ticket, continue from there. An empty frontier goes to **Final report**.
3. **Start.** Create the branch `<prefix in lower case><nn>-<slug>` from `main`. Comment on the issue that automated work has started.
4. **Implement.** Dispatch `tiket:pelaksana` with:
   - the issue number;
   - the issue's full text with its comments (`gh issue view <n> --comments`);
   - the branch name.

   Act on its status:
   - `DONE`: go to step 5.
   - `NEEDS-DECISION` or `FAILED`: go to **Park**.
5. **Review.** Dispatch a fresh `tiket:peninjau`, so it starts with a clean context. Give it the issue number, the branch and the base `main`.
   - `PASS`: go to step 6.
   - `FIX`: send the findings to `tiket:pelaksana`, then review again with another fresh `tiket:peninjau`. After 3 rounds that still end in `FIX`, go to **Park**.
6. **Pull request.** Push the branch, then run `gh pr create`. Write the body from `.github/pull_request_template.md`. It contains:
   - `Closes #<n>`;
   - the ticked acceptance criteria;
   - the implementer's technical decisions;
   - the reviewer's summary;
   - the OPEN-DECISIONS example values that were used.

   The template is the only source for the body. The `pr` skill's format has no `Closes #n`, and CI requires it.

   If a PR already exists, for example a parked or draft PR:
   - Keep its description unchanged and push.
   - Post the update as a PR comment with `gh pr comment <pr> --body-file <file>`. The comment lists the owner decisions applied, any new technical decisions and the latest review result.
   - Then run `gh pr ready <pr>`.
7. **CI.** Run `gh pr checks <pr> --watch`.
   - **Green:** go to step 8.
   - **Red in verify or end-to-end tests:** read the log with `gh run view <run> --log-failed`.
     - If the failing test is one the diff does not touch, rerun the failed jobs once with `gh run rerun <run> --failed` and watch again. Note the test as a flaky-test candidate for the final report.
     - Otherwise send the log to `tiket:pelaksana`, push the fix and watch again. After 2 rounds that are still red, go to **Park**.
   - **Red because of a protected file or a dependency outside the allowlist:** go to **Park**. That decision belongs to the owner.
8. **Merge.** Run `gh pr merge <pr> --squash --delete-branch`. Comment on the issue with what was built, the tests that were added and the technical decisions. Return to step 1.

## Park

1. Add `labels.needsInfo` to the issue.
2. Comment on the issue for the owner, in plain words. Say what is being asked or what is stuck, as questions in the format of `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`.
3. If a PR exists, turn it into a draft with `gh pr ready <pr> --undo`.
4. Return to `main` and go to step 1. Other tickets may still be workable.

## Stop

- **Empty frontier:** write the **Final report**.
- **Access or quota runs out:** describe the last state. The next `/tiket:jalankan` resumes from there.
- **A check before the first round fails:** report which check failed and why.

## Final report

Write the final report for the owner, in plain words. It contains:
- **Tickets done:** each ticket's title and PR link.
- **Parked tickets:** one question per ticket.
- **Non-blocking questions:** numbered, one per decision.
- **Flaky-test candidates**, if there are any.
- **Next step:** answer the questions, record them with `/tiket:catat-keputusan`, then run `/tiket:jalankan` again. If every ticket of the milestone is closed, plan the next milestone with `/tiket:rencanakan-tahap` instead.

Every question follows `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`.

Also post each non-blocking question as a comment on its source issue. Head the comment "Pertanyaan untuk pemilik" in Indonesian projects, or "Question for the owner" in English ones. That way `/tiket:catat-keputusan` can still find the question in a later session.

## Guardrails

- Work on one ticket at a time, so that `main` moves forward in a straight line.
- Changes reach `main` only through a PR whose CI is green.
- Protected files are listed in `.github/protected-paths.txt`. Change them only when the issue carries the owner's explicit instruction. The `labels.ownerApproved` label belongs to the owner.
- Issues close through a merged PR (`Closes #n`), never by hand.
- Run each `gh` command on its own, without `&&`, `;` or pipes. That way every command matches the project's permission rules.
