# General Dialtone Rules

Apply these rules to every changed file.

## Reuse And Scope

- Check whether an existing component, utility, token, helper, script, or workflow already solves the problem.
- Keep changes close to the requested surface. Avoid opportunistic refactors.
- Prefer repo patterns and package-local helpers over new abstractions.

## Public Repo Safety

- Do not add secrets, customer data, private Dialpad links, or internal-only context to committed files or PR bodies.
- Keep generated files out of commits unless the package workflow requires them.

## Readability

- Keep code and docs easy to scan.
- Add comments only where the "why" is not obvious.
- Favor concrete names and grep-friendly wording in docs and tooling.
