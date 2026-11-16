# Local gates

Run lint and tests only for the packages the diff touches. CI runs everything else, so do not run the full monorepo suite. Find the touched packages with the command in `SKILL.md` step 2, then run the row for each. Run from the repo root, on the final head, after fixes.

| Touched path                                                                                         | Lint                                                              | Test                                                                                                                  |
| ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `packages/dialtone-vue`                                                                              | `pnpm nx run dialtone-vue:lint`                                   | `pnpm nx run dialtone-vue:test`                                                                                       |
| `packages/dialtone-css`                                                                              | `pnpm nx run dialtone-css:lint`                                   | no gate                                                                                                               |
| `packages/dialtone-tokens`                                                                           | no gate                                                           | `pnpm nx run dialtone-tokens:test`                                                                                    |
| `packages/combinator`                                                                                | `pnpm --dir packages/combinator exec eslint src`                  | `pnpm nx run dialtone-combinator:test`                                                                                |
| `packages/dialtone-docs`                                                                             | no gate                                                           | `pnpm nx run dialtone-docs:test`                                                                                      |
| `packages/dialtone-query-core`                                                                       | no gate                                                           | `pnpm nx run dialtone-query-core:test`                                                                                |
| `packages/dialtone-mcp-server`                                                                       | no gate                                                           | `pnpm --dir packages/dialtone-mcp-server test:protocol`; `pnpm --dir packages/dialtone-mcp-server test:release-paths` |
| `packages/dialtone-cli`                                                                              | no gate                                                           | `pnpm --dir packages/dialtone-cli test` (needs `pnpm nx run dialtone-cli:build` first)                                |
| `packages/eslint-plugin-dialtone`                                                                    | `pnpm --dir packages/eslint-plugin-dialtone lint`                 | `pnpm nx run eslint-plugin-dialtone:test`                                                                             |
| `packages/stylelint-plugin-dialtone`                                                                 | `pnpm --dir packages/stylelint-plugin-dialtone lint`              | `pnpm nx run stylelint-plugin-dialtone:test`                                                                          |
| `packages/postcss-responsive-variations`                                                             | `pnpm --dir packages/postcss-responsive-variations exec eslint .` | `pnpm nx run postcss-responsive-variations:test`                                                                      |
| `packages/figma-styles-sync`                                                                         | `pnpm nx run figma-styles-sync:lint`                              | `pnpm nx run figma-styles-sync:test`                                                                                  |
| `apps/dialtone-documentation`                                                                        | `pnpm nx run dialtone-documentation:lint`                         | `pnpm nx run dialtone-documentation:test`                                                                             |
| `packages/dialtone-icons`, `packages/dialtone-emojis`, `packages/language-server`, `packages/gradle` | no gate                                                           | no gate                                                                                                               |
| `AGENTS.md`, `.agents/**`                                                                            | markdownlint and prettier on the changed files only (see below)   | `node .agents/evals/run-skill-contract-evals.mjs` (plus a skill's own eval runner if it has one)                      |
| `.claude/**`                                                                                         | no gate                                                           | `node .agents/evals/run-skill-contract-evals.mjs`                                                                     |
| `.github/**`                                                                                         | read the workflow change; no local gate                           | no gate                                                                                                               |

Changed-files lint for `AGENTS.md` and `.agents/**` (the rest of `.agents/` already has lint findings on `staging`, so do not lint the whole tree):

```sh
F=$(git diff --name-only "$BASE" -- AGENTS.md .agents | grep -E '\.(md|mjs)$')
pnpm exec markdownlint $(echo "$F" | grep '\.md$')
pnpm exec prettier --check --single-quote $F
```

Notes:

- A package not in the table: read its `package.json` scripts and run its `lint` and `test` if present. Skip any script that writes files (`--fix`); run the underlying checker without it.
- If the dependency install is missing or fails, say so and mark the gates "not run". Do not work around a failed install.
- Builds, `build-storybook` and visual tests are CI's job. Run a build only when a changed public export, token or icon needs it to prove a downstream package still compiles, and say why.
- `.agents/resources/validation.md` lists the wider checks (builds, acceptance scenarios) for areas outside this table.
