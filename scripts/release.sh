#!/usr/bin/env bash
set -e

current_branch="$(git rev-parse --abbrev-ref HEAD)"
release_branch="${1:-production}"

if [[ "$release_branch" == "production" && "$current_branch" != "staging" ]]; then
  echo "Releasing production can only be done while on staging branch"
  exit 1;
fi

git pull &&
pnpm nx affected --target=release-local --parallel=false &&
git checkout "$release_branch" &&
git merge --ff-only "$current_branch" &&
git push -u origin "$release_branch"
