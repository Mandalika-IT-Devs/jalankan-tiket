#!/usr/bin/env bash
# Checks the kit's own consistency. Run from the repository root; CI runs it on every push and PR.
# 1. The Indonesian and English copies of the guide, templates and stack texts hold the same files.
# 2. Each pair of copies uses the same placeholders, the same number of times.
# 3. JSON files are valid. Templates are checked after filling their placeholders with sample values.
set -uo pipefail

FAILS=0
fail() {
  printf 'FAIL  %s\n' "$1"
  FAILS=$((FAILS + 1))
}

pair() { # Indonesian folder, English folder
  local id="$1" en="$2"
  diff <(cd "$id" && find . -type f | sort) <(cd "$en" && find . -type f | sort) >/dev/null ||
    fail "$id and $en do not hold the same files: $(diff <(cd "$id" && find . -type f | sort) <(cd "$en" && find . -type f | sort) | grep '^[<>]' | tr '\n' ' ')"
  while IFS= read -r f; do
    [ -f "$en/$f" ] || continue
    a=$(grep -oE '\{\{[A-Z_]+\}\}' "$id/$f" | sort | uniq -c)
    b=$(grep -oE '\{\{[A-Z_]+\}\}' "$en/$f" | sort | uniq -c)
    [ "$a" = "$b" ] || fail "placeholders differ between $id/$f and $en/$f"
  done < <(cd "$id" && find . -type f | sed 's#^\./##')
}

pair docs/id docs/en
pair plugins/tiket/templates/id plugins/tiket/templates/en
pair plugins/tiket/stacks/nextjs-postgres/id plugins/tiket/stacks/nextjs-postgres/en

# Plain JSON files
while IFS= read -r f; do
  jq empty "$f" 2>/dev/null || fail "invalid JSON: $f"
done < <(find . -name '*.json' -not -path './.git/*' -not -path './plugins/tiket/templates/common/*')

# JSON templates, filled with sample values
fill() {
  sed -e 's#"{{[A-Z_]*}}"#"x"#g' -e 's#{{E2E_COMMAND}}#null#g' -e 's#{{PORTS}}#{}#g' \
    -e 's#{{STACK_ALLOW_RULES}}#"Bash(x *)"#g' -e 's#{{[A-Z_]*}}#x#g' "$1"
}
for f in plugins/tiket/templates/common/.github/jalankan-tiket.json plugins/tiket/templates/common/.claude/settings.json \
  plugins/tiket/templates/common/.github/ruleset-main.json; do
  fill "$f" | jq empty 2>/dev/null || fail "template does not become valid JSON when filled: $f"
done

if [ "$FAILS" -eq 0 ]; then echo "OK    kit is consistent"; else printf '\n%d FAIL\n' "$FAILS"; fi
[ "$FAILS" -eq 0 ]
