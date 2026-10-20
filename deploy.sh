#!/usr/bin/env bash
# ============================================================================
# deploy.sh — commit and push the site to GitHub (Bash).
#
#   ./deploy.sh "your commit message"
#
# If no message is given, a timestamped one is used. GitHub Pages then
# rebuilds automatically from the `main` branch.
# ============================================================================

set -euo pipefail

REPO_URL="https://github.com/suman876-ops/suman-portfolio.git"
BRANCH="main"
MSG="${1:-update site ($(date '+%Y-%m-%d %H:%M'))}"

cd "$(dirname "$0")"

echo "▸ staging changes…"
git add -A

if git diff --cached --quiet; then
  echo "✓ nothing to commit — everything is already up to date."
  exit 0
fi

echo "▸ committing…"
git commit -m "$MSG"

echo "▸ pushing to $BRANCH…"
git push origin "$BRANCH"

echo "✓ pushed. GitHub Pages will rebuild in a minute or so:"
echo "  https://suman876-ops.github.io/suman-portfolio/"
