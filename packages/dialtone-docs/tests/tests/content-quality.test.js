import { describe, test, expect, beforeAll } from 'vitest';
import { readdirSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { fileExists, findFiles, readFile } from '@helpers/fileReader.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packageRoot = resolve(__dirname, '../..');
const contentDir = join(packageRoot, 'src/content');

// ─── Category structure ──────────────────────────────────────────────────────

describe('Content structure — categories', () => {
  let categories;

  beforeAll(() => {
    // Discover category directories dynamically — no hardcoded list.
    // Adding a new src/content/<category>/ automatically gets tested.
    categories = readdirSync(contentDir, { withFileTypes: true })
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name);
  });

  test('at least one category directory exists', () => {
    expect(categories.length).toBeGreaterThan(0);
  });

  test('every category directory has an INDEX.md', () => {
    for (const category of categories) {
      const indexPath = join('src/content', category, 'INDEX.md');
      expect(fileExists(indexPath), `${indexPath} missing`).toBe(true);
    }
  });
});

// ─── Content quality ─────────────────────────────────────────────────────────

describe('Content quality — no placeholder text', () => {
  const PLACEHOLDER_PATTERNS = [/\bTODO\b/, /\bFIXME\b/, /\bcoming soon\b/i, /\bTBD\b/i];

  test('no placeholder content in substantive files', async () => {
    // INDEX.md files are intentionally minimal category landing pages — they
    // list links to substantive docs but do not contain prose content themselves.
    const files = await findFiles('src/content/**/*.md', {
      ignore: ['**/INDEX.md', '**/node_modules/**'],
    });

    for (const file of files) {
      const content = readFile(file);
      // Strip fenced code blocks, inline code, and quoted strings before checking —
      // standards docs legitimately mention "TODO" as examples of what NOT to write.
      const stripped = content
        .replace(/```[\s\S]*?```/g, '')
        .replace(/`[^`]+`/g, '')
        .replace(/"[^"]*"/g, '');

      for (const pattern of PLACEHOLDER_PATTERNS) {
        expect(
          pattern.test(stripped),
          `${file} contains placeholder: ${pattern}`,
        ).toBe(false);
      }
    }
  });
});
