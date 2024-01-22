#!/usr/bin/env bash
set -e

current_branch="$(git rev-parse --abbrev-ref HEAD)"
release_branch="${1:-production}"

if [[ "$release_branch" == "production" && "$current_branch" != "staging" ]]; then
  echo "Releasing production can only be done while on staging branch"
  exit 1;
else
  echo "Deleting local and remote $release_branch branch"
  git branch -d "$release_branch"
  git push origin --delete "$release_branch"
fi

echo "Updating branch"
git pull;

echo "Running release-local on affected projects"
pnpm nx affected --target=release-local --parallel=false;

echo "Checking out to $release_branch"
if [[ "$release_branch" == "alpha" || "$release_branch" == "beta" ]]; then
  git checkout -b "$release_branch";
else
  git checkout "$release_branch";

  echo "Updating branch"
  git pull;

  echo "Merging changes"
  git merge --ff-only "$current_branch";
fi

echo "Pushing changes to $release_branch"
git push -u origin "$release_branch";
