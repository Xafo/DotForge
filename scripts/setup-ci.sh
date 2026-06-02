#!/bin/bash
set -euo pipefail

echo "==> Adding workflow scope to GitHub token..."
gh auth refresh --hostname github.com --scopes workflow

echo "==> Moving CI workflow to .github/workflows/..."
mkdir -p .github/workflows
cp ci-workflow.yml .github/workflows/ci.yml

echo "==> Committing and pushing..."
git add .github/workflows/ci.yml
git commit -m "Add CI workflow"
git push

echo "==> Done! CI pipeline is now active."
echo "    Check it at: https://github.com/Xafo/DotForge/actions"
