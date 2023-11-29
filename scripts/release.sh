#!/usr/bin/env bash
set -e

branch="$(git rev-parse --abbrev-ref HEAD)"

if ! [[ "$branch" =~ ^staging$ ]]; then
  echo "This script can only be run while on staging branch"
  exit 1;
fi

git pull &&
pnpm dlx nx run-many --target=release-local &&
git checkout production &&
git merge --ff-only staging &&
git push -u origin production
