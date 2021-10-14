# Releasing

In order to push the production branch to trigger a build to [npmjs](https://npmjs.com), you will need to either be an admin of the dialtone repository, be a user with the "Maintain" role or have manually been given permission on your user.

1. Make sure your staging and production branches are up-to-date locally. You should be in the `staging` branch. If you are doing a prerelease you should be in whatever named branch you have been working off for the prerelease. Also it’s a good idea to stop your local server while versioning.
2. In your CLI window, run `./release.sh` from the dialtone repository directory.
3. It will prompt you to enter a version. enter major, minor, or patch depending on what your change consists of. Major versions are breaking changes. Minor versions are large changes but backward compatible. Patches are bug fixes to existing Dialtone items. You may also enter an exact version if you need to.
> Note on a prerelease our convention is major.minor.patch-prerelease.buildmetadata ex. `6.0.0-alpha.1`.
4. After entering your version number the package.json version numbers will be updated and committed with a git tag matching the version you entered. This will then be automatically pushed to the remote
5. `git checkout production` to move to the production branch
> Note if you would like to deploy a prerelease (alpha or beta). You would do this on a branch named `alpha` or `beta` instead of `production`. This will automatically tag the deployment to npm as a alpha or beta release so npm does not consider it to be the latest version. It could be installed with the command `npm i dialtone-vue@beta`
6. `git merge staging --ff-only` (or your prerelease working branch) to merge the changes to this branch
7. `git push` to push the branch. This will trigger the deploy.
8. You should be able to see your deploy running at https://github.com/dialpad/dialtone-vue/actions
9. When this has completed the new version of the package has been deployed to npm, and the documentation website (`vue.dialpad.design`) is now updated.
10. Finally you need to [draft a release on Github](https://github.com/dialpad/dialtone-vue/releases/new).
11. Now you’re done.
