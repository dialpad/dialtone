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

## Source examples

For documentation examples, read the [shared source-example authoring and maintenance contract](../documentation-examples.md). Preserve stable IDs, source-derived setup, generated-only guidance, representation-specific validation and explicit remaining coverage.

## Curated discovery keywords

Use page frontmatter `keywords` as the maintained source for alternate names or interaction phrases. Add a nonempty string array only when likely searches are not already covered; do not copy synonyms into component descriptions, export aliases, or agent API inventories. The site search and CLI/MCP discovery reuse these terms. CLI/MCP also recognize complete keyword phrases inside longer requests. Regular plural discovery does not require repeated keywords. Generic filler is not contextual evidence, and separate entries do not form a new phrase. Prefer distinctive, useful concepts; avoid uninformative generic words or another component's name when that would mislead. Related concepts can remain when they help distinguish legitimate choices.

A public component page needs its normal exported identity and a live `<component-vue-api component-name="..." />` association. Keywords apply to the page's documented API components, including separately documented parts; companion-only imports do not inherit them. CSS patterns and directives must use their real identifiers and must not imply a nonexistent Vue component. Update associations when renaming, splitting, or removing components.

Run `pnpm nx run-many -t build -p dialtone-cli dialtone-mcp-server` to regenerate public docs, page associations and bundled lookup data. For a meaningful new synonym, record a representative `dialtone search "<term>" --bundled` and `dialtone docs "<term>" --bundled` against the rebuilt candidate, checking the leading supported subjects and any legitimate ambiguity. Selected API lookup still needs a canonical component name.

Documentation keywords are bundled latest references. Joining them to installed component data does not establish installed API compatibility or add absent components. Docs-only keyword edits are eligible for CLI/MCP releases through the existing release process, but can reach the site before package publication. Verify publication, update the installed tools and restart MCP; a source merge or local build does not publish keywords.
