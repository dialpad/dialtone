import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findFiles, readFile } from '@helpers/fileReader.js';
import { parseFrontmatter, validateRequiredFields } from '@helpers/frontmatterParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '../..');
const outputPath = resolve(packageRoot, 'dist/ai-docs.json');

// Shared schema constants — single source of truth for both source and compiled output
const ALLOWED_TYPES = ['architecture', 'development', 'workflow', 'reference', 'standard', 'guide', 'template'];
const FRONTMATTER_REQUIRED_FIELDS = ['type', 'category', 'keywords', 'ai_summary'];
const JSON_REQUIRED_FIELDS = ['id', 'title', 'type', 'category', 'keywords', 'summary', 'content', 'filePath', 'lastUpdated', 'relatedPackages'];

// ─── Source frontmatter schema ──────────────────────────────────────────────

describe('Source frontmatter schema', () => {
  let contentFiles;

  beforeAll(async () => {
    contentFiles = await findFiles('src/content/**/*.md');
  });

  test('finds content markdown files', () => {
    expect(contentFiles.length).toBeGreaterThan(0);
  });

  test('all docs have YAML frontmatter', () => {
    for (const file of contentFiles) {
      const content = readFile(file);
      const parsed = parseFrontmatter(content);
      expect(parsed.isEmpty, `${file} has no frontmatter`).toBe(false);
    }
  });

  test('all docs have required fields', () => {
    for (const file of contentFiles) {
      const content = readFile(file);
      const parsed = parseFrontmatter(content);
      const { valid, missing } = validateRequiredFields(parsed, FRONTMATTER_REQUIRED_FIELDS);
      expect(valid, `${file} missing fields: ${missing.join(', ')}`).toBe(true);
    }
  });

  test('type field uses allowed values', () => {
    for (const file of contentFiles) {
      const content = readFile(file);
      const { data } = parseFrontmatter(content);
      expect(
        ALLOWED_TYPES.includes(data.type),
        `${file} has invalid type: "${data.type}"`,
      ).toBe(true);
    }
  });

  test('keywords array has 3+ items', () => {
    for (const file of contentFiles) {
      const content = readFile(file);
      const { data } = parseFrontmatter(content);
      expect(Array.isArray(data.keywords), `${file} keywords is not an array`).toBe(true);
      expect(
        data.keywords.length,
        `${file} has ${data.keywords.length} keywords (minimum 3)`,
      ).toBeGreaterThanOrEqual(3);
    }
  });

  test('ai_summary is <= 150 characters', () => {
    for (const file of contentFiles) {
      const content = readFile(file);
      const { data } = parseFrontmatter(content);
      expect(
        data.ai_summary.length,
        `${file} ai_summary is ${data.ai_summary.length} chars (max 150)`,
      ).toBeLessThanOrEqual(150);
    }
  });
});

// ─── Build output schema (ai-docs.json) ─────────────────────────────────────

describe('Build output schema (ai-docs.json)', () => {
  let docs;

  beforeAll(() => {
    if (!existsSync(outputPath)) {
      throw new Error(
        `dist/ai-docs.json not found. Run "pnpm nx run dialtone-docs:build" before running tests.`,
      );
    }
    const raw = readFileSync(outputPath, 'utf8');
    docs = JSON.parse(raw);
  });

  test('output is a non-empty array', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  test('all entries have required fields', () => {
    for (const doc of docs) {
      for (const field of JSON_REQUIRED_FIELDS) {
        expect.soft(doc, `"${doc.id}" missing "${field}"`).toHaveProperty(field);
      }
    }
  });

  test('keywords is an array of strings in every entry', () => {
    for (const doc of docs) {
      expect(Array.isArray(doc.keywords), `"${doc.id}" keywords not an array`).toBe(true);
      for (const kw of doc.keywords) {
        expect(typeof kw, `"${doc.id}" keyword "${kw}" not a string`).toBe('string');
      }
    }
  });

  test('type field uses allowed values', () => {
    for (const doc of docs) {
      expect(doc.type, `"${doc.id}" type is null`).not.toBeNull();
      expect(ALLOWED_TYPES, `"${doc.id}" invalid type "${doc.type}"`).toContain(doc.type);
    }
  });

  test('summary is a non-empty string in every entry', () => {
    for (const doc of docs) {
      expect(
        typeof doc.summary === 'string' && doc.summary.length > 0,
        `"${doc.id}" summary missing or empty`,
      ).toBe(true);
    }
  });

  test('content is a non-empty string in every entry', () => {
    for (const doc of docs) {
      expect(
        typeof doc.content === 'string' && doc.content.length > 0,
        `"${doc.id}" content missing or empty`,
      ).toBe(true);
    }
  });

  test('content contains no markdown heading syntax', () => {
    for (const doc of docs) {
      expect(doc.content, `"${doc.id}" contains heading syntax`).not.toMatch(/^#{1,6}\s/m);
    }
  });

  test('content contains no fenced code blocks', () => {
    for (const doc of docs) {
      expect(doc.content, `"${doc.id}" contains code fence`).not.toContain('```');
    }
  });

  test('content contains no frontmatter delimiters', () => {
    for (const doc of docs) {
      expect(doc.content, `"${doc.id}" contains frontmatter`).not.toMatch(/^---\s*$/m);
    }
  });

  test('filePath points to an existing file', () => {
    for (const doc of docs) {
      const abs = resolve(packageRoot, doc.filePath);
      expect(existsSync(abs), `"${doc.id}" not found: ${doc.filePath}`).toBe(true);
    }
  });

  // IDs are derived from filenames; INDEX.md files get category-prefixed IDs
  // (e.g. "architecture-INDEX") to avoid collisions. This test validates that logic.
  test('no duplicate ids', () => {
    const ids = docs.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Standards-specific schema ─────────────────────────────────────────────

describe('Standards-specific schema', () => {
  let standardFiles;

  beforeAll(async () => {
    standardFiles = await findFiles('src/content/standards/*.md');
  });

  test('finds standards files', () => {
    expect(standardFiles.length).toBeGreaterThan(0);
  });

  test('all standards have last_verified in YYYY-MM-DD format', () => {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    for (const file of standardFiles) {
      const content = readFile(file);
      const { data } = parseFrontmatter(content);
      const val = data.last_verified;
      const isValid =
        (val instanceof Date && !isNaN(val)) ||
        (typeof val === 'string' && datePattern.test(val));
      expect(isValid, `${file} missing or invalid last_verified: "${val}"`).toBe(true);
    }
  });
});
