# Releasing

## Requirements to run `semantic-release`, which is used in this guide <https://semantic-release.gitbook.io/semantic-release/#requirements>

`semantic-release` uses the commit messages to determine the consumer impact of changes in the codebase. In dialtone-tokens we use [conventional commits specification](https://www.conventionalcommits.org/en/v1.0.0/#specification) for commit messages, so semantic-release automatically determines the next semantic version number, generates a changelog and publishes the release.

| Commit Type | Release type           |
| ------------- |:-------------:|
| Commit with breaking change     | Major release |
| Commit with type feat      | Minor release      |
| Commit with type fix | Patch release      |
| Commit with type perf | Patch release      |

## Steps

In order to push the `production` branch to deploy the documentation site and/or trigger a release to [npmjs](https://npmjs.com) and Github Releases, you will need to either be an admin of the dialtone-tokens repository, be a user with the "Maintain" role or have manually been given permission on your user.

1. Make sure your `staging` and `production` branches are up-to-date locally. You should be in the `staging` branch. If you want to make a prerelease, it should be `beta` or `alpha` branch instead of `staging`.
2. Stop your local server and keep your working directory clean before versioning.
3. In your CLI window, run `pnpm run release`.
4. If there are changes that should trigger a release:
   - The script will update the `package.json` and `package-lock.json` files with the version number according to the types of changes introduced since the last release and will add release notes in the `CHANGELOG.MD` file.
   - A release commit and a git tag associated with this commit will be created and pushed to the remote.
5. If there are no relevant changes to trigger a release, you can still deploy changes to the documentation site.

---

**If you have made a production release:**

6. We are ready to deploy the release. Switch to the `production` branch: `git checkout production`.
7. Merge the release commits from `staging` using [`fast-forward` strategy](https://git-scm.com/docs/git-merge#Documentation/git-merge.txt---ff-only): `git merge staging --ff-only`.
8. If the commits merged correctly, we can now push to the remote: `git push`.

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

9. If there were changes to the library, GitHub Actions will now deploy a new release of dialtone-tokens to npm.
11. You should be able to see your deployment running at [Dialtone Tokens Github actions](https://github.com/dialpad/dialtone-tokens/actions).
12. When the Github Actions have been completed, the new version of the package should have been deployed to Github releases and npm.
13. Now you’re ready to update your projects to use the latest dialtone-tokens version 🎉.
