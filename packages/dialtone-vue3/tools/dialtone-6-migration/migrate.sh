#!/bin/bash

####################################################################################################################################
# migrate.sh                                                                                                                       #
####################################################################################################################################
# Description:                                                                                                                     #
#  The following script will automate replacing Dialtone V5 vars and classes with their Dialtone V6 counterparts                   #
# Args:                                                                                                                            #
#  -m <string>: A relative path to the migration map file, the file should contain lines with the following format OLD_STR:NEW_STR #
#  -d <string>: A relative path to the directory or file to be migrated                                                            #
#  -e <string>: Provides an exclusion string for files to be excluded in the search                                                #
#  -r:          Enables recursive traversal of the directory                                                                       #
#  -v:          Disables mixin replacement logic and enables variable replacement logic                                            #
#  -a:          Enables auto generated mixin replacement logic, disables all other logic                                           #
# Notes:                                                                                                                           #
#  Migration Map:                                                                                                                  #
#    Order matters, ensure that the longest matches appear first in the file.                                                      #
#    Example:                                                                                                                      #
#      class-to-migrate--variant-1                                                                                                 #
#      class-to-migrate--variant-2                                                                                                 #
#      class-to-migrate                                                                                                            #
####################################################################################################################################

# Usage method
usage() {
  echo "Usage: $0 [-m <string>] [-d <string>] [-e <string>] [-r] [-v] [-a]";
  exit 1;
}

# Replacement method
#  Args:
#    $1 <string>: The find string parsed from the file
#    $2 <string>: The replacement string parsed from the file
replaceString() {
  LOCAL_FIND_STRING=$1
  LOCAL_REPLACEMENT_STRING=$2

  # Find and replace strings ("" is required on macos when using xargs and sed)
  grep ${GREP_FLAGS[@]} ${GREP_INCLUDE[@]} ${GREP_EXCLUDE[@]} -e "${LOCAL_FIND_STRING}" "${MIGRATION_PATH}" | xargs sed -i "" "s/${LOCAL_FIND_STRING}/${LOCAL_REPLACEMENT_STRING}/g"
}

# Mixin replacement method
#  Args:
#    $1 <string>: The find string parsed from the file
#    $2 <string>: The replacement string parsed from the file
replaceMixins() {
  LOCAL_FIND_MIXIN_STRING_1="\.${1}();"
  LOCAL_FIND_MIXIN_STRING_2="\.${1};"
  LOCAL_REPLACEMENT_MIXIN_STRING=''

  # Get replacement classes
  IFS=' ' read -r -a LOCAL_REPLACEMENT_CLASSES <<< "${2}"
  LOCAL_REPLACEMENT_CLASS_COUNT=${#LOCAL_REPLACEMENT_CLASSES[@]}

  if [ ${LOCAL_REPLACEMENT_CLASS_COUNT} -eq 1 ]
    then
      replaceString "${LOCAL_FIND_MIXIN_STRING_1}" ".${LOCAL_REPLACEMENT_CLASSES[0]}();"
      replaceString "${LOCAL_FIND_MIXIN_STRING_2}" ".${LOCAL_REPLACEMENT_CLASSES[0]}();"
    elif [ ${LOCAL_REPLACEMENT_CLASS_COUNT} -gt 1 ]
      then
        MAX_INDEX=$((${LOCAL_REPLACEMENT_CLASS_COUNT} - 1))

        # Create replacement mixin string
        for index in "${!LOCAL_REPLACEMENT_CLASSES[@]}"
        do
          LOCAL_REPLACEMENT_MIXIN_STRING+=".${LOCAL_REPLACEMENT_CLASSES[index]}();"
          if [ ${index} -lt ${MAX_INDEX} ]
            then
              LOCAL_REPLACEMENT_MIXIN_STRING+=' '
          fi
        done

        replaceString "${LOCAL_FIND_MIXIN_STRING_1}" "${LOCAL_REPLACEMENT_MIXIN_STRING}"
        replaceString "${LOCAL_FIND_MIXIN_STRING_2}" "${LOCAL_REPLACEMENT_MIXIN_STRING}"
  fi
}

# Constants
GREP_FLAGS=(-l)
GREP_INCLUDE=(--include=\*.{js,vue,handlebars,less,css})
GREP_EXCLUDE=(--exclude-dir=node_modules)
REPLACE_VARS=false
REPLACE_AUTO_MIXINS=false

# Get arguments
while getopts "m:d:e:rva" option; do
  case "${option}" in
    m)
      MIGRATION_MAP_FILE=$OPTARG
      ;;
    d)
      MIGRATION_PATH=$(cd "$(dirname "$OPTARG")"; pwd)/$(basename "$OPTARG")
      ;;
    e)
      GREP_FLAGS+=(--exclude=${OPTARG})
      ;;
    r)
      GREP_FLAGS+=(-r)
      ;;
    v)
      REPLACE_VARS=true
      ;;
    a)
      REPLACE_AUTO_MIXINS=true
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$MIGRATION_MAP_FILE" ]
  then
    echo "Please provide a migration map file"
    usage
    exit 1
fi

if [ -z "$MIGRATION_PATH" ]
  then
    echo "Please provide a directory or file to migrate"
    usage
    exit 1
fi


while read -r line; do
  if [ ${REPLACE_AUTO_MIXINS} = true ]
  then
    # Parse line from migration map
    FIND_STRING="$(cut -d'|' -f1 <<< "$line")"
    REPLACEMENT_STRING="$(cut -d'|' -f2 <<< "$line")"

    # Replace auto generated mixins
    replaceString ".${FIND_STRING}();" "${REPLACEMENT_STRING}"
    replaceString ".${FIND_STRING};" "${REPLACEMENT_STRING}"
  else
    # Parse line from migration map
    FIND_STRING="$(cut -d':' -f1 <<< "$line")"
    REPLACEMENT_STRING="$(cut -d':' -f2 <<< "$line")"

    # Replace mixins
    if [ ${REPLACE_VARS} = false ]
      then
        replaceMixins "${FIND_STRING}" "${REPLACEMENT_STRING}"
    fi

    # Replace variables and classes
    replaceString "${FIND_STRING}" "${REPLACEMENT_STRING}"
  fi
done < "$MIGRATION_MAP_FILE"
