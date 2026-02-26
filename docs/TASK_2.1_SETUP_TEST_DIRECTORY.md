# Task 2.1: Set Up Test Directory

**Date:** February 13, 2026
**Milestone:** 2 - Test Infrastructure
**Estimated Time:** 1 hour

---

## Goal

Create the test infrastructure directory with Dialtone-consistent patterns for validating documentation standards.

---

## What We're Creating

```
tests/docs-validation/
├── package.json              # Test dependencies
├── vite.config.js           # Vitest configuration (Dialtone pattern)
├── .gitignore               # Ignore node_modules
├── README.md                # How to run tests
├── helpers/                 # (empty for now, created in Task 2.2)
└── tests/                   # (empty for now, created in Task 2.3)
```

---

## Step 1: Create Directory Structure

```bash
# From repository root
mkdir -p tests/docs-validation/helpers
mkdir -p tests/docs-validation/tests
```

---

## Step 2: Create package.json

**File:** `tests/docs-validation/package.json`

```json
{
  "name": "docs-validation",
  "version": "1.0.0",
  "description": "Automated tests for Dialtone AI documentation standards",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:searchability": "vitest run tests/searchability",
    "test:completeness": "vitest run tests/completeness",
    "test:structure": "vitest run tests/structure"
  },
  "keywords": ["documentation", "testing", "ai", "validation"],
  "author": "Dialtone Team",
  "license": "MIT",
  "devDependencies": {
    "vitest": "^1.6.1",
    "glob": "^11.0.3",
    "gray-matter": "^4.0.3"
  }
}
```

**Key decisions:**
- Uses `vitest` (already in root)
- Uses `glob` (already in root)
- Adds `gray-matter` (industry standard for frontmatter parsing)
- `type: "module"` for ES modules

---

## Step 3: Create vite.config.js

**File:** `tests/docs-validation/vite.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: 'docs-validation',
    globals: true,
    environment: 'node',
    root: path.resolve(__dirname),
    include: ['tests/**/*.test.js'],
    testTimeout: 10000,
    reporters: ['verbose']
  },
  resolve: {
    alias: {
      '@helpers': path.resolve(__dirname, 'helpers'),
      '@root': path.resolve(__dirname, '../..')
    }
  }
});
```

**Key patterns (from dialtone-vue):**
- Test config inside `vite.config.js` (not separate vitest.config)
- `name:` field for test suite identification
- `globals: true` for global test functions
- `include: ['tests/**/*.test.js']` pattern
- Path aliases for clean imports

---

## Step 4: Create .gitignore

**File:** `tests/docs-validation/.gitignore`

```
node_modules/
coverage/
.vitest-cache/
```

---

## Step 5: Create README.md

**File:** `tests/docs-validation/README.md`

```markdown
# Documentation Validation Tests

Automated test suite for validating Dialtone's AI documentation standards.

## Three Core Principles

1. **Searchability** - Content uses actual component names (grep-able)
2. **Completeness** - Every major system has documentation
3. **Structure** - Standardized YAML frontmatter

## Running Tests

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:searchability
npm run test:completeness
npm run test:structure

# Watch mode
npm run test:watch
```

## Test Suites

### searchability.test.js
Validates that documentation uses actual component names and technical terms.

### completeness.test.js
Validates that all required documentation exists.

### structure.test.js
Validates YAML frontmatter structure and required fields.

## Helpers

- `frontmatterParser.js` - Parse YAML frontmatter from markdown
- `grepHelper.js` - Search documentation content
- `fileReader.js` - File system utilities

## Adding New Tests

1. Create test file in `tests/`
2. Import helpers from `@helpers`
3. Follow existing test patterns
4. Run tests to validate

## CI Integration

These tests run automatically on:
- Pull requests
- Commits to main branches
- Manual workflow dispatch
```

---

## Step 6: Install Dependencies

```bash
cd tests/docs-validation
npm install
```

---

## Acceptance Criteria

- [ ] Directory structure created
- [ ] package.json exists with correct dependencies
- [ ] vite.config.js follows Dialtone patterns
- [ ] .gitignore prevents committing node_modules
- [ ] README.md explains test structure
- [ ] Dependencies install successfully
- [ ] Configuration is valid (no syntax errors)

---

## Key Differences from Original Plan

| Original Plan | Dialtone Pattern | Reason |
|--------------|------------------|--------|
| `vitest.config.js` | `vite.config.js` | Consistent with dialtone-vue |
| `specs/` directory | `tests/` directory | Dialtone convention |
| `*.spec.js` files | `*.test.js` files | Dialtone convention |
| `js-yaml` | `gray-matter` | Industry standard for frontmatter |
| Separate config | Config in vite.config | Dialtone pattern |

---

## Next Step

After completing Task 2.1, proceed to Task 2.2: Create Test Helpers
