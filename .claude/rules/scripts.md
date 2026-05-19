---
paths:
  - "scripts/**"
---

# Repo-Root Scripts Rules

Scripts in `/scripts/` are repo-wide automation — doc builds, migrations, sync utilities. They're invoked by `package.json` scripts at the root level or directly via `node scripts/<name>.mjs`.

## Module System

- ESM only (`.mjs` extension)
- Resolve `__dirname` / `__filename` via the `import.meta.url` pattern:

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

- Shell scripts use the `.sh` extension with a `#!/bin/bash` shebang and `set -e` for fail-fast behavior

## Path Resolution

- Scripts operate on the monorepo from the root — never assume the CWD is anywhere else
- Resolve paths relative to `__dirname`, then walk up: `join(__dirname, '../packages/dialtone-vue')`
- Don't hardcode absolute paths or `process.cwd()`-relative paths — both break when invoked from different launchers (CI, NX, direct node)

## Workspace Imports

Scripts may import from other packages via the workspace alias:

```javascript
import { getValidFileList } from '../common/utils/server.mjs';
```

If a helper is used by more than one script, extract it to `common/utils/` rather than duplicating.

## Output Conventions

- `console.info` for progress / success messages
- `console.error` for warnings and errors
- Exit with non-zero codes on failure (`process.exit(1)` or `throw`)
- Don't use plain `console.log` in scripts that may be piped — reserve stdout for actual data when the script is meant to produce it

## File Generation

Scripts that produce build artifacts (e.g., `build-dialtone-vue-docs.mjs`) follow this pattern:

1. Resolve the output directory relative to `__dirname`
2. `fs.existsSync` + `fs.mkdirSync` to ensure the directory
3. `JSON.stringify` for JSON outputs (no whitespace formatting for shipped artifacts to keep diffs small)
4. Use the async `writeFile` callback API or `fs.promises.writeFile` — match the style of the file you're editing
5. Log success with a clear message including the output path

## Hardcoded Data — Document the Source

When a script ships hardcoded data (e.g., the `deprecatedComponents` map in `build-dialtone-vue-docs.mjs`):

- Add a JSDoc block citing the source of truth (e.g., the ESLint rule the data mirrors)
- When the source changes, update both places — the script is downstream of the source

## CI Invocation

Scripts called from GitHub workflows must:
- Be idempotent — re-running shouldn't produce different output for the same input
- Have a clear non-zero exit on failure
- Avoid interactive prompts (no `readline` without `--yes` flags)

## Anti-Patterns

- CommonJS (`require`) in `.mjs` files — use dynamic `import()` if interop is needed
- Hardcoded absolute paths or `process.cwd()` references — see Path Resolution
- Catching errors silently — let them propagate or exit non-zero
- Adding dependencies for trivial helpers — prefer Node built-ins (`node:fs`, `node:path`, `node:url`)
- Untested critical-path scripts — if a script generates artifacts that ship to consumers, add a smoke test or a CI step that compares output to a known-good snapshot
