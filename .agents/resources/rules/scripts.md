# Repo Script Rules

Apply to `scripts/**` and repo-root helper scripts.

## Module And Paths

- Follow the existing module system for the script location.
- Resolve paths from script location or workspace root explicitly.
- Prefer shared helpers over duplicated parsing when available.

## Output

- Keep command output deterministic and useful for CI.
- Avoid noisy logs in scripts used by automation.

## Generated Files

- Document source data for hardcoded generated mappings.
- Do not rewrite tracked generated files unless the script's purpose is generation and the change requires it.
