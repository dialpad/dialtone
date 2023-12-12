#!/usr/bin/env bash

#####################################################################################################################################
# dialtone-vue-sync.sh                                                                                                              #
#####################################################################################################################################
# Description:                                                                                                                      #
#  The following script will copy your changes from dialtone-vue 2 -> 3 or from dialtone-vue 3 -> 2.                                #
# Optional Parameters:                                                                                                              #
#  commit-sha / branch: revision number or branch name, if you provide one, it will compare it with current HEAD,                   #
#  if 2 are provided, it will compare the diff between the two.                                                                     #
# Example usage:                                                                                                                    #
#  dialtone-vue-sync.sh                                                                                                             #
#  dialtone-vue-sync.sh staging                                                                                                     #
#  dialtone-vue-sync.sh 16eb2969894dd93bbb09b4baa28677fa2fa970c2                                                                    #
#  dialtone-vue-sync.sh 16eb2969894dd93bbb09b4baa28677fa2fa970c2 59f4882be487d05eb20696162b14e9c7fcf5fdf5                           #
#####################################################################################################################################

before_commit=${1:-HEAD~1};
after_commit=${2:-HEAD};

sync_changes () {
  local src_version=$1;
  local dest_version=$2;
  local detected_diff;

  echo "Detecting changes with filter on packages/$src_version"
  detected_diff=$(git diff "$3" "$4" -- "packages/$src_version");

  if [[ $detected_diff ]]; then
    echo "Applying patch"
    echo "$detected_diff" | git apply -p3 --directory packages/"$dest_version" --3way;
  else
    echo "No changes found on packages/$src_version from $3 -> $4"
  fi
}

echo "Welcome to dialtone-vue sync script."
echo "This script will copy your changes from one dialtone-vue version to the other."
echo "By default the script will copy over the changes from the last commit, if you want to copy changes between"
echo "two arbitrary commits, use: dialtone-vue-sync.sh 'commit-sha/branch_name' 'commit-sha/branch_name'"
read -p "Comparing $before_commit -> $after_commit, do you want to continue? [Y/n]:" -n 1 -r reply;
echo;
if [[ "$reply" =~ ^([nN][oO]|[nN])$ ]]; then
    exit 0;
fi

PS3='Please choose where you performed your changes: '
options=("Dialtone-vue 2" "Dialtone-vue 3" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Dialtone-vue 2")
          sync_changes 'dialtone-vue2' 'dialtone-vue3' "$before_commit" "$after_commit"
          break
          ;;
        "Dialtone-vue 3")
          sync_changes 'dialtone-vue3' 'dialtone-vue2' "$before_commit" "$after_commit"
          break
          ;;
        "Quit")
          break
          ;;
        *) echo "invalid option $REPLY";;
    esac
done
