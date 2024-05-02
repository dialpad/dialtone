#!/usr/bin/env bash
set -e

current_branch="$(git rev-parse --abbrev-ref HEAD)";
release_branch="${1:-production}";

if [[ "$release_branch" == "production" && "$current_branch" != "staging" ]]; then
  echo "Releasing production can only be done while on staging branch";
  exit 1;
elif [[ "$release_branch" == "$current_branch" ]]; then
  echo "Releasing $release_branch can't be done while on $current_branch branch";
  echo "Make sure to checkout to your feature branch";
  exit 1;
fi

echo "Checking out to $release_branch";
git checkout "$release_branch";

echo "Updating branch";
git pull;

echo "Merging changes";
git merge --ff-only "$current_branch";

echo "Running release-local on affected projects";
if [[ "$release_branch" == "alpha" || "$release_branch" == "beta" ]]; then
  pnpm nx affected --target=release-local --base=staging --parallel=false --args="--dry-run";
else
  pnpm nx affected --target=release-local --base=production --parallel=false;
fi

echo "Pushing changes to $release_branch";
git push origin "$release_branch";

echo "Merge changes back to $current_branch";
git checkout "$current_branch";
git merge --ff-only "$release_branch";

echo "Pushing changes to $current_branch";
git push origin "$current_branch";
