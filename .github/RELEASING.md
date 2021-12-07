# Releasing

## Requirements to run `semantic-release`, which is used in this guide https://semantic-release.gitbook.io/semantic-release/#requirements

`semantic-release` uses the commit messages to determine the consumer impact of changes in the codebase. In Dialtone Vue we use [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification) for commit messages, so semantic-release automatically determines the next semantic version number, generates a changelog and publishes the release.

| Commit Type | Release type           |
| ------------- |:-------------:|
| Commit with breaking change     | Major release |
| Commit with type feat      | Minor release      |
| Commit with type fix | Patch release      |
| Commit with type perf | Patch release      |

Since Dialtone Vue is a private repository, and semantic-release will push the release commit to the remote server when releasing,
it's required to set up SSH authentication in Github to authenticate to the remote server. See the [Github docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/about-ssh) to set up SSH credentials.
If you have correctly set up the SSH credentials, you can verify that semantic-release can push to the remote server by running on the `staging` branch: `npm run release -- --dry-run`.
With the `--dry-run` flag, you can get a preview of the pending release and if everything is okay, you can see in the output: `[semantic-release] › ✔  Allowed to push to the Git repository`. 

## Steps

In order to push the `production` branch to trigger a release to [npmjs](https://npmjs.com) and Github Releases, you will need to either be an admin of the Dialtone Vue repository, be a user with the "Maintain" role or have manually been given permission on your user.

1. Make sure your `staging` and `production` branches are up-to-date locally. You should be in the `staging` branch. If you want to make a prerelease, it should be `beta` or `alpha` branch instead of `staging`.
2. Stop your local server and keep your working directory clean before versioning.
3. In your CLI window, run `npm run release` from the Dialtone Vue repository directory.
4. The script will update the `package.json` and `package-lock.json` files with the version number according to the types of changes introduced since the last release and will add release notes in the `CHANGELOG.MD` file.
5. A release commit and a git tag associated with this commit will be created and pushed to the remote.

---

**If you have made a production release:**

6. We are ready to deploy the release. Switch to the `production` branch: `git checkout production`.
7. Merge the release commits from `staging` using [`fast-forward` strategy](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---ff-only): `git merge staging --ff-only`.
8. If the commits are merged correctly, it's ready to deploy and publish this release by pushing to the remote: `git push`. This will trigger the deploy through a Github Action.

---

**If you have made a pre-release (`alpha` or `beta`):**

6. Since your pre-release branch was pushed to the remote, the deploy Github Action should have been triggered.
7. Update the `staging` branch with the release you have made on `alpha` or `beta` branch:

Replace `$BRANCH` with `alpha` or `beta` depending on the pre-release you made:
```
git checkout staging
git merge --ff-only $BRANCH
```
8. Push to the remote: `git push`. Make sure `staging` and the release branch keep up-to-date after the release.

---

9. You should be able to see your deployment running at https://github.com/dialpad/dialtone-vue/actions.
10. When this Github Action has been completed, the new version of the package should have been deployed to Github releases, npm, and the documentation website (`vue.dialpad.design`) is now updated (if it was a production release).
11. Now you’re ready to update your projects to use the latest Dialtone Vue version 🎉.
