#!/usr/bin/env bash
set -e

branch="$(git rev-parse --abbrev-ref HEAD)"

if ! [[ "$branch" =~ ^staging(-vue3)?$ ]]; then
  echo "This script can only be run while on staging or staging-vue3 branches"
  exit 1;
fi

git pull &&
npx semantic-release --no-ci --extends ./release-local.config.cjs;

case $branch in
  "staging")
    git checkout production &&
    git merge --ff-only staging &&
    git push -u origin production
    ;;

  "staging-vue3")
    git checkout vue3 &&
    git merge --ff-only staging-vue3 &&
    git push -u origin vue3
    ;;
esac