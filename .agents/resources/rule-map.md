# Dialtone Rule Map

Use this resource to lazy-load Codex review guidance. Always start with `.agents/resources/rules/general.md`, then load only rule files whose paths match changed files.

| Changed path                                | Load these rule files                                                                                                                                                            |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/dialtone-vue/components/**`       | `.agents/resources/rules/vue-components.md`; `.agents/resources/rules/logical-naming.md` for directional API names; `.agents/resources/rules/vue-tests.md` for tests; `.agents/resources/rules/stories.md` for stories and MDX |
| `packages/combinator/**`                    | `.agents/resources/rules/combinator-variants.md` for `src/variants/**`; `.agents/resources/rules/documentation-writing.md` for package docs; `.agents/resources/rules/vue-tests.md` for tests |
| `packages/dialtone-css/**`                  | `.agents/resources/rules/css-utilities.md`; `.agents/resources/rules/design-tokens.md`; `.agents/resources/rules/postcss-responsive-variations.md` when responsive variants are involved |
| `packages/dialtone-tokens/**`               | `.agents/resources/rules/design-tokens.md`                                                                                                                                               |
| `packages/dialtone-icons/**`                | `.agents/resources/rules/icons.md`                                                                                                                                                       |
| `packages/dialtone-mcp-server/**`           | `.agents/resources/rules/mcp-server.md`; `.agents/resources/rules/query-core.md` when data/search behavior is involved                                                                   |
| `packages/dialtone-docs/**`                 | `.agents/resources/rules/query-core.md`; `.agents/resources/rules/documentation-writing.md`                                                                                              |
| `packages/dialtone-query-core/**`           | `.agents/resources/rules/query-core.md`                                                                                                                                                  |
| `packages/dialtone-cli/**`                  | `.agents/resources/rules/dialtone-cli.md`                                                                                                                                                |
| `packages/language-server/**`               | `.agents/resources/rules/language-server.md`                                                                                                                                             |
| `packages/eslint-plugin-dialtone/**`        | `.agents/resources/rules/eslint-plugin.md`                                                                                                                                               |
| `packages/stylelint-plugin-dialtone/**`     | `.agents/resources/rules/stylelint-plugin.md`                                                                                                                                            |
| `packages/postcss-responsive-variations/**` | `.agents/resources/rules/postcss-responsive-variations.md`                                                                                                                               |
| `apps/dialtone-documentation/**`            | `.agents/resources/rules/documentation-site.md`; `.agents/resources/rules/documentation-writing.md`                                                                                      |
| `.github/**`                                | `.agents/resources/rules/github-workflows.md`                                                                                                                                            |
| `scripts/**`                                | `.agents/resources/rules/scripts.md`                                                                                                                                                     |
| `.agents/**`, `.codex/**`, `AGENTS.md`      | `.agents/resources/rules/codex-tooling.md`; `.agents/resources/rules/general.md`                                                                                                         |

## Review Discipline

- Read the full changed file and the relevant diff before judging.
- Prefer concrete repo evidence over generalized design-system advice.
- Report findings with severity, path, and line when possible.
- Do not duplicate lint findings unless they indicate broader risk.
