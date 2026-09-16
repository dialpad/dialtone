# Release process

Combinator releases are CI-owned. Do not publish this package manually, and do
not run an old `release.sh` flow. There is no `release.sh` script in this
package.

## Release target

Nx exposes the release target:

```bash
pnpm nx run dialtone-combinator:release
```

That target runs:

```bash
pnpm semantic-release-plus --extends ./packages/combinator/release-ci.config.cjs
```

The config for this package is
`packages/combinator/release-ci.config.cjs`.

## Semantic-release behavior

The Combinator release config:

- analyzes Conventional Commit messages;
- treats `refactor` commits as patch releases;
- updates `packages/combinator/CHANGELOG.md`;
- updates `packages/combinator/CHANGELOG.json`;
- creates a GitHub release;
- uses tag format `combinator/v${version}`;
- runs `@semantic-release/npm` with `npmPublish: false`.

`npmPublish: false` means the release flow updates release metadata but does not
publish `@dialpad/dialtone-combinator` to npm from this package config.

## Branches

The package release config currently defines these release branches:

- `staging`
- `beta`
- `alpha`
- `next`

`beta`, `alpha`, and `next` are prerelease branches.

## Manual release work

Limit manual release work to fixing the release configuration, rerunning CI, or
validating generated changelog output. Never source a local npm token or publish
the package by hand as part of normal development.
