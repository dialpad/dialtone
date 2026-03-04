---
type: workflow
category: workflows
keywords: [branch, staging, production, alpha, beta, PR, pull-request, merge, hotfix, deploy, preview, branch-naming]
ai_summary: Dialtone branch strategy — staging is the main development branch, PRs always target staging, production is auto-updated from staging after each release.
last_updated: 2026-03-04
related_packages: []
---

# Branch Strategy

Dialtone uses a `staging`-first branch model. All development flows through `staging`. `production` is never committed to directly — it only moves forward via fast-forward merge after a successful release from `staging`.

## Long-Lived Branches

| Branch | Purpose |
|--------|---------|
| `staging` | Main development branch. All feature PRs target this branch. All releases originate here. |
| `production` | Stable released branch. Only updated by the release workflow via `git merge --ff-only origin/staging`. Never committed to directly. |
| `alpha` | Pre-release channel for early-access features. Published to npm with `alpha` dist-tag. |
| `beta` | Pre-release channel for stabilization before production. Published to npm with `beta` dist-tag. |
| `next` | Future release candidates. Published to npm with `next` dist-tag. |

All other branches are short-lived feature branches created per change and deleted after merge.

## Where PRs Go

**All PRs target `staging`.** Never open a PR directly to `production`, `alpha`, `beta`, or `next`.

The flow:
1. Create a branch off `staging`
2. Do the work, push commits
3. Open a PR into `staging`
4. Get at least one approving review
5. Merge (squash merge into `staging`)
6. Branch is deleted

`production` receives the change automatically after the next release run.

## Branch Naming

Branches use kebab-case. No strict prefix is enforced but the convention from existing branches is:

```
feat/DLT-1234-short-description
fix/DLT-5678-what-is-fixed
docs/DLT-9012-what-is-documented
chore/NO-JIRA-maintenance-task
```

The JIRA ticket number in the branch name is optional but helps traceability. The branch name does not affect the release — only commit messages do.

## How Production Gets Updated

After the release workflow runs on `staging` and all packages have been versioned, the `update-production` job runs automatically:

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

Do not commit directly to `production`. The fast-forward merge from `staging` ensures any release from `staging` automatically includes the fix.

## Required Checks Before Merge

A PR to `staging` must pass these checks:

1. **Lint PR Title** — PR title must follow the conventional commit format: `type(scope): JIRA subject`
2. **Unit Tests** — `pnpm nx run dialtone-vue:test:coverage` must pass
3. **Accessibility Tests** — `pnpm nx run dialtone-vue:test:a11y` must pass
4. **Bundle Size Check** — Package size must not increase by more than 5% (can be bypassed with `skip-bundle-size-check` label)
5. **Visual Tests** — Required if the PR has the `visual-test-ready` label. PRs without either `visual-test-ready` or `no-visual-test` label receive an automated comment prompting for one.

At least one approving code review is required before merge.
