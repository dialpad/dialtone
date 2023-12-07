#!/usr/bin/env bash

current_branch="$(git rev-parse --abbrev-ref HEAD)"

#sync_changes () {
#  local src_version=$1
#  local dest_version=$2
#
#  while IFS= read -r line; do
#    echo -e "\033[0m"; # Reset text color
#
#    status=$(echo "$line" | awk '{print $1}')
#    src_file=$(echo "$line" | awk '{print $2}')
#    dest_file=${src_file/$src_version/$dest_version}
#    case $status in
#      R*)
#        renamed_file=$(echo "$line" | awk '{print $3}')
#        src_file=${dest_file}
#        dest_file=${renamed_file/$src_version/$dest_version}
#
#        echo -e "\033[0;33mRenaming file $src_file -> $dest_file"
#        git mv "$src_file" "$dest_file"
#      ;;
#      M)
#        echo -e "\033[0;34mCopying modified file $src_file -> $dest_file"
#        cp "$src_file" "$dest_file";
#      ;;
#      A)
#        echo -e "\033[0;32mCopying added file: $src_file -> $dest_file"
#        cp "$src_file" "$dest_file";
#        git add "$dest_file"
#      ;;
#      D)
#        echo -e "\033[0;31mDeleting file $dest_file"
#        git rm -r "$dest_file"
#      ;;
#      *)
#        echo "Unhandled case $status"
#        break
#      ;;
#    esac
#  done < <(git diff --name-status staging HEAD | awk -v filter_path="packages\\/$src_version" '$2 ~ filter_path {print}')
#}

sync_changes () {
  local src_version=$1
  local dest_version=$2

  if [[ $(git status --porcelain) ]]; then
    while IFS= read -r line <&3; do
      src_file=$(echo "$line" | awk '{print $2}');
      dest_file=${src_file/$src_version/$dest_version}
      echo "Checking diff with file: $src_file";
      patch=$(git diff staging HEAD -- "$src_file" | sed -e "s/packages\\/$src_version/packages\\/$dest_version/g");
      if echo "$patch" | git am --3way; then
        echo "Command succeeded";
      else
        read -p "Conflict merging the changes, do you want to skip? (y/N)" -n 1 -r;
        echo;
        if [[ $REPLY =~ ^[Yy]$ ]]; then
          echo "Skipping patching $dest_file";
          git am --skip
        else
          read -p "Resolve the conflicts and press <enter> to continue" -n 1 -r;
          git am --continue
        fi
      fi
    done 3< <(git diff --name-status staging HEAD -- "packages/$src_version/");

#    git diff HEAD~1 HEAD -- "packages/$src_version/" | sed -e "s/packages\\/$src_version/packages\\/$dest_version/g" | git am --3way
  else
    echo "No changes found from $3 -> $4"
  fi
}

#sync_changes () {
#  local src_version=$1
#  local dest_version=$2
#
#  if [[ ${git status --porcelain} ]]; then
#    git diff HEAD~1 HEAD -- "packages/$src_version/" | sed -e "s/packages\\/$src_version/packages\\/$dest_version/g" | git am --3way
#  else
#    echo "No changes found from $3 -> $4"
#  fi
#}

# If run from scripts folder, go to parent
#if [[ "$PWD" =~ [/\/scripts]$  ]]; then
#  cd ../
#fi

#mkdir /tmp/patches;

PS3='Please choose where you performed your changes: '
options=("Dialtone-vue 2" "Dialtone-vue 3" "Quit")
select opt in "${options[@]}"
do
    case $opt in
        "Dialtone-vue 2")
#          new_branch="$current_branch-vue2"
#          git checkout -b "$new_branch" "$current_branch"
          sync_changes 'dialtone-vue2' 'dialtone-vue3'
#          git commit -am "Sync dialtone-vue 2 changes"
#          git checkout "$current_branch"
#          git merge --no-commit "$new_branch"
#          git branch --delete "$new_branch"
          break
          ;;
        "Dialtone-vue 3")
#          new_branch="$current_branch-vue3"
#          git checkout -b "$new_branch" "$current_branch"
          sync_changes 'dialtone-vue3' 'dialtone-vue2'
#          git commit -am "Sync dialtone-vue 3 changes"
#          git checkout "$current_branch"
#          git merge --no-commit "$new_branch"
#          git branch --delete "$new_branch"
          break
          ;;
        "Quit")
          break
          ;;
        *) echo "invalid option $REPLY";;
    esac
done
