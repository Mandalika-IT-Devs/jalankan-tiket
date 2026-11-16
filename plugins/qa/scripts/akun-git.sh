#!/usr/bin/env bash
# Makes git authenticate as one GitHub account in the given repositories, whatever account gh has active.
# Use it when the active gh account, such as an agent account, cannot reach the product's repository.
# The QA engineer runs it, never an agent: git then asks gh for that account's token at each fetch or push.
# The token is never printed or stored. Only git uses it; gh commands keep using the active account.
#
# Usage:
#   bash akun-git.sh <login> <repo dir>...                    set it in existing repositories
#   bash akun-git.sh <login> --clone <owner/name> <dir>       clone with it, and disable pushing
set -euo pipefail

login="${1:?usage: akun-git.sh <login> <repo dir>... | <login> --clone <owner/name> <dir>}"
shift
gh auth status --hostname github.com 2>&1 | grep -q "account $login" ||
  { echo "FAIL  gh has no login for $login. Run: gh auth login --hostname github.com"; exit 1; }

key='credential.https://github.com.helper'
# shellcheck disable=SC2016 # $1 and $(...) belong to the helper, which git runs later.
helper='!f() { test "$1" = get || exit 0; echo username=LOGIN; echo "password=$(gh auth token --hostname github.com --user LOGIN)"; }; f'
helper="${helper//LOGIN/$login}"

if [ "${1:-}" = "--clone" ]; then
  repo="${2:?missing <owner/name>}"
  dir="${3:?missing <dir>}"
  git clone --filter=blob:none -c "$key=" -c "$key=$helper" "https://github.com/$repo.git" "$dir"
  git -C "$dir" remote set-url --push origin DISABLED
  echo "OK    cloned $repo into $dir as $login, pushing disabled"
  exit 0
fi

[ "$#" -gt 0 ] || { echo "FAIL  name at least one repository folder"; exit 1; }
for dir in "$@"; do
  git -C "$dir" config --local --replace-all "$key" ''
  git -C "$dir" config --local --add "$key" "$helper"
  echo "OK    git in $dir now authenticates as $login"
done
