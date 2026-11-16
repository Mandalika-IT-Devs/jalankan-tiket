#!/usr/bin/env bash
# Checks that a product's .env.local holds a username and a password for every role in product.json.
# Usage, from the workspace root: bash cek-env.sh products/<slug>
# Prints variable names and OK/EMPTY/MISSING only. It never prints a value.
set -uo pipefail

dir="${1:?usage: cek-env.sh products/<slug>}"
product="$dir/product.json"
envfile="$dir/.env.local"

command -v jq >/dev/null || { echo "FAIL  jq is not installed"; exit 2; }
[ -f "$product" ] || { echo "FAIL  $product not found"; exit 2; }
[ -f "$envfile" ] || { echo "FAIL  .env.local not found in $dir. Copy .env.local.example to .env.local and fill it in."; exit 1; }

fails=0
while IFS= read -r prefix; do
  for suffix in USERNAME PASSWORD; do
    name="${prefix}_${suffix}"
    line=$(grep -E "^[[:space:]]*(export[[:space:]]+)?${name}=" "$envfile" | tail -n 1)
    if [ -z "$line" ]; then
      echo "FAIL  $name is missing"
      fails=$((fails + 1))
      continue
    fi
    value="${line#*=}"
    value=$(printf '%s' "$value" | tr -d "\"' \t\r")
    if [ -z "$value" ]; then
      echo "FAIL  $name is empty"
      fails=$((fails + 1))
    else
      echo "OK    $name is set"
    fi
  done
done < <(jq -r '.roles[].env' "$product")

[ "$fails" -eq 0 ]
