# This script will take all the commits unique to your branch and copy them to a branch cut from staging-vue3
# the branch will have the same name as your current branch but suffixed with -vue3. You can then push this
# and make a PR into staging-vue3.

# The user can also pass in the range start commit manually, and changes will be copied from that point forward.
# Generally want to do this if you have already copied the branch, but then need to add more commits later.

# Usage:
# ./copy_vue3_pr.sh - copies all commits unique to this branch to a new branch suffixed with -vue3
# ./copy_vue3_pr.sh GIT_SHA - copies all commits AFTER GIT_SHA to the existing branch of the
#                             same name suffixed with -vue3

# original branch
BRANCH=$(git branch --show-current)

git checkout staging-vue3
git pull

if git show-ref --quiet "refs/heads/${BRANCH}-vue3"; then
  git checkout "${BRANCH}-vue3"
else
  git checkout -b "${BRANCH}-vue3"
fi

if [ -n "$1" ]; then
  # user manually passed in range start commit
  RANGE_START=$1
  git cherry-pick "$RANGE_START".."$BRANCH"
else
  git cherry-pick staging.."$BRANCH"
fi
