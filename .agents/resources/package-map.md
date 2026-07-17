# Dialtone Package Map

Use this resource to map changed paths to affected packages and downstream impact.

## Package Graph

```text
dialtone-tokens -> dialtone-css ----\
dialtone-icons ----------------------> dialtone-vue -> dialtone-documentation
                                                     -> dialtone-mcp-server
                                                     -> language-server
                                                     -> dialtone-docs / dialtone-query-core / dialtone-cli
```

## Affected Areas

| Path                                        | Area                          | Notes                                                                  |
| ------------------------------------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `packages/dialtone-tokens/**`               | tokens                        | Design token source and platform outputs.                              |
| `packages/dialtone-css/**`                  | css                           | Less utilities and component styles. Depends on tokens.                |
| `packages/dialtone-vue/**`                  | vue                           | Vue components, stories, docs JSON. Depends on icons and CSS.          |
| `packages/combinator/**`                    | combinator                    | Playground, variants, generated-code UI, and component thumbnail inputs. Depends on Vue, icons, CSS, and tokens. |
| `apps/dialtone-documentation/**`            | docs-site                     | VuePress documentation site.                                           |
| `packages/dialtone-docs/**`                 | ai-docs                       | AI-readable docs and public docs JSON.                                 |
| `packages/dialtone-query-core/**`           | query-core                    | Shared search/data layer for MCP, CLI, and language-server consumers.  |
| `packages/dialtone-mcp-server/**`           | mcp                           | Dialtone MCP server surface.                                           |
| `packages/dialtone-cli/**`                  | cli                           | CLI wrapper over query-core.                                           |
| `packages/dialtone-icons/**`                | icons                         | SVG source, keywords, generated platform assets.                       |
| `packages/language-server/**`               | language-server               | IDE completions and integration.                                       |
| `packages/eslint-plugin-dialtone/**`        | eslint-plugin                 | Dialtone ESLint rules.                                                 |
| `packages/stylelint-plugin-dialtone/**`     | stylelint-plugin              | Dialtone Stylelint rules.                                              |
| `packages/postcss-responsive-variations/**` | postcss-responsive-variations | Responsive utility generator.                                          |
| `.github/**`                                | github                        | CI, release, review, and automation workflows.                         |
| `.agents/**`, `AGENTS.md`                   | codex-tooling                 | Repo-local Codex tooling.                                              |

## Impact Rules

- Upstream changes should consider downstream builds. Token changes can affect CSS, Vue, docs, query data, and platform outputs.
- Vue component API changes should consider tests, Storybook, VuePress docs, component docs JSON, MCP/query data, and public docs.
- Vue component API changes should also consider Combinator variant files and component-wall thumbnail output.
- Query-core changes can affect MCP server, CLI, language-server, and documentation search behavior.
- Generated outputs should stay out of commits unless the package workflow explicitly requires them.
