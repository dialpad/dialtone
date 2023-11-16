#!/bin/bash

#####################################################################################################################################
# validate_uv.sh                                                                                                                    #
#####################################################################################################################################
# Description:                                                                                                                      #
#  The following script will run the validate script for css / less vars, component classes and utility classes against a directory #
# Args:                                                                                                                             #
#  -m <string>: A relative path to the class / var validation maps directory                                                        #
#  -d <string>: A relative path to the UV directory                                                                                 #
#####################################################################################################################################

# Usage method
usage() {
  echo "Usage: $0 [-m <string>] [-d <string>]";
  exit 1;
}

# Get arguments
while getopts "m:d:" option; do
  case "${option}" in
    m)
      VALIDATION_MAP_DIR=$OPTARG
      ;;
    d)
      UV_DIR=$OPTARG
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$VALIDATION_MAP_DIR" ]
  then
    echo "Please provide a path to the validation maps directory"
    usage
    exit 1
fi

if [ -z "$UV_DIR" ]
  then
    echo "Please provide a path to the UC directory"
    usage
    exit 1
fi

echo "Starting UV validation in 10 seconds"

echo "Validating CSS Directory..."
sh ./run_validations.sh -m ${VALIDATION_MAP_DIR} -d ${UV_DIR}/static/css
echo "CSS Directory Validated!"

echo "Validating JS Directory..."
sh ./run_validations.sh -m ${VALIDATION_MAP_DIR} -d ${UV_DIR}/static/js
echo "JS Directory Validated!"

echo "UV Validation Complete!"
