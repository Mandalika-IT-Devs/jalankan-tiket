#!/usr/bin/env bash
# Registers a self-hosted GitHub Actions runner for {{REPO}} on this Linux machine and starts it as a service.
# Run it yourself in a terminal; it asks for your sudo password once:  bash .github/runner/pasang-runner.sh
set -euo pipefail

REPO="{{REPO}}"
SLUG="{{PROJECT_SLUG}}"
DIR="$HOME/actions-runner/$SLUG"

[ "$(uname -s)" = Linux ] || { echo "A self-hosted runner for this kit needs Linux: GitHub runs service containers only there."; exit 1; }
for tool in gh jq curl tar docker; do
  command -v "$tool" >/dev/null || { echo "Missing tool: $tool"; exit 1; }
done
gh auth status >/dev/null 2>&1 || { echo "Log in to GitHub first: gh auth login"; exit 1; }
docker info >/dev/null 2>&1 || { echo "Docker must run for this user without sudo: CI starts its database as a service container."; exit 1; }

case "$(uname -m)" in
  x86_64 | amd64) ARCH=x64 ;;
  aarch64 | arm64) ARCH=arm64 ;;
  *) echo "Unsupported CPU: $(uname -m)"; exit 1 ;;
esac

mkdir -p "$DIR"
cd "$DIR"
if [ ! -x ./config.sh ]; then
  VERSION=$(gh api repos/actions/runner/releases/latest --jq .tag_name)
  VERSION=${VERSION#v}
  echo "Downloading actions-runner $VERSION (linux-$ARCH) into $DIR"
  curl -fsSL -o runner.tar.gz "https://github.com/actions/runner/releases/download/v$VERSION/actions-runner-linux-$ARCH-$VERSION.tar.gz"
  tar xzf runner.tar.gz
  rm runner.tar.gz
fi

TOKEN=$(gh api -X POST "repos/$REPO/actions/runners/registration-token" --jq .token)
./config.sh --unattended --replace \
  --url "https://github.com/$REPO" --token "$TOKEN" \
  --name "$(hostname)-$SLUG" --labels self-hosted,linux

sudo ./svc.sh install "$USER"
sudo ./svc.sh start

echo
echo "The runner for $REPO is registered and running as a service (folder: $DIR)."
echo "Browser tests need system libraries once per machine: sudo npx playwright install-deps chromium"
