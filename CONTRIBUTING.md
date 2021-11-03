# Contributing

Before contributing a new component to Dialtone Vue, please check the [Github Project][project] board to see if there is already an issue for it and if not, add it.

## Pull Requests

Changes to the Dialtone Vue library should ideally be separate from any other changes to other project code. All pull requests should be assigned to the `@dialpad/dialtone-vue` team and require at least one approval to merge.

## Requirements

Any new components or updates to existing components require at least:

- Unit tests covering the entire change
- Storybook documentation
- Unit tests are passing locally
  - `npm run test`
- Linters are passing locally
  - `npm run lint`
- Library builds locally
  - `npm run build`
- Documentation builds locally
  - `npm run storybook:build`

## Commit message convention

Dialtone Vue uses [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/) to have commit messages that can be used as part of the [semantic release process](RELEASING.md). For more information, see [COMMIT_CONVENTION.md](.github/COMMIT_CONVENTION.md).

### Git hooks

To enforce your commit message on the release branches (`production`, `staging`, `alpha` and `beta`) are correct according to the Conventional Commits specification, there is a `commit-msg` git hook that will be invoked by `git commit`.

## Versioning

Dialtone Vue follows [SemVer](https://semver.org/) for versioning and the commit message convention used in the project is aligned with SemVer by describing the features, fixes, and breaking changes made in commit messages.