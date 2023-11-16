#!/bin/bash

#####################################################################################################################################
# run_validations.sh                                                                                                                #
#####################################################################################################################################
# Description:                                                                                                                      #
#  The following script will run the validate script for css / less vars, component classes and utility classes against a directory #
# Args:                                                                                                                             #
#  -m <string>: A relative path to the class / var validation maps directory                                                        #
#  -d <string>: A relative path to a directory to validate                                                                          #
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
      VALIDATION_DIR=$OPTARG
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

if [ -z "$VALIDATION_DIR" ]
  then
    echo "Please provide a path to a directory to validate"
    usage
    exit 1
fi

echo "Starting validation in 10 seconds"

echo "Validating Component Classes..."
sh ./validate.sh -f ${VALIDATION_MAP_DIR}/component_class.txt -d ${VALIDATION_DIR} -r
echo "Component Classes Validated!"

echo "Validating Utility Classes..."
sh ./validate.sh -f ${VALIDATION_MAP_DIR}/utility_class.txt -d ${VALIDATION_DIR} -r
echo "Utility Classes Validated!"

echo "Validating CSS Variables..."
sh ./validate.sh -f ${VALIDATION_MAP_DIR}/css_var.txt -d ${VALIDATION_DIR} -r
echo "CSS Variables Validated!"

echo "Validating LESS Variables..."
sh ./validate.sh -f ${VALIDATION_MAP_DIR}/less_var.txt -d ${VALIDATION_DIR} -r
echo "LESS Variables Validated!"

echo "Validation Complete!"
