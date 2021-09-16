#!/bin/bash

####################################################################################################################################
# migrate_uv.sh                                                                                                                    #
####################################################################################################################################
# Description:                                                                                                                     #
#  The following script will run the migrate script for css / less vars, component classes and utility classes against a directory #
# Args:                                                                                                                            #
#  -m <string>: A relative path to the class / var maps directory                                                                  #
#  -d <string>: A relative path to the UV directory                                                                                #
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
      UV_DIR=$OPTARG
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

if [ -z "$UV_DIR" ]
  then
    echo "Please provide a path to the UC directory"
    usage
    exit 1
fi

echo "Starting UV migration in 10 seconds"

echo "Migrating CSS Directory..."
sh ./run_migrations.sh -m ${MIGRATION_MAP_DIR} -d ${UV_DIR}/static/css
echo "CSS Directory Migrated!"

echo "Migrating JS Directory..."
sh ./run_migrations.sh -m ${MIGRATION_MAP_DIR} -d ${UV_DIR}/static/js
echo "JS Directory Migrated!"

echo "UV Migration Complete!"
