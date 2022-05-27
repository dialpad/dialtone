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

if [ -n "$1" ]; then
  # user manually passed in range start commit
  RANGE_START=$1
else
  # gets the sha of the commit BEFORE the first commit we want to include (you need to pass this to rebase --onto)
  BRANCH_FIRST_COMMIT=$(git log staging.."$BRANCH" --oneline | tail -1 | awk '{print $1;}')
  RANGE_START=$(git rev-parse "$BRANCH_FIRST_COMMIT"^)
fi

# gets the sha of the commit at the end of the range
RANGE_END=$(git log --oneline | head -n 1 | awk '{print $1;}')

git checkout staging-vue3
git pull

if git show-ref --quiet "refs/heads/${BRANCH}-vue3"; then
  git checkout "${BRANCH}-vue3"
else
  git checkout -b "${BRANCH}-vue3"
fi

# gets the most recent commit on this branch
NEW_BRANCH_COMMIT=$(git log --oneline | head -n 1 | awk '{print $1;}')

git rebase --onto "$NEW_BRANCH_COMMIT" "$RANGE_START" "$RANGE_END"
git rebase HEAD "${BRANCH}-vue3"
