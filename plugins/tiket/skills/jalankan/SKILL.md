---
name: jalankan
description: Work every ready GitHub ticket through to a merge, one ticket per round, without waiting for a human.
argument-hint: "[issue numbers or milestone, optional]"
disable-model-invocation: true
---

# Run tickets

You are the **coordinator**. Your job is to:
- pick tickets;
- dispatch the `tiket:pelaksana` and `tiket:peninjau` subagents;
- open pull requests, wait for CI and merge.

The application code itself is written by `tiket:pelaksana`. Work without asking the human and without progress summaries along the way. Stop only for a reason listed under **Stop**.

The state of the work lives on GitHub: issues, labels, branches and PRs. Running this skill again after an interruption therefore resumes where it stopped.

Every write to GitHub follows `${CLAUDE_PLUGIN_ROOT}/reference/github-use.md`: the agent account, one coordinator per account, the pace and the stop at a limit.

## Before the first round

1. **Read the project config.** Read `.github/jalankan-tiket.json` (its keys are explained in `${CLAUDE_PLUGIN_ROOT}/reference/project-config.md`) and `AGENTS.md`.
   - Done when you can state `language`, `verifyCommand`, `e2eCommand`, `ticketPrefix`, `exampleMarker` and every name under `labels`.
   - Everything you write for the owner uses the **project language** from `language`. That covers issues, PR bodies, comments, the final report and every message in this conversation, including the one-line status updates between tool calls, such as "T13: CI hijau, merge sekarang" in an Indonesian project. Never mix two languages in a message.
   - If the config file is missing, stop and tell the owner to run `/tiket:siapkan-proyek`.
2. **Check the mattpocock-skills coupling.**
   - `GLOSSARY.md` exists at the repo root.
   - The `tdd` skill is available to you.

   If either check fails, stop and report it. The project or the kit needs an update, and `/tiket:cek-proyek` explains which.
3. **Check the GitHub account and take the lock.** Follow sections 1 and 2 of `github-use.md`. When a check fails, stop and report it.

## Round: repeat until the frontier is empty

1. **Sync.** Write the current time into the coordinator lock. Run `git checkout main`, then `git pull --ff-only`. The working tree must be clean. If it is not, run `git stash` and note the stash for the final report.
2. **Pick a ticket.** The **frontier** is every open issue that meets all four conditions:
   - it carries `labels.readyForAgent`;
   - it does not carry `labels.needsInfo`;
   - every issue in its "Blocked by" section is closed;
   - it has no open PR that waits for the owner's label. Such a PR changes a file in `.github/protected-paths.txt` and lacks `labels.ownerApproved` (`gh pr view <pr> --json labels,files`). List each one in the final report.

   **Scope.** Text the owner typed after the command limits the frontier. Issue numbers (`#12 #15`) keep only those issues, and a milestone name (`M2`) keeps only that milestone's issues. Without text, the whole frontier counts. The text this time: "$ARGUMENTS".

   The **ticket id** is the bracketed part of the title: `[<ticketPrefix><nn>]`, or `[<ticketPrefix><nn>-b]` for a follow-up ticket. Take the smallest number; a follow-up comes right after its base number. If a branch named after the id or an open PR already exists for that ticket, continue from there. An open PR that now carries the owner's label continues at step 8. An empty frontier goes to **Final report**.
3. **Start.** Create the branch `<id in lower case>-<slug>` from `main`, for example `t04-b-batas-eksemplar`.
4. **Implement.** Dispatch `tiket:pelaksana` with:
   - the issue number;
   - the issue's full text with its comments (`gh issue view <n> --json title,body,comments`);
   - the branch name.

   Act on its status:
   - `DONE`: go to step 5.
   - `NEEDS-DECISION`, or `FAILED` because of the ticket: go to **Park**.
   - `FAILED` because this machine cannot run the checks, for example when the database is down: go to **Stop**. Parking would not help.
5. **Review.** Dispatch a fresh `tiket:peninjau`, so it starts with a clean context. Give it the issue number, the issue's full text with its comments, the branch and the base `main`.
   - `PASS`: go to step 6.
   - `FIX`: send the findings to `tiket:pelaksana`, then review again with another fresh `tiket:peninjau`. After 3 rounds that still end in `FIX`, go to **Park**.
6. **Verify locally.** Run `verifyCommand`, then `e2eCommand` when the config sets it. Nothing is pushed until both are green here.
   - **Both green:** go to step 7.
   - **Red:** send the output to `tiket:pelaksana`, then go back to step 5 with a fresh `tiket:peninjau`. This counts as one of the 3 review rounds.
   - **A check cannot run on this machine:** go to **Stop**.
7. **Pull request.** Push the branch, then run `gh pr create` with the title `<ticket id>: <summary>`, for example `T13: Peringatan anggota ganda`. Write the body from `.github/pull_request_template.md`. It contains:
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

   **Protected files.** When the diff changes a file in `.github/protected-paths.txt`, CI stays red until the owner adds `labels.ownerApproved`. Such a change is allowed only when the issue carries the owner's explicit instruction. Do not wait for CI on this PR. Instead, post one PR comment for the owner that names the protected files and asks for the label, then return to step 1. A later run merges the PR once the label is on.
8. **CI.** Run `gh pr checks <pr> --watch --interval 60`. The owner started this run to merge on green, so this wait is part of the run, also in apps that offer their own CI monitoring.
   - **Green:** go to step 9.
   - **Red in verify or end-to-end tests:** read the log with `gh run view <run> --log-failed`.
     - If the failing test is one the diff does not touch, rerun the failed jobs once with `gh run rerun <run> --failed` and watch again. Note the test as a flaky-test candidate for the final report.
     - Otherwise send the log to `tiket:pelaksana`. Run both checks of step 6 again before you push the fix, then watch again. After 2 rounds that are still red, go to **Park**.
   - **Red because of a protected file without the owner's instruction, or because of a dependency outside the allowlist:** go to **Park**. That decision belongs to the owner.
9. **Merge.** Run `gh pr merge <pr> --squash --delete-branch`. The PR description is the record of what was built, so the issue needs no extra comment. Return to step 1.

## Park

1. Add `labels.needsInfo` to the issue.
2. Comment on the issue for the owner, in plain words. Say what is being asked or what is stuck, as questions in the format of `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`.
3. If a PR exists, turn it into a draft with `gh pr ready <pr> --undo`.
4. Return to `main` and go to step 1. Other tickets may still be workable.

## Stop

Every stop deletes the coordinator lock.

- **Empty frontier:** write the **Final report**.
- **A limit or an access error** (section 4 of `github-use.md`): report the command that failed, its message and the last state. The next `/tiket:jalankan` resumes from there.
- **This machine cannot run the checks:** tell the owner what to start or fix, for example the database. The next `/tiket:jalankan` resumes from the branch.
- **A check before the first round fails:** report which check failed and why.

## Final report

Write the final report for the owner, in plain words. It contains:
- **Tickets done:** each ticket's title and PR link.
- **PRs waiting for the owner's label:** each PR link, with the protected files it changes.
- **Parked tickets:** one question per ticket.
- **Non-blocking questions:** numbered, one per decision. Every technical decision that starts with `Owner check:` becomes one.
- **Flaky-test candidates**, if there are any.
- **Next step:** answer the questions, record them with `/tiket:catat-keputusan`, then run `/tiket:jalankan` again. If every ticket of the milestone is closed, the milestone is ready for UAT with `docs/UAT.md`, and `/tiket:rencanakan-tahap` plans the next one once the owner has new work.

Every question follows `${CLAUDE_PLUGIN_ROOT}/reference/owner-questions.md`.

Also post the non-blocking questions on their source issues, in one comment per issue. Head the comment "Pertanyaan untuk pemilik" in Indonesian projects, or "Question for the owner" in English ones. That way `/tiket:catat-keputusan` can still find the questions in a later session.

## Guardrails

- Work on one ticket at a time, so that `main` moves forward in a straight line.
- Nothing is pushed before `verifyCommand` and `e2eCommand` are green on this machine.
- Changes reach `main` only through a PR whose CI is green.
- Protected files are listed in `.github/protected-paths.txt`. Change them only when the issue carries the owner's explicit instruction. The `labels.ownerApproved` label belongs to the owner.
- Issues close through a merged PR (`Closes #n`), never by hand.
- Every write to GitHub follows `github-use.md`.
- Run each `gh` command on its own, without `&&`, `;` or pipes. That way every command matches the project's permission rules.
