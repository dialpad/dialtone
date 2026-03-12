import { beforeAll, describe, test, expect } from 'vitest';
import { findFiles, readFile } from '@helpers/fileReader.js';
import { parseFrontmatter, validateRequiredFields } from '@helpers/frontmatterParser.js';

const REQUIRED_FIELDS = ['type', 'category', 'keywords', 'ai_summary'];
const ALLOWED_TYPES = ['architecture', 'development', 'workflow', 'reference', 'standard', 'guide', 'template'];

describe('Frontmatter validation', () => {
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
      const { valid, missing } = validateRequiredFields(parsed, REQUIRED_FIELDS);
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
