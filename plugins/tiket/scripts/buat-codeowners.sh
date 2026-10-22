#!/usr/bin/env bash
# Writes .github/CODEOWNERS from .github/protected-paths.txt, so the two lists never disagree.
# Usage, from the repository root: bash buat-codeowners.sh @owner
set -euo pipefail

OWNER="${1:?usage: buat-codeowners.sh @owner}"
LIST=.github/protected-paths.txt
[ -f "$LIST" ] || { echo "Missing $LIST"; exit 1; }

{
  echo "# Generated from .github/protected-paths.txt by the jalankan-tiket kit. Edit that file, then run buat-codeowners.sh again."
  grep -Ev '^[[:space:]]*(#|$)' "$LIST" | while IFS= read -r path; do
    printf '/%s %s\n' "$path" "$OWNER"
  done
} > .github/CODEOWNERS

echo "wrote .github/CODEOWNERS"
