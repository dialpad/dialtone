# Temporary branching strategy while Dialtone 8 migration is in progress.

Until the migrations to Dialtone 8 are complete we need to perform all changes to Dialtone 8 branches in addition to the main branch and release them as separate packages. Below is the process on how to do this on each repo.

## Dialtone

1. Make a PR into branch `staging`.
This PR should use old dialtone 7 variables, so that means `var(--size-400)` instead of `var(--dt-size-400)`. `var(--purple-400)` instead of `var(--dt-color-purple-400)`.
2. Merge your commit after review.
3. Cherry pick your commit from staging into `version8` branch.
4. run the migrations from the [migration guide](https://github.com/dialpad/dialtone/blob/version8/migration_guide/Dialtone_8.md) to convert it to the new dialtone 8 variables
5. Make sure the dialtone-vue version installed on the `version8` branch is the latest version of @dialpad/dialtone-vue@next-vue3. If not update it with `npm install -D @dialpad/dialtone-vue@next-vue3`
6. commit this to the `version8` branch

### Releasing

Until we are done with the migrations, we must release all changes made on the `staging` branch to the `next` branch as well:

1. a change or multiple changes were committed to the `staging` branch.
2. release the staging branch using our regular process.
3. either cherry-pick individual commits or merge staging into branch `version8`.
4. in `version8` branch run `npm run release`
5. checkout the `next` branch and merge `version8` branch via `git merge version8 --ff-only`
6. push the branch and the github action to deploy it will trigger

## Dialtone Vue

1. Make a PR into branch `staging`
2. Merge your commit after review.
3. Cherry pick your commit from staging into `dialtone8` branch.
4. If there is any usage of dialtone CSS variables in your change you must run the migrations from the [migration guide](https://github.com/dialpad/dialtone/blob/version8/migration_guide/Dialtone_8.md) to convert it to the new dialtone 8 variables
5. Make sure the dialtone version installed on the `dialtone8` branch is the latest version of @dialpad/dialtone@next. If not update it with `npm install @dialpad/dialtone@next`
6. commit this to the `dialtone8` branch

### Releasing

Until we are done with the migrations, we must release all changes made on the `staging` branch to the `next` branch as well:

1. a change or multiple changes were committed to the `staging` branch.
2. release the staging branch using our regular process.
3. either cherry-pick individual commits or merge staging into branch `dialtone8`.
4. in `dialtone8` branch run `npm run release`
5. checkout the `next` branch and merge `dialtone8` branch via `git merge dialtone8 --ff-only`
6. push the branch and the github action to deploy it will trigger

## Dialtone Vue (Vue 3)

1. Make a PR into branch `staging-vue3`
2. Merge your commit after review.
3. Cherry pick your commit from staging into `dialtone8-vue3` branch.
4. If there is any usage of dialtone CSS variables in your change you must run the migrations from the [migration guide](https://github.com/dialpad/dialtone/blob/version8/migration_guide/Dialtone_8.md) to convert it to the new dialtone 8 variables
5. Make sure the dialtone version installed on the `dialtone8-vue3` branch is the latest version of @dialpad/dialtone@next-vue3. If not update it with `npm install @dialpad/dialtone@next-vue3`
6. commit this to the `dialtone8-vue3` branch.

### Releasing

Until we are done with the migrations, we must release all changes made on the `staging-vue3` branch to the `next-vue3` branch as well:

1. a change or multiple changes were committed to the `staging-vue3` branch.
2. release the staging-vue3 branch using our regular process.
3. either cherry-pick individual commits or merge staging into branch `dialtone8-vue3`.
4. in `dialtone8-vue3` branch run `npm run release`
5. checkout the `next-vue3` branch and merge `dialtone8-vue3` branch via `git merge dialtone8-vue3 --ff-only`
6. push the branch and the github action to deploy it will trigger

## External committers

In order to reduce the complexity our external committers have to deal with, we should perform any dialtone 7 -> dialtone 8 migrations for them. This should be fairly minimal as most external contributions we get are into dialtone-vue, but many times recipe components have styles embedded in them because they do not have a corresponding dialtone component. So if there is a new recipe component it is likely we will have to migrate it. We should periodically merge changes by others from `staging` to `version8` and `dialtone8` and check and migrate anything that is needed.
