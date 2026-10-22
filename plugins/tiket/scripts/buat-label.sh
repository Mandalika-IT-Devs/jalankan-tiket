#!/usr/bin/env bash
# Creates the labels named in .github/jalankan-tiket.json that the GitHub repository lacks.
# Run from the repository root during setup, before .claude/settings.json exists.
set -euo pipefail

CFG=.github/jalankan-tiket.json
[ -f "$CFG" ] || { echo "Missing $CFG"; exit 1; }
LANGUAGE=$(jq -r .language "$CFG")
EXISTING=$(gh label list --limit 200 --json name --jq '.[].name')

create() { # role, colour, Indonesian description, English description
  local name desc
  name=$(jq -r ".labels.$1" "$CFG")
  if printf '%s\n' "$EXISTING" | grep -qxF "$name"; then
    echo "exists:  $name"
    return
  fi
  desc="$3"
  [ "$LANGUAGE" = en ] && desc="$4"
  gh label create "$name" --color "$2" --description "$desc" >/dev/null
  echo "created: $name"
}

create needsTriage ededed "Pemilik perlu menilai issue ini" "The owner needs to evaluate this issue"
create needsInfo d4c5f9 "Menunggu jawaban pemilik" "Waiting for the owner's answer"
create readyForAgent 0e8a16 "Spesifikasi lengkap, siap dikerjakan agent" "Fully specified, ready for an agent"
create readyForHuman 1d76db "Perlu dikerjakan manusia" "Needs a human"
create wontfix ffffff "Tidak akan dikerjakan" "Will not be done"
create ownerApproved 12a379 "Pemilik menyetujui perubahan berkas terlindungi (hanya pemilik yang memasang)" "The owner approves changes to protected files (set by the owner only)"
