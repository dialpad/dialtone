---
type: workflow
category: workflows
keywords: [ci, github-actions, workflows, unit-tests, visual-tests, a11y, percy, deploy, bundle-size, lint, nx, gcp, storybook]
ai_summary: All GitHub Actions workflows in Dialtone — what each does, what triggers it, required checks before merge, and the tools used at each step.
last_updated: 2026-03-04
related_packages: [dialtone-vue, dialtone-documentation]
---

# CI Pipeline

Dialtone uses GitHub Actions for all CI. Workflows live in `.github/workflows/`. Every workflow uses a shared composite action at `.github/actions/setup-environment/` that installs the correct pnpm and Node.js versions and runs `pnpm install`.

## Environment Versions

The setup action reads these from the repo:

| Tool | Version | Source |
|------|---------|--------|
| Node.js | 24 | `.nvmrc` |
| pnpm | 9.9.0 | `packageManager` in root `package.json` |
| NX | 19.8.0 | `nx.json` |

All workflows set `HUSKY: 0` to disable git hooks in CI.

## Required Checks (Must Pass Before Merge to `staging`)

These checks are required on every PR:

| Check | Workflow | Command |
|-------|---------|---------|
| Lint PR Title | `lint-pr.yml` | `pnpm commitlint` against PR title |
| Unit Tests | `unit_tests.yml` | `pnpm nx run dialtone-vue:test:coverage` |
| Accessibility Tests | `a11y_tests.yml` | `pnpm nx run dialtone-vue:test:a11y` |
| Bundle Size Check | `bundle-size-check.yml` | `pnpm pack` + size comparison |
| Visual Tests | `visual_tests.yml` | `pnpm nx run dialtone-vue:test:visual` (required only with `visual-test-ready` label) |

---

## Workflow Reference

### `unit_tests.yml`

**Trigger:** Push to `staging` (paths: `packages/dialtone-vue/**`), PR to any branch (same paths)

**What it does:**
1. Setup environment
2. Run `pnpm nx run dialtone-vue:test:coverage`

Outputs a coverage report in JSON and HTML. Coverage thresholds enforced: 80% branches, 70% functions, 85% lines and statements. Build fails if thresholds are not met.

---

### `visual_tests.yml`

**Trigger:**
- Push to `staging` (CSS, token, Vue, story file paths)
- PR with `visual-test-ready` label (same paths)
- PR events: `unlabeled`, `labeled`, `synchronize`, `opened`

**What it does:**
1. If PR lacks both `visual-test-ready` and `no-visual-test` labels → posts a comment prompting for one
2. If `visual-test-ready` label is present → runs `pnpm nx run dialtone-vue:test:visual`

**Tool:** Percy (`PERCY_TOKEN` secret). Compares Storybook screenshots against the base branch.

`cancel-in-progress: false` — visual test runs are not cancelled when new commits push. This avoids wasting Percy snapshot quota on partial runs.

---

### `a11y_tests.yml`

**Trigger:** Push to `staging` or `production` (paths: `packages/dialtone-vue/**`), PR (same paths)

**What it does:**
1. Setup environment
2. `pnpm exec playwright install --with-deps` — installs Playwright browsers
3. `pnpm nx run dialtone-vue:test:a11y`

Uses Playwright to run accessibility checks in a real browser. Required check on all PRs touching dialtone-vue.

---

### `lint-pr.yml`

**Trigger:** PR to `staging` opened, edited, reopened, or synchronized

**What it does:**
1. Setup environment
2. Validates PR title against the conventional commit format:
   ```bash
   pnpm commitlint --verbose << EOF
   ${{ github.event.pull_request.title }}
   EOF
   ```

PR title must match: `type(scope): JIRA subject`. The PR title becomes the squash-merge commit message, so this validation directly controls the changelog and version bump.

---

### `bundle-size-check.yml`

**Trigger:** PR to `staging` opened, synchronized, reopened, labeled, unlabeled — unless `skip-bundle-size-check` label is present

**What it does:**
1. **`base-bundle-size` job** — Checks out the base branch, runs `pnpm pack`, measures tarball size in bytes
2. **`pr-bundle-size` job** — Checks out the PR branch, runs `pnpm pack`, measures tarball size
3. **`check-bundle-size-diff` job** — Compares the two sizes. If the PR branch is more than 5% larger, the check fails and a comment is posted on the PR with the size comparison

The 5% threshold is set via `INCREASE_THRESHOLD` environment variable.

---

### `deploy.yml`

**Trigger:**
- `workflow_dispatch` (manual)
- Push to `alpha`, `beta`, `production`, `staging`, `next` (filtered by CSS, icon, token, Vue, and docs file paths)
- PR (same path filter)

**What it does:**
1. `filter-actions` job — Uses `dorny/paths-filter` to determine whether documentation or Storybook changed
2. `check-dialpad-member` job — Verifies the actor is a Dialpad org member (push events only)
3. `deploy` job (matrix: documentation + storybook) — For each changed package:
   - Sets `BASE_URL` based on context:
     - PR: `deploy-previews/pr-{number}/`
     - Branch: `{branch_name}/`
     - Production: empty (root)
   - Builds: `pnpm nx run dialtone-documentation:build` or `pnpm nx run dialtone-vue:build-storybook`
   - Authenticates with GCP using Workload Identity (`DIALTONE_GCP_WIP`, `DIALTONE_GCP_SA`)
   - Cleans old GCS files (preserving `alpha/`, `beta/`, `deploy-previews/`, `staging/`, `next/`, `vue/` paths)
   - Uploads to `gs://dialtone.dialpad.com/`
   - Posts preview URLs as a PR comment

**Destinations:**
- Documentation: `gs://dialtone.dialpad.com/{context}/`
- Storybook: `gs://dialtone.dialpad.com/vue/{context}/`

---

### `release.yml`

**Trigger:**
- `schedule` — Cron `0 10 * * 2` (Tuesday 10 AM UTC)
- `workflow_dispatch` — Manual with package selector (all, or one specific package)

**Allowed branches:** `staging`, `alpha`, `beta`, `next`

**What it does:**
1. `get-branch-name` job — Detects current branch
2. `release` job — For each selected package, runs `pnpm nx run {packageName}:release`. Sets `RELEASE_TAG=latest` when on `staging`, otherwise uses branch name.
3. `update-production` job — Only runs when branch is `staging`. Fast-forward merges staging into production: `git merge --ff-only origin/staging && git push`

---

### `publish-web.yml`

**Trigger:**
- `workflow_dispatch` with package selector
- Push to `production`, `alpha`, `beta`, `next` when `package.json` files change

**What it does:**
Publishes each changed package to two registries: npm (public) and GitHub Packages (`@dialpad` scope).

1. `filter-actions` — Detects which packages have changed `package.json` (indicating a new version from semantic-release)
2. For each package × registry combination (matrix):
   - Sets `NODE_AUTH_TOKEN` and registry URL
   - Runs `pnpm nx run {package}:publish --publish-branch={branch} --tag={tag}`
3. A 15-second delay is added before publishing `dialtone-vue` due to npm rate limiting

**RELEASE_TAG:** `latest` on `production`, branch name on `alpha`/`beta`/`next`.

---

### `publish-ios.yml`

**Trigger:** `workflow_dispatch`, Push to `production` when `packages/dialtone-tokens/dist_ios/**` changes

**What it does:**
1. `pnpm nx run dialtone-tokens:build:ios`
2. Pushes the generated Swift output to the `dialpad/dialtone-tokens-swift` external repo

---

### `publish-android.yml`

**Trigger:** `workflow_dispatch`, Push to `production` when `gradle.properties` files change

**What it does:**
1. `pnpm nx run {package}:build:android`
2. `./gradlew publish` from the Android build directory

Requires Java 17 (Temurin, installed via `actions/setup-java@v4` with Gradle cache enabled).

---

### `push-translations.yml`

**Trigger:** Push to `staging` when `packages/dialtone-vue/localization/en-US.ftl` changes, or `workflow_dispatch`

**What it does:**
Uploads the English FTL translation file to the Smartling translation management service.

Secrets required: `SMARTLING_API_USER`, `SMARTLING_API_SECRET`, `SMARTLING_PROJECT_ID`.

---

### `pull-translations.yml`

**Trigger:** `workflow_dispatch`, schedule — `0 20 * * *` (daily at 8 PM UTC)

**What it does:**
1. Checks whether new translations are available from Smartling
2. If yes, pulls translated FTL files
3. Creates a branch `translation-sync-{timestamp}`
4. Deduplicates (checks for already-open translation PRs before creating a new one)
5. Opens a PR to `staging` titled `ci: [Automated] Sync Translations`

---

### `sync-figma-to-tokens.yml` / `sync-tokens-to-figma.yml`

Manual-only workflows (`workflow_dispatch`). See `workflow-figma-sync.md` for full documentation.

---

### `clean-preview.yml`

**Trigger:** PR closed (any branch)

**What it does:**
Deletes GCS objects for both the documentation and Storybook preview deployments when a PR is closed:
```
gcloud storage rm --recursive gs://dialtone.dialpad.com/deploy-previews/pr-{number}/
gcloud storage rm --recursive gs://dialtone.dialpad.com/vue/deploy-previews/pr-{number}/
```

---

### `upload-test-coverage.yml`

**Trigger:** `workflow_dispatch`, schedule — `0 0 1 * *` (1st of every month, midnight UTC)

**What it does:**
Runs test coverage, extracts stats via `scripts/extract-coverage.sh`, and uploads a JSON snapshot to `gs://dialtone-adoption-data/test-coverage/test-coverage-{timestamp}.json` for historical tracking.

---

## Secrets Reference

| Secret | Used By | Purpose |
|--------|---------|---------|
| `DIALTONE_CI_TOKEN` | release, deploy | GitHub token for cross-repo operations |
| `DIALTONE_GCP_WIP` | deploy, coverage upload | GCP Workload Identity Provider |
| `DIALTONE_GCP_SA` | deploy, coverage upload | GCP Service Account |
| `PERCY_TOKEN` | visual_tests | Percy visual regression service auth |
| `GH_ACTION_VARIABLES_SYNC_FIGMA_TOKEN` | figma sync | Figma personal access token |
| `SMARTLING_API_USER` | translations | Smartling API auth |
| `SMARTLING_API_SECRET` | translations | Smartling API auth |
| `NODE_AUTH_TOKEN` | publish-web | npm registry authentication |
| `GITHUB_TOKEN` | most workflows | Auto-provided by GitHub Actions |
