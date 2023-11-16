#!/bin/bash

##############################################################################################################################################
# validate.sh                                                                                                                                #
##############################################################################################################################################
# Description:                                                                                                                               #
#  The following script will return the number of occurences of classes and variables removed from the new Dialtone version                  #
# Args:                                                                                                                                      #
#  -f <string>: A relative path to a file containing classes and variables that have been removed from the new Dialtone version              #
#  -d <string>: A relative path to the directory to be validated                                                                             #
#  -r:          Enables recursive traversal of the directory                                                                                 #                                                                                                              #
##############################################################################################################################################

# Usage method
usage() {
  echo "Usage: $0 [-f <string>] [-d <string>] [-r]";
  exit 1;
}

# Constants
GREP_FLAGS=()

# Get arguments
while getopts "f:d:r" option; do
  case "${option}" in
    f)
      VALIDATION_FILE=$OPTARG
      ;;
    d)
      DIRECTORY=$(cd "$(dirname "$OPTARG")"; pwd)/$(basename "$OPTARG")
      ;;
    r)
      GREP_FLAGS+=(-r)
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$VALIDATION_FILE" ]
  then
    echo "Please provide a validation file"
    usage
    exit 1
fi

if [ -z "$DIRECTORY" ]
  then
    echo "Please provide a directory to validate"
    usage
    exit 1
fi

while read -r line; do
  # Count the number of occurances of a removed class or variable 
  OCCURENCES=$(grep ${GREP_FLAGS[@]} -e "${line}" "${DIRECTORY}" | wc -l | xargs)

  if [ ${OCCURENCES} -gt 0 ]
    then
      echo "${line}: ${OCCURENCES}"
  fi
done < "$VALIDATION_FILE"
