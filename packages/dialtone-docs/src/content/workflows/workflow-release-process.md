---
type: workflow
category: workflows
keywords: [release, semantic-release, versioning, changelog, tags, tuesday, cron, staging, production, npm-publish]
ai_summary: How Dialtone releases work, including package versioning, changelogs and the currently skipped production-promotion job.
last_updated: 2026-10-26
related_packages: [dialtone-vue, dialtone-css, dialtone-tokens, dialtone-icons]
---

# Release Process

Dialtone uses `semantic-release` to version packages. Releases run on a scheduled Tuesday cadence from the `staging` branch and can also be triggered manually at any time.

## Release Schedule

The release workflow (`.github/workflows/release.yml`) runs automatically at **10:00 AM UTC every Tuesday** via GitHub Actions cron:

```
cron: "0 10 * * 2"
```

Manual releases can be triggered at any time via the `workflow_dispatch` event in GitHub Actions UI, with a package selector dropdown to release all packages or a single one.

## Which Branches Can Release

The release workflow only executes on these branches: `staging`, `alpha`, `beta`, `next`.

Releases from `staging` are tagged as `latest`. Releases from `alpha`, `beta`, or `next` are tagged with the branch name.

The configured `update-production` job is currently skipped because its condition reads a branch output from a job that is not listed in `needs`. A successful staging release therefore does not automatically fast-forward `production`. See [How Production Gets Updated](workflow-branch-strategy.md#how-production-gets-updated) for the dependency guard and intended fast-forward promotion step.

## Per-Package Versioning

Every publishable package has its own `release-ci.config.cjs` file and is versioned independently. Each package gets its own git tag using the format:

```
{packageName}/v{version}
```

Examples:
- `dialtone-tokens/v1.4.2`
- `dialtone-css/v8.17.0`
- `dialtone-vue/v3.122.0`
- `dialtone-icons/v4.35.0`
- `dialtone-mcp-server/v1.2.0`

Tags are what NX and semantic-release use to determine what has changed since the last release. The tag prefix is what lets semantic-release distinguish which package a tag belongs to in the monorepo — missing or wrong `tagFormat` breaks the release for that package.

The CLI and MCP server bundle query-core and its generated datasets. Both release configurations use `lookup-release.config.cjs` beside the root release configuration to select the consumed component, utility/token, icon/keyword, public documentation and generator sources. `semantic-release-plus` passes these paths to `git log` as Git pathspecs. Source-family selection is conservative: a matching source change can qualify even when it leaves a dataset unchanged. Unrelated packages and test-only paths are excluded.

For these selected commits, `build`, `chore`, `ci`, `docs` and `style` request a patch release. Nonbreaking `feat` commits request minors; `fix`, `perf` and `refactor` request patches. A breaking change confined to an upstream producer refreshes the bundled data with a tool patch. A commit touching the adapter itself, shared query-core or the shared runtime component-name helper retains normal breaking-footer semantics. Mixed source/tool changes retain those semantics too. Test paths do not count as contract changes.

The shared module delegates commit analysis and notes to the installed release libraries. It omits automated `chore(release)` commits from both steps, including copied breaking notes. Upstream breaking notices appear under **Bundled Dialtone data changes**, separate from tool contract notices. Normal `test` commits do not request a release.

The documentation app's manifest supplies parser dependencies, so it participates in release selection, lookup CI routing and the docs build hash. When adding a new consumed producer, update the shared source policy and the existing release-path suite; do not add artificial adapter commits to trigger publication.

## Packages Released

The release workflow covers 12 packages:

| NX target | Package |
|-----------|---------|
| `dialtone-tokens:release` | `@dialpad/dialtone-tokens` |
| `dialtone-css:release` | `@dialpad/dialtone-css` |
| `dialtone-vue:release` | `@dialpad/dialtone-vue` |
| `dialtone-icons:release` | `@dialpad/dialtone-icons` |
| `dialtone-emojis:release` | `@dialpad/dialtone-emojis` |
| `dialtone-mcp-server:release` | `@dialpad/dialtone-mcp-server` |
| `dialtone-language-server:release` | `@dialpad/language-server` |
| `dialtone:release` | `@dialpad/dialtone` (root bundle) |
| `dialtone-combinator:release` | `@dialpad/combinator` |
| `eslint-plugin-dialtone:release` | `eslint-plugin-dialtone` |
| `stylelint-plugin-dialtone:release` | `stylelint-plugin-dialtone` |
| `postcss-responsive-variations:release` | `@dialpad/postcss-responsive-variations` |

## What semantic-release Does

Each package runs `pnpm nx run {packageName}:release`, which executes the plugins in order defined in `release-ci.config.cjs`:

1. **`@semantic-release/commit-analyzer`** — Analyzes commits since the last tag. Determines version bump: `feat` → minor, `fix`/`perf`/`refactor` → patch, `BREAKING CHANGE` footer → major. If no release-triggering commits exist, no release happens.

2. **`@semantic-release/release-notes-generator`** — Generates release notes using the `@dialpad/conventional-changelog-angular` preset. Scopes are formatted from kebab-case to Title Case in the output.

3. **`@semantic-release/changelog`** — Writes release notes to `{packageRoot}/CHANGELOG.md`, prepending to any existing content.

4. **`@dialpad/semantic-release-changelog-json`** — Writes the same release notes to `{packageRoot}/CHANGELOG.json` in structured JSON format alongside the Markdown.

5. **`@semantic-release/npm`** — Updates `package.json` version. **`npmPublish: false`** — does NOT publish to npm. Publishing is handled separately by the `publish-web.yml` workflow.

6. **`@semantic-release/git`** — Commits `CHANGELOG.md`, `CHANGELOG.json`, and `package.json` back to the repo. Commit message format: `chore(release): NO-JIRA {packageName}/v${version}`.

7. **`@semantic-release/github`** — Creates a GitHub release at the new tag. PR comments and failure issue creation are both disabled (`successComment: false`, `failTitle: false`).

## npm Publishing

`npmPublish: false` in every `release-ci.config.cjs` means semantic-release only handles versioning and changelog — it does not publish to npm.

Actual npm publishing is done by a separate `publish-web.yml` workflow, which triggers on pushes to `production`, `alpha`, `beta`, and `next` when `package.json` files change. It publishes to both the public npm registry and GitHub Packages under the `@dialpad` scope.

## Packages With Extended Release Rules

`dialtone-icons` and `dialtone-emojis` have additional `releaseRules` that trigger patch releases for `build`, `chore`, `ci`, `docs`, `style`, and `test` commit types. This is intentional — icon and emoji additions often arrive via those commit types and should increment the version.

The CLI and MCP server have the source-qualified patch rules described above. Other packages retain their existing `feat`, `fix`, `perf`, `refactor` and `BREAKING CHANGE` rules.

## Release Commit Format

The git commit created by `@semantic-release/git` during a release always looks like:

```
chore(release): NO-JIRA dialtone-vue/v3.122.0
```

These commits can be identified in `git log` by the `chore(release)` type and the version tag in the subject. They are automated and should never be authored manually.

## What Gets Released vs. What Gets Skipped

semantic-release only creates a new version if commits since the last tag include a release-triggering type. If only `docs`, `style`, `test`, or `chore` commits exist since the last tag (for packages without extended rules), the release step exits with no version bump and no new tag.

To check what version would be released before triggering manually:

```bash
pnpm nx run dialtone-vue:release --dry-run
```
