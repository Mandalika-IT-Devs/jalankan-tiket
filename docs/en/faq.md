# FAQ and common problems

**The `/tiket:…` commands do not appear.**
Open a new session or type `/reload-plugins`. Then check `/plugin`: `tiket@jalankan-tiket` must show as enabled.

**The `tiket` plugin fails to load with the message "dependency mattpocock-skills is not installed".**
Anthropic's official marketplace has not been added yet. Type `/plugin marketplace add anthropics/claude-plugins-official`, then `/reload-plugins`.

**Matt's skills appear twice.**
"Skills For Real Engineers" from claude.ai is an old copy of mattpocock-skills. Turn that copy off in the claude.ai plugin settings.

**`/tiket:jalankan` stops right away because of "coupling".**
One of the coupling points with mattpocock-skills is broken, for example `GLOSSARY.md` cannot be found. Run `/tiket:cek-proyek` to see what needs fixing.

**CI never starts.**
- **Your own runner:** make sure the machine is on and the runner service is running.
- **GitHub runner in a private repo:** check the minutes quota and the spending limit in GitHub's billing settings.

**CI is red in `kebersihan-pr` because of a protected file.**
That PR changes a protected document or rule. If you did ask for the change, add the owner-approved label (`disetujui-pemilik` in Indonesian projects, `owner-approved` in English ones). CI runs again by itself.

**A test sometimes passes and sometimes fails.**
If the change does not touch that test, the coordinator reruns the failed job once and notes the test in the report. Create a small ticket to fix it, because an unstable test can get tickets parked.

**In Auto mode, merging a planning or decision PR is refused.**
The Auto mode classifier may refuse an approval that you did not type yourself in that session, such as one passed on from another session. You can continue in either of two ways:
- type the approval directly in that session, for example "go ahead and merge";
- press **Squash and merge** on the PR page on GitHub.

**Claude's quota runs out halfway.**
That is fine. The state of the work is stored on GitHub. Type `/tiket:jalankan` again when the quota is back.

**Two people want to run tickets at the same time.**
Don't. Two coordinators would take the same ticket. Agree on one person per repo at a time.

**Claude asks too many questions while planning.**
That is on purpose. Every clear answer now keeps a ticket from being parked later. You can answer "agree to all" to accept every recommendation.
