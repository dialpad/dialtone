#!/bin/bash

####################################################################################################################################
# run_migrations.sh                                                                                                                #
####################################################################################################################################
# Description:                                                                                                                     #
#  The following script will run the migrate script for css / less vars, component classes and utility classes against a directory #
# Args:                                                                                                                            #
#  -m <string>: A relative path to the class / var maps directory                                                                  #
#  -d <string>: A relative path to a directory or file to migrate                                                                  #
#  -c: Enables component class migrations                                                                                          #
####################################################################################################################################

# Usage method
usage() {
  echo "Usage: $0 [-m <string>] [-d <string>] -c";
  exit 1;
}

# Constants
MIGRATE_COMPONENT_CLASSES=false

# Get arguments
while getopts "m:d:c" option; do
  case "${option}" in
    m)
      MIGRATION_MAP_DIR=$OPTARG
      ;;
    d)
      MIGRATION_PATH=$OPTARG
      ;;
    c)
      MIGRATE_COMPONENT_CLASSES=true
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

if [ -z "$MIGRATION_PATH" ]
  then
    echo "Please provide a path to a directory or file to migrate"
    usage
    exit 1
fi

echo "Starting migration in 10 seconds"

echo "Migrating Old Mixins..."
# Old utility classes used as mixins that don't have !important, need to be migrated
# before these utility classes are migrated below.
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/old_mixins.txt -d ${MIGRATION_PATH} -a -r
echo "Old Mixins Migrated!"

if [ ${MIGRATE_COMPONENT_CLASSES} = true ]
then
  echo "Migrating Component Classes..."
  sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/component_class.txt -d ${MIGRATION_PATH} -r
  echo "Component Classes Migrated!"
fi

echo "Migrating Utility Classes..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/utility_class.txt -d ${MIGRATION_PATH} -r
echo "Utility Classes Migrated!"

echo "Migrating LESS Variables..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/less_var.txt -d ${MIGRATION_PATH} -v -r
echo "LESS Variables Migrated!"

echo "Migrating CSS Variables..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/css_var.txt -d ${MIGRATION_PATH} -v -r
echo "CSS Variables Migrated!"

echo "Migrating Dialtone Icons..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/icons.txt  -d ${MIGRATION_PATH} -v -r
echo "Dialtone Icons Migrated!"

echo "Migrating Auto Generated Dialtone Classes..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/auto_generated_classes.txt  -d ${MIGRATION_PATH} -a -r
echo "Auto Generated Dialtone Classes Migrated!"

echo "Migrating Class Corrections..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/migration_class_corrections.txt  -d ${MIGRATION_PATH} -r
echo "Class Corrections Migrated!"

echo "Migrating Mixin Corrections..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/migration_mixin_corrections.txt  -d ${MIGRATION_PATH} -a -r
echo "Mixin Corrections Migrated!"

echo "Migrating Corrections..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/migration_corrections.txt  -d ${MIGRATION_PATH} -v -r
echo "Corrections Migrated!"

echo "Migrating Handset Components..."
sh ./migrate.sh -m ${MIGRATION_MAP_DIR}/handset.txt  -d ${MIGRATION_PATH} -v -r
echo "Handset Components Migrated!"

echo "Migration Complete!"
