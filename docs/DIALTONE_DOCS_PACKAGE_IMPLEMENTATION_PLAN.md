# Dialtone Docs Package Implementation Plan

**Date:** February 13, 2026
**Package:** `packages/dialtone-docs/`
**Duration:** 7 days (one milestone per day)
**Approach:** Incremental, testable milestones

---

## Overview

Create a documentation package that:
- Generates AI-discoverable documentation from source files
- Validates documentation quality through automated tests
- Outputs to multiple formats (JSON for MCP, Markdown for site/AI)
- Distributes to multiple locations (docs/, apps/, dist/)
- Auto-generates component docs from Vue files
- Follows existing Dialtone build patterns (rebuild everything on every build)

---

## Architecture

### Package Location
```
packages/dialtone-docs/
```

### Build Pattern
**MVP Approach:** Rebuild everything on every build (like `build-dialtone-vue-docs.mjs`)
- Simple, proven pattern
- No change detection complexity
- Runs as part of NX build process

**Future Optimization:** Git diff to only rebuild changed files

### Outputs
1. **dist/ai-docs.json** → For MCP search tool
2. **outputs/ai-context/** → Copies to `docs/` (root, for AI assistants in repo)
3. **outputs/site-content/** → Copies to `apps/dialtone-documentation/docs/` (future)
4. **outputs/components/** → Generated component markdown

---

## Milestone 1: Package Foundation (Day 1)

### Goal
Create the package structure with basic testing infrastructure

### Structure
```
packages/dialtone-docs/
├── package.json
├── project.json            # NX configuration
├── vite.config.js          # Test config (Dialtone pattern)
├── .gitignore
├── README.md
├── tests/
│   ├── helpers/
│   │   ├── frontmatterParser.js
│   │   ├── fileReader.js
│   │   └── markdownParser.js
│   └── tests/
│       └── structure.test.js
└── src/
    └── .gitkeep
```

### Tasks

**1. Create package directory**
```bash
mkdir -p packages/dialtone-docs/{tests/{helpers,tests},src}
cd packages/dialtone-docs
```

**2. Create package.json**
```json
{
  "name": "@dialpad/dialtone-docs",
  "version": "1.0.0",
  "description": "Documentation generation and validation for Dialtone",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "build": "node src/generators/build.mjs"
  },
  "dependencies": {
    "gray-matter": "^4.0.3",
    "glob": "^11.0.3",
    "handlebars": "^4.7.8"
  },
  "devDependencies": {
    "vitest": "^1.6.1"
  },
  "keywords": ["documentation", "ai", "dialtone"],
  "license": "MIT"
}
```

**3. Create project.json (NX config)**
```json
{
  "name": "dialtone-docs",
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "cwd": "{projectRoot}",
        "command": "node src/generators/build.mjs"
      }
    },
    "test": {
      "executor": "nx:run-script",
      "options": { "script": "test" }
    }
  }
}
```

**4. Create vite.config.js**
```javascript
import { defineConfig } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    name: 'dialtone-docs',
    globals: true,
    environment: 'node',
    root: path.resolve(__dirname),
    include: ['tests/**/*.test.js'],
    testTimeout: 10000,
    reporters: ['verbose']
  },
  resolve: {
    alias: {
      '@helpers': path.resolve(__dirname, 'tests/helpers'),
      '@src': path.resolve(__dirname, 'src')
    }
  }
});
```

**5. Create test helpers**
- `tests/helpers/frontmatterParser.js` - Parse YAML frontmatter
- `tests/helpers/fileReader.js` - File system utilities
- `tests/helpers/markdownParser.js` - Markdown parsing utilities

**6. Create initial test**
```javascript
// tests/tests/structure.test.js
import { describe, test, expect } from 'vitest';
import { fileExists } from '@helpers/fileReader.js';

describe('Package Structure', () => {
  test('package.json exists', () => {
    expect(fileExists('package.json')).toBe(true);
  });

  test('src directory exists', () => {
    expect(fileExists('src')).toBe(true);
  });
});
```

**7. Create .gitignore**
```
node_modules/
coverage/
.vitest-cache/
dist/
outputs/
```

**8. Create README.md**
```markdown
# Dialtone Docs

Documentation generation and validation for the Dialtone design system.

## Overview

This package:
- Generates AI-discoverable documentation from source files
- Validates documentation quality
- Outputs to multiple formats (JSON, Markdown)
- Distributes to multiple locations

## Commands

```bash
# Run tests
nx run dialtone-docs:test

# Build documentation
nx run dialtone-docs:build
```

## Structure

- `src/content/` - Manual documentation source
- `src/templates/` - Handlebars templates for generation
- `src/generators/` - Build scripts
- `tests/` - Validation tests
- `dist/` - Generated JSON for MCP
- `outputs/` - Generated markdown for distribution
```

**9. Install dependencies**
```bash
npm install
```

**10. Run tests**
```bash
nx run dialtone-docs:test
```

### Acceptance Criteria
- [ ] Package structure exists
- [ ] `package.json` with correct dependencies
- [ ] `project.json` with NX configuration
- [ ] `vite.config.js` following Dialtone pattern
- [ ] Test helpers created
- [ ] Initial test passes
- [ ] Dependencies install successfully
- [ ] Can run: `nx run dialtone-docs:test`

---

## Milestone 2: Content Source (Day 2)

### Goal
Add source markdown files and comprehensive validation tests

### Structure
```
packages/dialtone-docs/
└── src/
    ├── content/               # Manual documentation
    │   ├── architecture/
    │   │   ├── INDEX.md
    │   │   └── monorepo-structure.md
    │   ├── development/
    │   │   ├── INDEX.md
    │   │   └── component-workflow.md
    │   ├── workflows/
    │   │   ├── INDEX.md
    │   │   └── release-process.md
    │   ├── reference/
    │   │   └── INDEX.md
    │   └── standards/
    │       ├── INDEX.md
    │       └── ai-documentation-standards.md
    └── templates/             # Templates for generation
        ├── README.md
        ├── component.md.hbs
        └── architecture.md.hbs
```

### Tasks

**1. Create content directory structure**
```bash
mkdir -p src/content/{architecture,development,workflows,reference,standards}
mkdir -p src/templates
```

**2. Move existing docs from root**
- Move `docs/AI_DOCUMENTATION_STANDARDS.md` → `src/content/standards/`
- Move other planning docs → `src/content/` (or keep as planning history)
- Ensure all have proper frontmatter

**3. Add frontmatter to all markdown files**
```yaml
---
type: architecture | development | workflow | reference | standard
category: [matches type or plural]
keywords: [min 3 searchable terms]
ai_summary: [description under 150 chars]
last_updated: 2026-02-13
---
```

**4. Create templates**
- `src/templates/component.md.hbs` - Component documentation template
- `src/templates/architecture.md.hbs` - Architecture documentation template

**5. Add validation tests**

**tests/tests/frontmatter.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { getAllDocsWithFrontmatter, validateFrontmatter } from '@helpers/frontmatterParser.js';

describe('Frontmatter Validation', () => {
  const allDocs = getAllDocsWithFrontmatter('src/content');

  test('all docs have YAML frontmatter', () => {
    allDocs.forEach(({ path, frontmatter }) => {
      expect(Object.keys(frontmatter).length).toBeGreaterThan(0);
    });
  });

  test('all docs have required fields', () => {
    const required = ['type', 'category', 'keywords', 'ai_summary'];

    allDocs.forEach(({ path, frontmatter }) => {
      const { valid, missing } = validateFrontmatter(frontmatter, required);
      expect(valid).toBe(true);
    });
  });

  test('keywords array has 3+ items', () => {
    allDocs.forEach(({ path, frontmatter }) => {
      expect(Array.isArray(frontmatter.keywords)).toBe(true);
      expect(frontmatter.keywords.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('ai_summary is ≤150 characters', () => {
    allDocs.forEach(({ path, frontmatter }) => {
      expect(frontmatter.ai_summary.length).toBeLessThanOrEqual(150);
    });
  });
});
```

**tests/tests/searchability.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { termExists, grepDocs } from '@helpers/grepHelper.js';

describe('Searchability - Content Uses Actual Names', () => {
  test('documentation uses actual package names', () => {
    const packages = [
      'dialtone-vue',
      'dialtone-css',
      'dialtone-tokens',
      'dialtone-icons'
    ];

    packages.forEach(pkg => {
      const found = termExists(pkg, 'src/content');
      expect(found).toBe(true);
    });
  });

  test('documentation uses technical terms', () => {
    const terms = ['VuePress', 'pnpm', 'NX', 'monorepo'];

    terms.forEach(term => {
      const found = termExists(term, 'src/content');
      expect(found).toBe(true);
    });
  });

  test('no placeholder content', () => {
    const badTerms = ['TODO', 'FIXME', 'placeholder'];

    badTerms.forEach(term => {
      const results = grepDocs(term, 'src/content');
      expect(results.length).toBe(0);
    });
  });
});
```

**tests/tests/completeness.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { fileExists } from '@helpers/fileReader.js';

describe('Completeness - Required Docs Exist', () => {
  test('all category directories have INDEX.md', () => {
    const dirs = [
      'src/content/architecture',
      'src/content/development',
      'src/content/workflows',
      'src/content/reference',
      'src/content/standards'
    ];

    dirs.forEach(dir => {
      expect(fileExists(`${dir}/INDEX.md`)).toBe(true);
    });
  });

  test('standards documentation exists', () => {
    expect(fileExists('src/content/standards/ai-documentation-standards.md')).toBe(true);
  });
});
```

**6. Run tests and fix issues**
```bash
nx run dialtone-docs:test
```

### Acceptance Criteria
- [ ] Content directory structure exists
- [ ] All markdown files have valid frontmatter
- [ ] Frontmatter validation tests pass
- [ ] Searchability tests pass (uses actual names)
- [ ] Completeness tests pass (required docs exist)
- [ ] Templates created
- [ ] All tests pass: `nx run dialtone-docs:test`

---

## Milestone 3: Basic Generator (Day 3)

### Goal
Build generator that reads markdown and outputs JSON for MCP

### Structure
```
packages/dialtone-docs/
├── src/
│   └── generators/
│       ├── build.mjs              # Main build script
│       ├── build-ai-docs.mjs      # AI docs generator
│       └── lib/
│           ├── markdown-reader.mjs
│           ├── json-builder.mjs
│           └── frontmatter-parser.mjs
└── dist/
    └── ai-docs.json               # Generated output
```

### Tasks

**1. Create generator structure**
```bash
mkdir -p src/generators/lib
```

**2. Create markdown reader**

**src/generators/lib/markdown-reader.mjs:**
```javascript
import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';

export function getAllMarkdownFiles(dir) {
  return glob.sync(`${dir}/**/*.md`, {
    ignore: ['**/node_modules/**', '**/README.md']
  });
}

export function readMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const { data, content: markdown } = matter(content);

  return {
    path: filePath,
    frontmatter: data,
    content: markdown,
    searchableText: stripMarkdown(markdown)
  };
}

function stripMarkdown(markdown) {
  // Remove code blocks, headings markers, etc for search
  return markdown
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
    .trim();
}
```

**3. Create JSON builder**

**src/generators/lib/json-builder.mjs:**
```javascript
export function buildAIDocsJSON(documents) {
  return {
    version: '1.0.0',
    generated: new Date().toISOString(),
    totalDocuments: documents.length,
    documents: documents.map(doc => ({
      path: doc.path,
      type: doc.frontmatter.type,
      category: doc.frontmatter.category,
      keywords: doc.frontmatter.keywords || [],
      summary: doc.frontmatter.ai_summary,
      lastUpdated: doc.frontmatter.last_updated,
      content: doc.content,
      searchableText: doc.searchableText
    })),
    index: buildSearchIndex(documents)
  };
}

function buildSearchIndex(documents) {
  const index = {};

  documents.forEach(doc => {
    // Build keyword index
    doc.frontmatter.keywords?.forEach(keyword => {
      if (!index[keyword]) {
        index[keyword] = [];
      }
      index[keyword].push(doc.path);
    });

    // Build category index
    const category = doc.frontmatter.category;
    if (!index[category]) {
      index[category] = [];
    }
    index[category].push(doc.path);
  });

  return index;
}
```

**4. Create main generator**

**src/generators/build-ai-docs.mjs:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllMarkdownFiles, readMarkdownFile } from './lib/markdown-reader.mjs';
import { buildAIDocsJSON } from './lib/json-builder.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, '../content');
const distDir = path.resolve(__dirname, '../../dist');
const outputPath = path.join(distDir, 'ai-docs.json');

async function main() {
  console.log('🔨 Building AI documentation...');

  // 1. Find all markdown files
  const files = getAllMarkdownFiles(contentDir);
  console.log(`📄 Found ${files.length} markdown files`);

  // 2. Read and parse each file
  const documents = files.map(readMarkdownFile);
  console.log(`✓ Parsed ${documents.length} documents`);

  // 3. Build JSON structure
  const aiDocsJSON = buildAIDocsJSON(documents);
  console.log(`✓ Built searchable JSON with ${Object.keys(aiDocsJSON.index).length} index entries`);

  // 4. Write to dist
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(aiDocsJSON, null, 2));
  console.log(`✅ Generated: ${outputPath}`);
  console.log(`📊 Total size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
```

**5. Create build orchestrator**

**src/generators/build.mjs:**
```javascript
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function main() {
  console.log('🚀 Starting documentation build...\n');

  // Run all generators
  await execAsync('node src/generators/build-ai-docs.mjs');

  console.log('\n✅ Build complete!');
}

main().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
```

**6. Add build output validation test**

**tests/tests/build-output.test.js:**
```javascript
import { describe, test, expect, beforeAll } from 'vitest';
import { fileExists, readFile } from '@helpers/fileReader.js';

describe('Build Output Validation', () => {
  test('dist/ai-docs.json exists after build', () => {
    expect(fileExists('dist/ai-docs.json')).toBe(true);
  });

  test('ai-docs.json has valid structure', () => {
    const json = JSON.parse(readFile('dist/ai-docs.json'));

    expect(json).toHaveProperty('version');
    expect(json).toHaveProperty('generated');
    expect(json).toHaveProperty('documents');
    expect(json).toHaveProperty('index');
    expect(Array.isArray(json.documents)).toBe(true);
  });

  test('all documents have required fields', () => {
    const json = JSON.parse(readFile('dist/ai-docs.json'));

    json.documents.forEach(doc => {
      expect(doc).toHaveProperty('path');
      expect(doc).toHaveProperty('type');
      expect(doc).toHaveProperty('category');
      expect(doc).toHaveProperty('keywords');
      expect(doc).toHaveProperty('summary');
      expect(doc).toHaveProperty('content');
      expect(doc).toHaveProperty('searchableText');
    });
  });
});
```

**7. Update project.json**
```json
{
  "targets": {
    "build": {
      "executor": "nx:run-commands",
      "outputs": ["{projectRoot}/dist"],
      "options": {
        "cwd": "{projectRoot}",
        "commands": [
          "node src/generators/build.mjs"
        ]
      }
    }
  }
}
```

**8. Run build**
```bash
nx run dialtone-docs:build
```

**9. Run tests**
```bash
nx run dialtone-docs:test
```

### Acceptance Criteria
- [ ] Generator reads all markdown files
- [ ] Parses frontmatter correctly
- [ ] Builds searchable JSON structure
- [ ] Creates `dist/ai-docs.json`
- [ ] JSON contains all documents with metadata
- [ ] Search index is built correctly
- [ ] Build validation tests pass
- [ ] Build command works: `nx run dialtone-docs:build`

---

## Milestone 4: MCP Integration (Day 4)

### Goal
Add search tool to MCP server for AI docs

### Tasks

**1. Update MCP server data imports**

**packages/dialtone-mcp-server/src/data.ts:**
```typescript
// Add new import
import aiDocsData from '@dialpad/dialtone-docs/dist/ai-docs.json' with { type: 'json' };

// Export
export const aiDocs = aiDocsData;
```

**2. Create AI docs search tool**

**packages/dialtone-mcp-server/src/tools/ai-docs.ts:**
```typescript
export function searchAIDocs(query: string) {
  // Search through documents by keywords, content, category
  // Return formatted results
}

export function formatAIDocsResults(results: any[]) {
  // Format results for display
}
```

**3. Register tool in MCP server**

**packages/dialtone-mcp-server/src/index.ts:**
```typescript
import { searchAIDocs, formatAIDocsResults } from './tools/ai-docs.js';

// Register tool
server.tool("search_docs", {
  description: "Search Dialtone documentation for architecture, workflows, development guides",
  parameters: {
    query: { type: "string", description: "Search query" }
  }
}, async ({ query }) => {
  const results = searchAIDocs(query);
  return formatAIDocsResults(results);
});
```

**4. Add MCP dependency**

**packages/dialtone-docs/project.json:**
```json
{
  "targets": {
    "build": {
      "dependsOn": [],
      "options": {
        "commands": ["node src/generators/build.mjs"]
      }
    }
  }
}
```

**packages/dialtone-mcp-server/project.json:**
```json
{
  "targets": {
    "build": {
      "dependsOn": ["dialtone-docs:build"]
    }
  }
}
```

**5. Test MCP server**
```bash
# Rebuild docs and MCP
nx run dialtone-docs:build
nx run dialtone-mcp-server:build

# Test interactive search
nx run dialtone-mcp-server:interactive
```

**6. Add integration test**

**packages/dialtone-docs/tests/tests/mcp-integration.test.js:**
```javascript
import { describe, test, expect } from 'vitest';

describe('MCP Integration', () => {
  test('MCP can import ai-docs.json', async () => {
    // Test that the JSON format is valid for MCP import
    const json = await import('../../dist/ai-docs.json', { assert: { type: 'json' } });
    expect(json.default).toBeDefined();
    expect(json.default.documents).toBeDefined();
  });
});
```

### Acceptance Criteria
- [ ] MCP imports `ai-docs.json` successfully
- [ ] New "search_docs" tool registered
- [ ] Can search for "monorepo" and find results
- [ ] Can search for "component workflow" and find results
- [ ] MCP server builds without errors
- [ ] Integration test passes

---

## Milestone 5: Distribution System (Day 5)

### Goal
Copy generated docs to final locations

### Structure
```
packages/dialtone-docs/
├── src/
│   └── generators/
│       ├── distribute.mjs
│       └── lib/
│           └── copy-files.mjs
└── outputs/
    └── ai-context/           # → Copies to docs/
```

### Tasks

**1. Create file copy utility**

**src/generators/lib/copy-files.mjs:**
```javascript
import fs from 'fs';
import path from 'path';

export function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) {
    throw new Error(`Source directory does not exist: ${src}`);
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
}
```

**2. Create distribution generator**

**src/generators/distribute.mjs:**
```javascript
import path from 'path';
import { fileURLToPath } from 'url';
import { copyDirectory } from './lib/copy-files.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.resolve(__dirname, '../content');
const outputsDir = path.resolve(__dirname, '../../outputs');
const rootDocsDir = path.resolve(__dirname, '../../../docs');

async function main() {
  console.log('📦 Distributing documentation...');

  // 1. Copy to outputs/ai-context/
  const aiContextOutput = path.join(outputsDir, 'ai-context');
  copyDirectory(contentDir, aiContextOutput);
  console.log(`✓ Copied to outputs/ai-context/`);

  // 2. Copy to root docs/
  copyDirectory(aiContextOutput, rootDocsDir);
  console.log(`✓ Copied to docs/`);

  // 3. Future: Copy to apps/dialtone-documentation/docs/ai/
  // const siteDocsDir = path.resolve(__dirname, '../../../apps/dialtone-documentation/docs/ai');
  // copyDirectory(contentDir, siteDocsDir);

  console.log('✅ Distribution complete!');
}

main().catch(err => {
  console.error('❌ Distribution failed:', err);
  process.exit(1);
});
```

**3. Update build orchestrator**

**src/generators/build.mjs:**
```javascript
async function main() {
  console.log('🚀 Starting documentation build...\n');

  // 1. Generate AI docs JSON
  await execAsync('node src/generators/build-ai-docs.mjs');

  // 2. Distribute to destinations
  await execAsync('node src/generators/distribute.mjs');

  console.log('\n✅ Build complete!');
}
```

**4. Add distribution validation test**

**tests/tests/distribution.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { fileExists } from '@helpers/fileReader.js';
import path from 'path';

describe('Distribution Validation', () => {
  test('files copied to outputs/ai-context/', () => {
    expect(fileExists('outputs/ai-context/architecture/INDEX.md')).toBe(true);
    expect(fileExists('outputs/ai-context/standards/ai-documentation-standards.md')).toBe(true);
  });

  test('files copied to root docs/', () => {
    const rootDocs = path.resolve(__dirname, '../../../docs');
    expect(fileExists(path.join(rootDocs, 'architecture/INDEX.md'))).toBe(true);
  });
});
```

**5. Run build**
```bash
nx run dialtone-docs:build
```

### Acceptance Criteria
- [ ] Build generates JSON
- [ ] Build distributes markdown to outputs/
- [ ] Files copied to root `docs/`
- [ ] Distribution validation tests pass
- [ ] Full build works end-to-end

---

## Milestone 6: Component Doc Generation (Day 6)

### Goal
Auto-generate component documentation from Vue files

### Structure
```
packages/dialtone-docs/
└── src/
    └── generators/
        ├── build-component-docs.mjs
        └── lib/
            ├── component-parser.mjs
            └── template-renderer.mjs
```

### Tasks

**1. Create component parser**

**src/generators/lib/component-parser.mjs:**
```javascript
import { parse } from 'vue-docgen-api';
import { glob } from 'glob';
import path from 'path';

export async function getAllComponents() {
  const vueRoot = path.resolve(__dirname, '../../../../dialtone-vue');
  const files = glob.sync(`${vueRoot}/components/**/*.vue`);
  return files;
}

export async function parseComponent(filePath) {
  try {
    const doc = await parse(filePath);
    return {
      name: doc.displayName,
      description: doc.description,
      props: doc.props || [],
      events: doc.events || [],
      slots: doc.slots || [],
      methods: doc.methods || [],
      tags: doc.tags || {}
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error.message);
    return null;
  }
}
```

**2. Create template renderer**

**src/generators/lib/template-renderer.mjs:**
```javascript
import Handlebars from 'handlebars';
import fs from 'fs';

export function renderTemplate(templatePath, data) {
  const template = fs.readFileSync(templatePath, 'utf8');
  const compiled = Handlebars.compile(template);
  return compiled(data);
}

// Helper to convert component name to kebab-case
Handlebars.registerHelper('kebabCase', function(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
});
```

**3. Update component template**

**src/templates/component.md.hbs:**
```handlebars
---
type: reference
category: components
keywords: [{{name}}, vue-component, {{#each tags.keywords}}{{this}}, {{/each}}]
ai_summary: {{description}}
component: true
---

# {{name}}

> {{description}}

## Props

{{#each props}}
### `{{@key}}`

- **Type:** `{{this.type.name}}`
{{#if this.required}}- **Required:** Yes{{/if}}
{{#if this.defaultValue}}- **Default:** `{{this.defaultValue.value}}`{{/if}}
- **Description:** {{this.description}}

{{/each}}

## Events

{{#each events}}
### `{{@key}}`

{{this.description}}

{{#if this.type}}**Payload:** `{{this.type.names}}`{{/if}}

{{/each}}

## Slots

{{#each slots}}
### `{{name}}`

{{description}}

{{/each}}

## Related

- [Component API Reference](https://dialtone.dialpad.com/vue/?path=/story/components-{{kebabCase name}})
- [Storybook Examples](https://dialtone.dialpad.com/vue/?path=/story/components-{{kebabCase name}})
```

**4. Create component docs generator**

**src/generators/build-component-docs.mjs:**
```javascript
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllComponents, parseComponent } from './lib/component-parser.mjs';
import { renderTemplate } from './lib/template-renderer.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.resolve(__dirname, '../templates/component.md.hbs');
const outputDir = path.resolve(__dirname, '../../dist/components');

async function main() {
  console.log('🔨 Building component documentation...');

  // 1. Get all Vue components
  const componentFiles = await getAllComponents();
  console.log(`📄 Found ${componentFiles.length} components`);

  // 2. Parse each component
  const components = [];
  for (const file of componentFiles) {
    const parsed = await parseComponent(file);
    if (parsed) {
      components.push(parsed);
    }
  }
  console.log(`✓ Parsed ${components.length} components`);

  // 3. Generate markdown for each
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const component of components) {
    const markdown = renderTemplate(templatePath, component);
    const filename = component.name
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase() + '.md';
    const outputPath = path.join(outputDir, filename);

    fs.writeFileSync(outputPath, markdown);
  }

  console.log(`✅ Generated ${components.length} component docs`);
}

main().catch(err => {
  console.error('❌ Component doc generation failed:', err);
  process.exit(1);
});
```

**5. Update build orchestrator**

**src/generators/build.mjs:**
```javascript
async function main() {
  console.log('🚀 Starting documentation build...\n');

  // 1. Generate component docs
  await execAsync('node src/generators/build-component-docs.mjs');

  // 2. Generate AI docs JSON (includes components)
  await execAsync('node src/generators/build-ai-docs.mjs');

  // 3. Distribute to destinations
  await execAsync('node src/generators/distribute.mjs');

  console.log('\n✅ Build complete!');
}
```

**6. Add component doc validation test**

**tests/tests/component-docs.test.js:**
```javascript
import { describe, test, expect } from 'vitest';
import { fileExists } from '@helpers/fileReader.js';
import matter from 'gray-matter';
import fs from 'fs';

describe('Component Documentation', () => {
  test('component docs are generated', () => {
    expect(fileExists('dist/components/dt-button.md')).toBe(true);
  });

  test('generated component docs have valid frontmatter', () => {
    const content = fs.readFileSync('dist/components/dt-button.md', 'utf8');
    const { data } = matter(content);

    expect(data.type).toBe('reference');
    expect(data.category).toBe('components');
    expect(data.component).toBe(true);
    expect(Array.isArray(data.keywords)).toBe(true);
  });
});
```

**7. Add vue-docgen-api dependency**

**package.json:**
```json
{
  "dependencies": {
    "vue-docgen-api": "^4.75.0"
  }
}
```

**8. Run build**
```bash
nx run dialtone-docs:build
```

### Acceptance Criteria
- [ ] Component parser uses vue-docgen-api
- [ ] Generates markdown for each Vue component
- [ ] Component docs have proper frontmatter
- [ ] Includes props, events, slots
- [ ] Component docs integrated into ai-docs.json
- [ ] Component validation tests pass
- [ ] Build generates component documentation

---

## Milestone 7: Validation & CI (Day 7)

### Goal
Full validation suite and GitHub Actions integration

### Tasks

**1. Add comprehensive test suite**

Run all existing tests and ensure they pass:
- Frontmatter validation
- Searchability
- Completeness
- Build output
- MCP integration
- Distribution
- Component docs

**2. Create GitHub Actions workflow**

**.github/workflows/docs-validation.yml:**
```yaml
name: Documentation Validation

on:
  pull_request:
    paths:
      - 'packages/dialtone-docs/**'
      - '.github/workflows/docs-validation.yml'
  push:
    branches:
      - staging
      - production
    paths:
      - 'packages/dialtone-docs/**'
  workflow_dispatch:

jobs:
  validate-docs:
    name: Validate Documentation
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Install dependencies
        run: pnpm install

      - name: Run documentation tests
        run: pnpm nx run dialtone-docs:test

      - name: Build documentation
        run: pnpm nx run dialtone-docs:build

      - name: Upload build artifacts
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: docs-build-output
          path: packages/dialtone-docs/dist/
          retention-days: 30
```

**3. Add root package.json scripts**

**package.json (root):**
```json
{
  "scripts": {
    "docs:test": "nx run dialtone-docs:test",
    "docs:build": "nx run dialtone-docs:build",
    "docs:test:watch": "nx run dialtone-docs:test --watch"
  }
}
```

**4. Update package README**

**packages/dialtone-docs/README.md:**
Add comprehensive documentation:
- Overview
- Architecture
- Build process
- Testing strategy
- Contributing guidelines
- Troubleshooting

**5. Create CHANGELOG**

**packages/dialtone-docs/CHANGELOG.md:**
```markdown
# Changelog

## 1.0.0 - 2026-02-13

### Added
- Initial release
- Documentation generation from markdown source
- AI-searchable JSON output for MCP
- Component documentation generation from Vue files
- Distribution to multiple locations
- Comprehensive test suite
- GitHub Actions integration
```

**6. Run full validation**
```bash
# Run all tests
pnpm docs:test

# Build everything
pnpm docs:build

# Verify outputs
ls -la packages/dialtone-docs/dist/
ls -la packages/dialtone-docs/outputs/
ls -la docs/
```

**7. Test CI workflow locally**
```bash
# Using act or similar tool
act -j validate-docs
```

### Acceptance Criteria
- [ ] All test suites pass
- [ ] Build completes successfully
- [ ] GitHub Actions workflow runs
- [ ] Build is reproducible in CI
- [ ] README is comprehensive
- [ ] CHANGELOG is created
- [ ] Root scripts work
- [ ] System is fully documented

---

## Success Criteria

### After Day 7, the system should:

**✅ Generate Documentation**
- Reads markdown source files
- Parses frontmatter and content
- Generates searchable JSON
- Auto-generates component docs from Vue

**✅ Validate Quality**
- Tests validate frontmatter structure
- Tests validate searchability (actual names used)
- Tests validate completeness (required docs exist)
- Tests validate build output

**✅ Integrate with MCP**
- MCP imports ai-docs.json
- Search tool finds documentation
- Component docs searchable

**✅ Distribute to Destinations**
- Copies to root `docs/`
- Generates JSON for MCP in `dist/`
- Ready for site integration

**✅ CI/CD Ready**
- GitHub Actions workflow
- Automated validation
- Build verification
- Artifact uploads

---

## Future Enhancements (Post-MVP)

### Optimization
- Git diff detection (only rebuild changed files)
- Incremental builds
- Build caching

### GEO Enhancement
- Schema markup generation
- Citation enrichment
- FAQ section generation
- Statistics extraction

### Additional Generators
- Architecture diagrams from code
- API reference from TypeScript types
- Workflow diagrams from GitHub Actions
- Relationship graphs (component uses token X)

### Advanced Validation
- Link checker
- Example code verification
- Screenshot testing
- Accessibility validation

---

## Timeline Summary

| Day | Milestone | Focus | Deliverable |
|-----|-----------|-------|-------------|
| 1 | Foundation | Package structure + tests | Working test infrastructure |
| 2 | Content | Source markdown + validation | Validated content source |
| 3 | Generator | Markdown → JSON | ai-docs.json generated |
| 4 | MCP | Search integration | MCP search tool working |
| 5 | Distribution | Copy to destinations | Files in correct locations |
| 6 | Components | Auto-generate from Vue | Component docs automated |
| 7 | CI/CD | Full validation + workflow | Production-ready system |

**Total:** 7 days, one milestone per day, each independently testable

---

**Ready to start with Milestone 1 (Day 1)?**
