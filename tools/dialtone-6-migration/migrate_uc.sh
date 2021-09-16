#!/bin/bash

####################################################################################################################################
# migrate_uc.sh                                                                                                                    #
####################################################################################################################################
# Description:                                                                                                                     #
#  The following script will run the migrate script for css / less vars, component classes and utility classes against a directory #
# Args:                                                                                                                            #
#  -m <string>: A relative path to the class / var maps directory                                                                  #
#  -d <string>: A relative path to the UC directory                                                                                #
####################################################################################################################################

# Usage method
usage() {
  echo "Usage: $0 [-m <string>] [-d <string>]";
  exit 1;
}

# Get arguments
while getopts "m:d:" option; do
  case "${option}" in
    m)
      MIGRATION_MAP_DIR=$OPTARG
      ;;
    d)
      UC_DIR=$OPTARG
      ;;
    *)
      usage
      ;;
  esac
done

if [ -z "$MIGRATION_MAP_DIR" ]
  then
    echo "Please provide a path to the migration maps directory"
    usage
    exit 1
fi

if [ -z "$UC_DIR" ]
  then
    echo "Please provide a path to the UC directory"
    usage
    exit 1
fi

echo "Starting UC migration in 10 seconds"

echo "Migrating SRC Directory..."
sh ./run_migrations.sh -m ${MIGRATION_MAP_DIR} -d ${UC_DIR}/src
echo "SRC Directory Migrated!"

echo "Migrating Less Directory..."
sh ./run_migrations.sh -m ${MIGRATION_MAP_DIR} -d ${UC_DIR}/less
echo "Less Directory Migrated!"

echo "UC Migration Complete!"
