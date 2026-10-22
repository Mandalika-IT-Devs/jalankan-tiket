<!-- Two tickets for deploying to one server (VPS). /tiket:rencanakan-tahap creates both only when the owner wants a deploy. Ticket A uses the readyForHuman label; ticket B uses readyForAgent and is Blocked by ticket A. -->

# Ticket A: [Txx] Set up the server and the deploy secrets (for the owner)

## What to build
The server and the keys that the deploy workflow needs. Only the owner can do these steps.

## In scope
- **A Linux server (VPS)** with Docker and Docker Compose, plus one user just for deploys.
- **A domain name** that points to the server. Access must use HTTPS, because browser features such as the camera and location only work over HTTPS.
- **Repository secrets `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`.** The SSH key is made only for deploys, and its public key is installed on the server.
- **An email provider**, if the product sends email.

For these steps, Claude can make an interactive guide script with the `wizard` skill from mattpocock-skills.

## Acceptance criteria
- [ ] `ssh <VPS_USER>@<VPS_HOST>` logs in with the deploy key.
- [ ] All three secrets are set in the repository.
- [ ] The domain points to the server.

## Blocked by
- None

# Ticket B: [Txx] Automatic deploy to the server

## What to build
Each time CI is green on `main`, the new version is installed on the server automatically.

## In scope
- **`Dockerfile`** for production.
- **`compose.prod.yml`**, with the application, PostgreSQL and an HTTPS proxy (for example Caddy) with automatic certificates.
- **`deploy/deploy.sh <commit>`.** This script runs on the server, in this order:
  1. fetch that commit;
  2. build;
  3. run the migrations;
  4. restart the application without deleting data;
  5. run a health check.
- **Backup:** a daily `pg_dump` to a separate volume, kept for as long as the owner decides, plus a restore script.
- **`docs/DEPLOY.md`:** a runbook for the first deploy, updates, health checks, backup and restore.
- **`.github/workflows/deploy.yml`** from the kit template, as a protected file. This issue is the owner's explicit instruction to add it, and its PR needs the owner-approved label.

## Acceptance criteria
- [ ] A merge to `main` starts a deploy, and the home page opens over HTTPS on the production domain.
- [ ] A second deploy of the same commit does not change any data.
- [ ] A daily backup is created, and a restore into an empty database works by following `docs/DEPLOY.md`.

## References
ADR-0001 (Deploy), the kit template `ci/deploy-ssh.yml`.

## Blocked by
- Ticket A
