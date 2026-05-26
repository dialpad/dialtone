# Documentation Site Rules

Apply to `apps/dialtone-documentation/**`.

## Structure

- VuePress pages live under `apps/dialtone-documentation/docs/`.
- Sidebar navigation lives in `_data/site-nav.json`.
- Page links and frontmatter should follow existing local examples.

## Updates

- Preserve existing manually authored content.
- Keep component docs aligned with component source, stories, and generated component docs JSON.

## Verification

- Run documentation lint/build checks when docs-site structure, nav, frontmatter, or VuePress components change.
