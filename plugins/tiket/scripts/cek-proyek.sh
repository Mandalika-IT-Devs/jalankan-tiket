#!/usr/bin/env bash
# Checks the current project against the jalankan-tiket kit. Read-only.
# Usage, from the repository root: bash cek-proyek.sh <plugin-root>
# Prints one line per check (OK, INFO, WARN, FAIL) and exits non-zero when any check fails.
set -uo pipefail

ROOT="${1:?usage: cek-proyek.sh <plugin-root>}"
FAILS=0
ok() { printf 'OK    %s\n' "$1"; }
info() { printf 'INFO  %s: %s\n' "$1" "$2"; }
warn() { printf 'WARN  %s: %s\n' "$1" "$2"; }
fail() {
  printf 'FAIL  %s: %s\n' "$1" "$2"
  FAILS=$((FAILS + 1))
}
finish() {
  printf '\nSummary: %d FAIL\n' "$FAILS"
  [ "$FAILS" -eq 0 ]
  exit $?
}

# Repository
if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then ok "git repository"; else fail "git repository" "this folder is not a git repository"; fi
REMOTE=$(git remote get-url origin 2>/dev/null || true)
case "$REMOTE" in
  *github.com*) ok "GitHub remote ($REMOTE)" ;;
  "") fail "GitHub remote" "no origin remote" ;;
  *) fail "GitHub remote" "origin is not on GitHub: $REMOTE" ;;
esac

# Project config
CFG=.github/jalankan-tiket.json
if [ ! -f "$CFG" ]; then
  fail "config" "$CFG is missing: run /tiket:siapkan-proyek"
  finish
fi
if ! jq empty "$CFG" 2>/dev/null; then
  fail "config" "$CFG is not valid JSON"
  finish
fi
MISSING_KEYS=""
for key in kitVersion language verifyCommand domainModulePath ticketPrefix exampleMarker labels stack runner; do
  jq -e "has(\"$key\")" "$CFG" >/dev/null || MISSING_KEYS="$MISSING_KEYS $key"
done
if [ -z "$MISSING_KEYS" ]; then ok "config"; else fail "config" "missing keys:$MISSING_KEYS"; fi

# Kit version: a newer plugin matters only when MIGRATIONS.md lists changes to project files after kitVersion
KIT=$(jq -r .kitVersion "$CFG")
PLUGIN=$(jq -r .version "$ROOT/.claude-plugin/plugin.json")
PENDING=""
while read -r _ v; do
  if [ "$v" != "$KIT" ] && [ "$(printf '%s\n%s\n' "$KIT" "$v" | sort -V | tail -1)" = "$v" ]; then PENDING="$PENDING $v"; fi
done < <(grep -oE '^## [0-9]+\.[0-9]+\.[0-9]+' "$ROOT/MIGRATIONS.md")
if [ -n "$PENDING" ]; then
  warn "kit version" "project files are at $KIT; MIGRATIONS.md has changes for:$PENDING"
else
  ok "project files match the kit (kitVersion $KIT, plugin $PLUGIN)"
fi

# Required files
DOMAIN=$(jq -r '.domainModulePath // empty' "$CFG")
MISSING=""
for f in AGENTS.md CLAUDE.md CODING_STANDARDS.md GLOSSARY.md docs/PRD.md docs/OPEN-DECISIONS.md docs/UAT.md \
  docs/GUIDE.md docs/agents/issue-tracker.md docs/agents/triage-labels.md \
  docs/agents/domain.md tests/golden/NOTES.md .github/ISSUE_TEMPLATE/ticket.md .github/pull_request_template.md \
  .github/protected-paths.txt .github/CODEOWNERS .github/dependency-allowlist.txt .claude/settings.json; do
  [ -e "$f" ] || MISSING="$MISSING $f"
done
ls docs/adr/0001-*.md >/dev/null 2>&1 || MISSING="$MISSING docs/adr/0001-*.md"
ls docs/adr/0002-*.md >/dev/null 2>&1 || MISSING="$MISSING docs/adr/0002-*.md"
ls .github/workflows/*.yml >/dev/null 2>&1 || MISSING="$MISSING .github/workflows/*.yml"
[ -n "$DOMAIN" ] && { [ -e "${DOMAIN}AGENTS.md" ] || MISSING="$MISSING ${DOMAIN}AGENTS.md"; }
if [ -z "$MISSING" ]; then ok "required files"; else fail "required files" "missing:$MISSING"; fi

# Glossary: mattpocock-skills 1.3 and later read GLOSSARY.md only
if [ -e CONTEXT.md ]; then
  fail "glossary" "CONTEXT.md exists: rename it to GLOSSARY.md with git mv and update every reference"
elif [ -e GLOSSARY.md ]; then
  ok "glossary"
fi

# Labels: config, triage-labels.md and GitHub agree
ROLES="needsTriage needsInfo readyForAgent readyForHuman wontfix ownerApproved"
NAMES=""
for role in $ROLES; do
  name=$(jq -r ".labels.$role // empty" "$CFG")
  if [ -z "$name" ]; then
    fail "labels" "the config has no labels.$role"
    continue
  fi
  NAMES="$NAMES $name"
  grep -qF "\`$name\`" docs/agents/triage-labels.md 2>/dev/null || warn "labels" "docs/agents/triage-labels.md does not mention \`$name\` ($role)"
done
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  EXISTING=$(gh label list --limit 200 --json name --jq '.[].name' 2>/dev/null || true)
  if [ -n "$EXISTING" ]; then
    ABSENT=""
    for name in $NAMES; do printf '%s\n' "$EXISTING" | grep -qxF "$name" || ABSENT="$ABSENT $name"; done
    if [ -z "$ABSENT" ]; then ok "GitHub labels"; else fail "GitHub labels" "missing on GitHub:$ABSENT"; fi
  else
    warn "GitHub labels" "could not list the repository's labels"
  fi
else
  warn "GitHub" "gh is not logged in"
fi

# CODEOWNERS covers every protected path
if [ -f .github/protected-paths.txt ] && [ -f .github/CODEOWNERS ]; then
  GAPS=""
  while IFS= read -r path; do
    case "$path" in '' | '#'*) continue ;; esac
    grep -qF "/$path " .github/CODEOWNERS || GAPS="$GAPS $path"
  done < .github/protected-paths.txt
  if [ -z "$GAPS" ]; then ok "CODEOWNERS"; else warn "CODEOWNERS" "does not cover:$GAPS (run buat-codeowners.sh)"; fi
fi

# Agent guardrails and kit auto-update in the project settings
S=.claude/settings.json
if [ -f "$S" ]; then
  if jq -e '.enabledPlugins["tiket@jalankan-tiket"] == true' "$S" >/dev/null 2>&1; then ok "plugin enabled for the project"; else warn "settings" "tiket@jalankan-tiket is not enabled in $S"; fi
  if jq -e '.extraKnownMarketplaces["jalankan-tiket"].autoUpdate == true' "$S" >/dev/null 2>&1; then ok "kit auto-update"; else warn "settings" "the jalankan-tiket marketplace has no autoUpdate in $S"; fi
  APPROVED=$(jq -r .labels.ownerApproved "$CFG")
  if jq -e --arg rule "Bash(*${APPROVED}*)" '.permissions.deny | index($rule)' "$S" >/dev/null 2>&1; then ok "owner-approved label guarded"; else warn "settings" "no deny rule for commands that name '$APPROVED'"; fi
fi

# mattpocock-skills version against the versions the kit was tested with
INSTALLED="${CLAUDE_CONFIG_DIR:-$HOME/.claude}/plugins/installed_plugins.json"
TESTED=$(jq -r '.mattpocockSkills | join(" ")' "$ROOT/reference/tested-versions.json")
if [ -f "$INSTALLED" ]; then
  VERSION=$(jq -r '[.plugins["mattpocock-skills@claude-plugins-official"][]?.version] | first // empty' "$INSTALLED")
  if [ -z "$VERSION" ]; then
    warn "mattpocock-skills" "not installed from claude-plugins-official"
  elif jq -e --arg v "$VERSION" '.mattpocockSkills | index($v)' "$ROOT/reference/tested-versions.json" >/dev/null; then
    ok "mattpocock-skills $VERSION (tested)"
  else
    warn "mattpocock-skills" "$VERSION is not among the tested versions ($TESTED); /tiket:jalankan still checks the coupling points before it starts"
  fi
fi

# Dependency advisories: high and critical ones need an upgrade ticket
TOOL=""
AUDIT=""
if [ -f pnpm-lock.yaml ] && command -v pnpm >/dev/null; then
  TOOL="pnpm audit --prod"
  AUDIT=$(pnpm audit --prod --json 2>/dev/null)
elif [ -f package-lock.json ] && command -v npm >/dev/null; then
  TOOL="npm audit --omit=dev"
  AUDIT=$(npm audit --omit=dev --json 2>/dev/null)
fi
if [ -n "$TOOL" ]; then
  if SEVERE=$(printf '%s' "$AUDIT" | jq -er '(.metadata.vulnerabilities.high // 0) + (.metadata.vulnerabilities.critical // 0)' 2>/dev/null); then
    if [ "$SEVERE" -gt 0 ]; then
      PKGS=$(printf '%s' "$AUDIT" | jq -r '[((.advisories // {})[]? | select(.severity == "high" or .severity == "critical") | .module_name), ((.vulnerabilities // {}) | to_entries[]? | select(.value.severity == "high" or .value.severity == "critical") | .key)] | unique | join(", ")')
      fail "dependencies" "$SEVERE high or critical advisories ($TOOL) in: $PKGS. Upgrade them through a ticket"
    else
      ok "dependencies: no high or critical advisories ($TOOL)"
    fi
  else
    warn "dependencies" "could not run $TOOL"
  fi
elif [ -f package.json ]; then
  info "dependencies" "no pnpm or npm lockfile, so no advisory check"
fi

# Dependabot alerts: GitHub emails the owner when a dependency gets a new advisory
if command -v gh >/dev/null && gh auth status >/dev/null 2>&1; then
  SLUG=$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || true)
  if [ -n "$SLUG" ]; then
    if gh api "repos/$SLUG/vulnerability-alerts" >/dev/null 2>&1; then
      ok "Dependabot alerts"
    else
      warn "Dependabot alerts" "off. The owner turns them on with: gh api -X PUT repos/$SLUG/vulnerability-alerts"
    fi
  fi
fi

# Foundation of the reference stack
if [ "$(jq -r .stack "$CFG")" = nextjs-postgres ]; then
  if [ -f package.json ]; then
    if jq -e '.scripts.verify' package.json >/dev/null; then ok "verify script"; else fail "verify script" "package.json has no scripts.verify"; fi
  else
    info "foundation" "no package.json yet: the foundation ticket has not run"
  fi
fi

finish
