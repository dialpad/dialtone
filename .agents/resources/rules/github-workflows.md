# GitHub Workflow Rules

Apply to `.github/**`.

## Safety

- Use least-privilege permissions.
- Avoid exposing secrets in logs, comments, artifacts, or generated summaries.
- Use concurrency groups where repeated workflow runs could overlap.

## Triggers

- Keep path filters as narrow as practical.
- Be careful with `pull_request_target`; avoid checking out untrusted code with elevated tokens.

## Validation

- Review workflow syntax and action versions.
- Prefer reusable local setup actions already present in the repo.
