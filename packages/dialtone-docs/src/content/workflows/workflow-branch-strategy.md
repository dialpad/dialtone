---
type: workflow
category: workflows
keywords: [branch, staging, production, alpha, beta, PR, pull-request, merge, hotfix, deploy, preview, branch-naming]
ai_summary: Dialtone branch strategy — staging-first development, PR routing, and the currently skipped automatic production-promotion job.
last_updated: 2026-10-23
related_packages: []
---

# Branch Strategy

Dialtone uses a `staging`-first branch model. All development flows through `staging`. Never commit directly to `production`; promotion uses a fast-forward merge from `staging`. The configured automatic promotion job is currently skipped because of its dependency guard, as described below.

## Long-Lived Branches

| Branch | Purpose |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `staging` | Default development base and PR target. Explicit user instructions and the actual PR target govern exceptions. |
| `production` | Stable released branch. Promotion uses `git merge --ff-only origin/staging`; its configured automatic job is currently skipped. Never committed to directly. |
| `alpha` | Pre-release channel for early-access features. Published to npm with `alpha` dist-tag. |
| `beta` | Pre-release channel for stabilization before production. Published to npm with `beta` dist-tag. |
| `next` | Future release candidates. Published to npm with `next` dist-tag. |

All other branches are short-lived feature branches created per change and deleted after merge.

## Where PRs Go

`staging` is the default base and PR target. Follow an explicit user instruction or the actual PR target when it differs; do not change release branches directly. The [root safeguards](../../../../../AGENTS.md) govern branch safety and user-work preservation.

When `staging` is the selected target, the flow is:

1. Create a branch off `staging`
2. Do the work, push commits
3. Open a PR into `staging`
4. Get at least one approving review
5. Merge (squash merge into `staging`)
6. Branch is deleted

The configured automatic promotion job is currently skipped; the next release run does not automatically move these changes to `production`.

## Branch Naming

Use the repository's ticketed branch convention, or `NO-JIRA` only when explicitly chosen. Examples:

```
feat/DLT-1234-short-description
fix/DLT-5678-what-is-fixed
docs/DLT-9012-what-is-documented
chore/NO-JIRA-maintenance-task
```

Release eligibility and channel depend on the selected branch; see the [release workflow](../../../../../.github/workflows/release.yml). Commit and package release configuration determine which packages and versions are released. Do not infer ticket authorization from branch history.

## How Production Gets Updated

The release workflow supports manual selection of packages; it does not require every package to receive a new version. Its `update-production` job is currently skipped: the branch condition reads `needs.get-branch-name.outputs.current_branch`, but `needs` lists only `release`. GitHub exposes only [direct dependency outputs](https://docs.github.com/en/actions/reference/workflows-and-actions/contexts#needs-context); the missing branch output is empty, so the comparison with `staging` evaluates false. The intended fast-forward step is:

```bash
git checkout production
git merge --ff-only origin/staging
git push
```

Fast-forward only — if `production` has diverged from `staging` for any reason, this merge will fail rather than create a merge commit. This guarantees `production` always matches a real `staging` commit exactly.

## Deploy Previews

Every PR automatically gets two preview deployments on push (if paths match):

| Preview | URL pattern |
|---------|------------|
| Documentation site | `dialtone.dialpad.com/deploy-previews/pr-{number}/` |
| Storybook | `dialtone.dialpad.com/vue/deploy-previews/pr-{number}/` |

Preview links are posted as a comment on the PR automatically. Previews are cleaned up from GCS when the PR is closed.

## Branch Deployments

Merged branches also have persistent deployments:

| Branch | Documentation URL | Storybook URL |
|--------|------------------|---------------|
| `staging` | `dialtone.dialpad.com/staging/` | `dialtone.dialpad.com/vue/staging/` |
| `production` | `dialtone.dialpad.com/` (root) | `dialtone.dialpad.com/vue/` |
| `alpha` | `dialtone.dialpad.com/alpha/` | `dialtone.dialpad.com/vue/alpha/` |
| `beta` | `dialtone.dialpad.com/beta/` | `dialtone.dialpad.com/vue/beta/` |

## Hotfixes

There is no dedicated hotfix branch. For urgent fixes:

1. Branch off `staging` (not `production`)
2. Apply the fix
3. Submit a PR to `staging` with normal review
4. After merge, trigger a manual release via `workflow_dispatch` in GitHub Actions rather than waiting for Tuesday

Do not commit directly to `production`. Releasing the package containing the fix does not currently trigger production promotion. Once the dependency guard is corrected, the staging-to-production fast-forward can include the merged fix.

## Required Checks Before Merge

A PR to `staging` must pass these checks:

1. **Lint PR Title** — PR title must follow the conventional commit format: `type(scope): JIRA subject`
2. **Unit Tests** — `pnpm nx run dialtone-vue:test:coverage` must pass
3. **Accessibility Tests** — `pnpm nx run dialtone-vue:test:a11y` must pass
4. **Bundle Size Check** — Package size must not increase by more than 5% (can be bypassed with `skip-bundle-size-check` label)
5. **Visual Tests** — Required if the PR has the `visual-test-ready` label. PRs without either `visual-test-ready` or `no-visual-test` label receive an automated comment prompting for one.

At least one approving code review is required before merge.
