import { describe, test, expect, beforeAll } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '../..');
const outputPath = resolve(packageRoot, 'dist/ai-docs.json');

const REQUIRED_FIELDS = ['id', 'title', 'type', 'category', 'keywords', 'summary', 'content', 'filePath', 'lastUpdated', 'relatedPackages'];
const ALLOWED_TYPES = ['architecture', 'development', 'workflow', 'reference', 'standard', 'guide', 'template'];

let docs;

describe('Build output — dist/ai-docs.json', () => {
  beforeAll(() => {
    execSync('node src/generators/build-ai-docs.mjs', { cwd: packageRoot, stdio: 'inherit' });
    const raw = readFileSync(outputPath, 'utf8');
    docs = JSON.parse(raw);
  });

  test('output is a non-empty array', () => {
    expect(docs.length).toBeGreaterThan(0);
  });

  test('all entries have required fields', () => {
    for (const doc of docs) {
      for (const field of REQUIRED_FIELDS) {
        expect(doc, `"${doc.id}" missing "${field}"`).toHaveProperty(field);
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
      expect(typeof doc.summary === 'string' && doc.summary.length > 0, `"${doc.id}" summary missing or empty`).toBe(true);
    }
  });

  test('content is a non-empty string in every entry', () => {
    for (const doc of docs) {
      expect(typeof doc.content === 'string' && doc.content.length > 0, `"${doc.id}" content missing or empty`).toBe(true);
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

  test('no duplicate ids', () => {
    const ids = docs.map(d => d.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
