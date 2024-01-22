#!/usr/bin/env bash
set -e

current_branch="$(git rev-parse --abbrev-ref HEAD)"
release_branch="${1:-production}"

if [[ "$release_branch" == "production" && "$current_branch" != "staging" ]]; then
  echo "Releasing production can only be done while on staging branch"
  exit 1;
elif [[ "$release_branch" == "$current_branch" ]]; then
  echo "Releasing $release_branch can't be done while on $current_branch branch"
  echo "Make sure to checkout to your feature branch"
  exit 1;
fi

if [[ "$release_branch" == "alpha" || "$release_branch" == "beta" ]]; then
  echo "Deleting local and remote $release_branch branch"
  git branch -d "$release_branch" || true
  git push origin --delete "$release_branch" || true

  echo "Checking out to a clean $release_branch branch"
  git checkout -b "$release_branch";
  git push origin "$release_branch"
fi

echo "Running build in parallel to improve performance"
pnpm nx affected --verbose --target=build --parallel=6;

echo "Running release-local on affected projects"
pnpm nx affected --verbose --target=release-local --parallel=false;

echo "Checking out to $release_branch"
if [[ "$release_branch" == "production" && "$current_branch" != "staging" ]]; then
  git checkout "$release_branch";

  echo "Updating branch"
  git pull;

  echo "Merging changes"
  git merge --ff-only "$current_branch";
fi

echo "Pushing changes to $release_branch"
git push -u origin "$release_branch";
