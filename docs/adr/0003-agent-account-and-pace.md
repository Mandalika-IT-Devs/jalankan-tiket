---
status: accepted
date: 2026-10-26
---

# Agent account and pace

GitHub's abuse detection suspended an owner's personal account. Over three days, the kit had run in four of the owner's repositories under that account. It opened and merged about 40 PRs, created dozens of issues in quick bursts while planning, and added comments for every ticket. While the suspension lasted, the owner was locked out of every repository, and the coordinator stopped halfway through a ticket.

Large repositories run their automation through bot identities, such as GitHub Apps or machine accounts. CI volume and red runs are normal there, and the contributors' own accounts stay out of reach. The kit had no such separation: the agent wrote through the owner's login.

## Decision

**The agent writes through its own account.**
- A machine account or a GitHub App does the agent's writes, never the owner's personal account. The guide recommends a machine account, because a GitHub App's hour-long tokens are awkward for Claude Code on a laptop.
- Before its first write, every writing skill checks the active `gh` account against `.github/CODEOWNERS` and stops when it is a code owner. It also stops when `origin` uses SSH, because such a push goes out with the owner's key.
- The check needs no new config key. CODEOWNERS already names the owner, and setup still runs under the owner's account, because it creates the repository.
- Permission rules deny the agent `gh auth login`, `logout`, `switch`, `refresh`, `token` and `setup-git`. Switching accounts stays with the owner.

**The agent keeps a pace.**
- One coordinator runs per agent account, across repositories, guarded by a lock file on the machine.
- The agent waits at least 10 seconds between writes, and 30 seconds between new issues.
- It comments only when the owner must read something.
- It polls CI every 60 seconds, and it never polls while it waits for the owner.
- It stops the whole run, without retrying, on HTTP 403 or 429, a rate limit or a suspension.

**Nothing is pushed before the local checks pass.** The implementer and the coordinator both run the verify command and the end-to-end tests before every push.

**CI stays as it is.** The owner-approved check still fails until the owner adds the label. Nothing points to red runs as the cause: in the affected repository only three PRs ever needed the label, and busy public repositories have red runs every day. With a separate account, a later release can replace the label with a code-owner review where the plan supports it.

## Consequences

- Every project needs one extra account before `/tiket:rencanakan-produk`. One machine account can serve all of an owner's projects.
- Publishing a milestone of 20 tickets takes about 10 minutes.
- The lock file only guards one machine. Running the same agent account from two machines at once is a rule in the guide, not a check.
- The account check trusts CODEOWNERS. A project whose CODEOWNERS names only teams gets no warning when `gh` runs as the owner.
