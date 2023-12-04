# Dialtone 6 Migration

## Description

The following directory contains a set of scripts and migration maps used by the scripts in order to migrate our codebases
from Dialtone V5 to Dialtone V6 (Our In-House Design System).

## Scripts

### Migration Scripts

#### `run_migrations.sh`

The following script is used to run a set of migrations against a specified file or directory.

##### Usage

```bash
./run_migrations.sh -m <PATH_TO_MIGRATION_MAPS_DIRECTORY> -d <PATH_TO_DIRECTORY_OR_FILE_TO_MIGRATE>
```

##### Example

```bash
./run_migrations.sh -m ./maps -d ../../firespotter/ubervoice/static/js
```

##### Individual File Example

```bash
./run_migrations.sh -m ./maps -d ../../firespotter/ubervoice/static/js/setup/components/signup.vue
```

#### `migrate.sh`

The following script is used to run a single migration map against a specified file or directory.

##### Usage

```bash
./migrate.sh -m <PATH_TO_MIGRATION_MAP>  -d <PATH_TO_DIRECTORY_OR_FILE_TO_MIGRATE> -r -v
```

##### Example

```bash
./migrate.sh -m ./maps/less_var.txt  -d ../../firespotter/uc_client/less -r -v
```

### Validation Scripts

#### `validate_uc.sh`

The following script will run validate the Dialpad Meetings (UC) codebase for usages of
removed classes and variables.

##### Usage

```bash
./validate_uc.sh -m <PATH_TO_MIGRATION_MAPS_DIRECTORY> -d <PATH_TO_UC_DIRECTORY>
```

##### Example

```bash
./validate_uc.sh -m ./removed -d ../../firespotter/uc_client
```

#### `validate_uv.sh`

The following script will run validate the Dialpad (UV) codebase for usages of
removed classes and variables.

##### Usage

```bash
./validate_uv.sh -m <PATH_TO_MIGRATION_MAPS_DIRECTORY> -d <PATH_TO_UV_DIRECTORY>
```

##### Example

```bash
./validate_uv.sh -m ./removed -d ../../firespotter/ubervoice
```

#### `run_validations.sh`

The following script will validate a specified directory for usages of removed classes and variables.

##### Usage

```bash
./run_validations.sh -m <PATH_TO_VALIDATION_MAP_DIRECTORY> -d <PATH_TO_DIRECTORY_TO_MIGRATE>
```

##### Example

```bash
./run_validations.sh -m ./removed -d ../../firespotter/uc_client/src
```

#### `validate.sh`

The following script will validate a speficied directory for usages of removed classes and variables using
a provided validation list.

##### Usage

```bash
./validate.sh -f <PATH_TO_VALIDATION_MAP> -d <PATH_TO_DIRECTORY_TO_MIGRATE> -r
```

##### Example

```bash
./validate.sh -f ./removed/less_var.txt -d ../../firespotter/uc_client/src -r
```

## Known Issues

### Spacing

Some of the spacing values have changed within the Dialtone component classes. As a result, the migrated code may be
visually different. To address these issues, we will have to manually update components which do not match the previous
design.

## Assumptions

### Development Time

We did not want to spend too much time working on scripts to migrate our codebase. As a result, we have created a more or
less a find/replace solution; not a tokenizer. Due to this limitation, there will be cases of multiples of the same
classes and mixins since we cannot determine how many of a given class or mixin is in a given block of code.

## Migration Maps

These files are used by the scripts in this directory and contain a list of from:to mappings or a list of classnames to
validate against. The maps follow several formats that will be listed below.

### Formats

#### Variable / Class

These maps contain a list of from:to mappings separated by a `:` delimiter. The from mapping is space delimited.

```txt
d-old-dialtone-class:d-new-dialtone-class-1 d-new-dialtone-class-1
@old-dialtone-less-var:@new-dialtone-less-var
--old-dialtone-css-var:--new-dialtone-css-var
```

#### Auto Generated Class / Mixin Corrections

These maps contain a list of from:to mappings separated by a `|` delimiter. The delimiter was changed from `:` because
we are mapping classes that are auto generated and not accessible in Less to their equivalent styles which will contain
the `:` character.

#### Validation

These maps contain a list of classes and / or variables that no longer exist in Dialtone.

```txt
d-some-removed-dialtone-class
@some-removed-dialtone-less-variable
--some-removed-dialtone-css-variable
```

### Location(s)

The migration maps are located within the following sub directories.

```bash
/maps
/removed
```

### File(s)

#### `component_class.txt`

Contains mappings for Dialtone component classes.

#### `utility_class.txt`

Contains mappings for Dialtone utility classes.

#### `css_var.txt`

Contains mappings for Dialtone CSS variables.

#### `less_var.txt`

Contains mappings for Dialtone Less variables.

#### `icons.txt`

Contains mappings for Dialtone icons.

#### `auto_generated_classes.txt`

Contains mappings for auto generated Dialtone classes that will not resolve in Less.

#### `migration_class_corrections.txt`

Contains mappings for any incorrectly migrated Dialtone classes.

#### `migration_mixin_corrections.txt`

Contains mappings for any incorrectly migrated Dialtone mixins.

#### `migration_corrections.txt`

Contains mappings for anything else that might have been incorrectly migrated.

#### `handset.txt`

Contains mappings for handset components.

## Dialtone 6 Migration Guide (Public Link)

https://ginger-cairnsmore-d47.notion.site/Dialtone-V6-Migration-Guide-b071189401174341b40217969abce8a0
