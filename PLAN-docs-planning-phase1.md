# Plan: docs/planning-phase1

## Overview

Build a `dialtone-docs` package (`packages/dialtone-docs/`) that generates AI-discoverable documentation from source files, validates documentation quality through automated tests, and outputs to multiple formats (JSON for MCP, Markdown for site/AI). The package follows existing Dialtone build patterns (NX, Vitest) and is planned across 7 incremental milestones.

## Progress

- Created planning and discovery documentation (`docs/BRAINSTORM_AI_GEO_DOCS.md`, `docs/HOW_DOCS_WORK.md`, `docs/PHASE_1_IMPLEMENTATION_PLAN.md`, `docs/PLANNING_EXECUTIVE_SUMMARY.md`, `docs/PLANNING_INDEX.md`, `docs/PLANNING_METHODOLOGY.md`)
- Created comprehensive AI documentation standards (`docs/standards/AI_DOCUMENTATION_STANDARDS.md`)
- Initialized `packages/dialtone-docs/` directory structure (`src/`, `tests/helpers/`, `tests/tests/`)
- Created `packages/dialtone-docs/package.json` with correct dependencies (`gray-matter`, `glob`, `handlebars`, `vitest`)
- Created `packages/dialtone-docs/project.json` with NX build and test targets
- Created `packages/dialtone-docs/vite.config.js` following Dialtone's Vitest pattern (with `@helpers` and `@src` aliases)
- Created `packages/dialtone-docs/tests/helpers/fileReader.js` test helper
- Created `packages/dialtone-docs/tests/helpers/frontmatterParser.js` test helper
- Renamed and reorganized plan file to follow `PLAN-<branch>.md` convention

## Next Steps

1. **Complete Milestone 1 — Package Foundation**
   - Create `packages/dialtone-docs/tests/helpers/markdownParser.js`
   - Create `packages/dialtone-docs/tests/tests/structure.test.js` (initial passing test)
   - Create `packages/dialtone-docs/.gitignore` (node_modules, dist, outputs, coverage)
   - Create `packages/dialtone-docs/README.md`
   - Install dependencies: `pnpm install` from repo root
   - Verify tests run: `nx run dialtone-docs:test`

2. **Milestone 2 — Content Source**
   - Create `src/content/` directory with categories: `architecture`, `development`, `workflows`, `reference`, `standards`
   - Add `INDEX.md` in each category directory
   - Move/add content with proper YAML frontmatter (`type`, `category`, `keywords`, `ai_summary`, `last_updated`)
   - Create Handlebars templates (`src/templates/component.md.hbs`, `src/templates/architecture.md.hbs`)
   - Add validation tests: `frontmatter.test.js`, `searchability.test.js`, `completeness.test.js`

3. **Milestone 3 — Basic Generator (Markdown → JSON)**
   - Build `src/generators/lib/markdown-reader.mjs`, `json-builder.mjs`, `frontmatter-parser.mjs`
   - Build `src/generators/build-ai-docs.mjs` and `build.mjs` orchestrator
   - Output `dist/ai-docs.json` with searchable index
   - Add `build-output.test.js`

4. **Milestone 4 — MCP Integration**
   - Update `packages/dialtone-mcp-server` to import `ai-docs.json`
   - Register `search_docs` tool in MCP server
   - Configure NX build dependency between `dialtone-docs` and `dialtone-mcp-server`

5. **Milestone 5 — Distribution System** — Copy generated docs to `outputs/ai-context/` and root `docs/`

6. **Milestone 6 — Component Doc Generation** — Auto-generate component markdown from Vue files using `vue-docgen-api`

7. **Milestone 7 — Validation & CI** — Full test suite, GitHub Actions workflow, root npm scripts

## Notes

- Package follows the "rebuild everything on every build" pattern (like `build-dialtone-vue-docs.mjs`) — no change detection complexity in MVP
- The full 7-milestone implementation plan lives at `docs/PLAN-docs-planning-phase1.md` with detailed code for each milestone
- NX test executor is `nx:run-script` (not `nx:run-commands`) for the test target
- Dependencies should be installed at repo root with pnpm since this is a pnpm workspace monorepo
- `vite.config.js` (not `.mjs`) was used because Dialtone's pattern uses `.js` for vitest config files
