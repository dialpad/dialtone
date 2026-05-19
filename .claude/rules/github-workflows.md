---
paths:
  - ".github/workflows/**"
  - ".github/actions/**"
---

# GitHub Workflows Rules

CI/CD definitions for Dialtone. Security-sensitive — workflows execute with repo write permissions, can publish packages, and can post to production. Review every change with a security lens.

## Trigger Safety

### ⛔ `pull_request_target` is high-risk

`pull_request_target` runs with **base branch code** (not PR code) but inherits the **secrets context**. Combined with `actions/checkout` of the PR ref, this is the classic supply-chain attack vector — an attacker opens a PR that overwrites a script the workflow runs, and your secrets are exfiltrated.

Rules:
- Avoid `pull_request_target` unless you have a specific reason (e.g., posting comments to PRs from forks)
- If you MUST use it, NEVER `actions/checkout` the PR ref (`github.event.pull_request.head.sha`) — keep the checkout pinned to the base (`github.sha` / `github.event.pull_request.base.sha`)
- Never run untrusted scripts (anything from the PR diff) under `pull_request_target`

### `pull_request` is safe by default

`pull_request` runs with PR code AND with restricted permissions (read-only on `secrets.GITHUB_TOKEN`, no organization secrets unless explicitly granted). This is the right default for PR CI.

### `workflow_dispatch` for manual runs

Use `workflow_dispatch` (with `inputs:`) for manually-triggered workflows. Document the inputs in the workflow comment.

## Permissions — Least Privilege

Declare `permissions:` at the workflow OR job level. Default to the minimum.

```yaml
permissions:
  contents: read       # default for most jobs
```

When more is needed:

```yaml
permissions:
  contents: read
  pull-requests: write  # for posting comments
  packages: read        # for installing private packages
```

### ⛔ `id-token: write` is sensitive

OIDC tokens can be used to authenticate to cloud providers (AWS, GCP, Azure) without static secrets. If granted, an attacker who can prompt-inject or compromise a workflow step can assume cloud roles.

- Only grant `id-token: write` to workflows that actually call `aws-actions/configure-aws-credentials@v4` or equivalent
- Scope OIDC trust policies in your cloud provider to specific branches and workflow paths

## Secret Handling

- Never `echo "$SECRET"` — even in `if: failure()` debug blocks. The job log is captured.
- Reference secrets via `${{ secrets.NAME }}` — never via env passthrough unless required
- For multi-line secrets, prefer setting them once on a runner env var rather than re-interpolating
- Restrict secrets to specific environments via `environment:` blocks for production deploys

## Concurrency

Long-running workflows MUST declare a concurrency group to prevent runaway billable minutes:

```yaml
concurrency:
  group: "${{ github.workflow }}-${{ github.ref }}"
  cancel-in-progress: true
```

For deploys, scope by environment (`group: deploy-${{ inputs.environment }}`) so PRs don't cancel each other.

## Reusable Actions

Local composite actions live in `.github/actions/<action-name>/`. Use them from workflows via:

```yaml
- uses: ./.github/actions/setup-environment
```

Rules:
- Pin third-party actions to a full SHA or a major version (`@v4`), never `@main`. Pinning to `main` lets an attacker who compromises the action's repo affect your workflow.
- Prefer SHA pinning for security-critical actions
- The `setup-environment` composite is the canonical place to put `actions/setup-node` + `actions/setup-pnpm` + auth — don't duplicate that ceremony in every workflow

## Path Filters

Use `paths:` filters to skip workflows that aren't affected by a change:

```yaml
on:
  pull_request:
    paths:
      - 'packages/dialtone-vue/**/*.vue'
      - '!**/*.test.*js'   # negation works
```

## Husky in CI

CI runs need `HUSKY: 0` in `env:` to skip git hooks:

```yaml
env:
  HUSKY: 0
```

Otherwise the pre-commit hook tries to run lint-staged against a checkout that doesn't have full deps installed, and the workflow fails.

## Deploy Workflows

- `deploy.yml`, `publish-*.yml`, `release.yml` are the deploy paths
- Production deploys MUST gate on `branches: [production]` or an `environment:` with required reviewers
- Never auto-deploy from `pull_request` — only from `push` to specific branches or `workflow_dispatch`

## Anti-Patterns

- `actions/checkout@main` or any other `@main` reference — supply-chain risk
- `pull_request_target` + `checkout` of PR ref — credential exfiltration vector
- Skipping `permissions:` block — defaults are too broad; declare explicitly
- `${{ github.event.pull_request.title }}` interpolated directly into a `run:` block — PR titles can contain shell metacharacters; pass via env var or `<<EOF` heredoc instead (see `lint-pr.yml` for the safe pattern)
- Hardcoding URLs that should be env vars / secrets (e.g., production API endpoints)
- Workflows without `concurrency:` that run on every push — runaway CI minutes when force-pushing
- Granting `id-token: write` to a workflow that doesn't need OIDC — sharp edge waiting to be exploited
- Re-using a single workflow for both PR CI and production deploys — separation of concerns and blast radius
