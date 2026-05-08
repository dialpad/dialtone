import { describe, test, expect, beforeAll } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRecords, chunkSections } from '@src/generators/build-public-docs.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, '../fixtures/public-docs');

// ─── chunkSections unit tests ────────────────────────────────────────────────

describe('chunkSections', () => {
  test('body with no headings emits one section with empty headingPath', () => {
    const body = 'Just some plain text.\n\nAnother paragraph.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].headingPath).toEqual([]);
    expect(sections[0].raw).toContain('plain text');
  });

  test('splits on H2 boundaries', () => {
    const body = '## Usage\nContent A.\n## Variants\nContent B.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(2);
    expect(sections[0].headingPath).toEqual(['Usage']);
    expect(sections[1].headingPath).toEqual(['Variants']);
  });

  test('H3 nests under the current H2', () => {
    const body = '## Section A\nIntro.\n### Subsection 1\nDetail.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(2);
    expect(sections[0].headingPath).toEqual(['Section A']);
    expect(sections[1].headingPath).toEqual(['Section A', 'Subsection 1']);
  });

  test('heading inside a fenced code block does NOT split', () => {
    const body = '## Real Section\nSome content.\n```js\n## Fake Heading\nconst x = 1;\n```\nMore content.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].raw).toContain('Fake Heading');
    expect(sections[0].raw).toContain('More content');
  });

  test('second H2 resets H3 context', () => {
    // ## A has content before ### A1, so 3 sections are produced: [A], [A,A1], [B]
    const body = '## A\nContent A.\n### A1\nContent A1.\n## B\nContent B.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(3);
    expect(sections[0].headingPath).toEqual(['A']);
    expect(sections[1].headingPath).toEqual(['A', 'A1']);
    expect(sections[2].headingPath).toEqual(['B']);
  });
});

// ─── buildRecords integration tests ─────────────────────────────────────────

describe('buildRecords — complete.md', () => {
  let records;

  beforeAll(() => {
    records = buildRecords(resolve(fixtureDir, 'complete.md'));
  });

  test('produces records from a status:ready file', () => {
    expect(records.length).toBeGreaterThanOrEqual(2);
  });

  test('record has expected shape', () => {
    const r = records[0];
    expect(r).toHaveProperty('id');
    expect(r).toHaveProperty('docId', 'complete');
    expect(r).toHaveProperty('docTitle', 'Complete Component');
    expect(r).toHaveProperty('category');
    expect(r).toHaveProperty('headingPath');
    expect(r).toHaveProperty('content');
    expect(r).toHaveProperty('frontmatter');
    expect(r).toHaveProperty('filePath');
  });

  test('preserves frontmatter figmaUrl and storybook', () => {
    expect(records[0].frontmatter.figmaUrl).toBe('https://www.figma.com/design/example');
    expect(records[0].frontmatter.storybook).toContain('dialtone.dialpad.com');
  });

  test('inner text inside <dialtone-usage> is preserved in content', () => {
    const usageRecord = records.find(r => r.headingPath.includes('Usage'));
    expect(usageRecord).toBeDefined();
    expect(usageRecord.content).toContain('Conveying that an action that will occur when invoked');
  });

  test('content has no raw VuePress directive tags', () => {
    for (const r of records) {
      expect(r.content).not.toMatch(/<dialtone-usage/);
      expect(r.content).not.toMatch(/<code-well-header/);
      expect(r.content).not.toMatch(/<template/);
    }
  });

  test('heading inside code block does not create a new section', () => {
    // complete.md has: preamble (before ## Usage), ## Usage, ## Variants, ### Sizes = 4 sections.
    // Plus a ## inside a fenced code block that must NOT produce a 5th section.
    expect(records).toHaveLength(4);
    // No record for the fake heading
    const fakeRecord = records.find(r => r.headingPath.some(h => h.includes('Fake Heading')));
    expect(fakeRecord).toBeUndefined();
    // The Sizes subsection contains 'More variant content' (after the code block)
    const sizesRecord = records.find(r => r.headingPath.includes('Sizes'));
    expect(sizesRecord).toBeDefined();
    expect(sizesRecord.content).toContain('More variant content');
  });

  test('section ids are unique within a doc', () => {
    const ids = records.map(r => r.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

// ─── Status filter tests ─────────────────────────────────────────────────────

describe('buildRecords — status filter (blacklist)', () => {
  test('status:beta file produces zero records', () => {
    expect(buildRecords(resolve(fixtureDir, 'beta.md'))).toHaveLength(0);
  });

  test('status:planned file produces zero records', () => {
    expect(buildRecords(resolve(fixtureDir, 'planned.md'))).toHaveLength(0);
  });

  test('file with no status field is included', () => {
    expect(buildRecords(resolve(fixtureDir, 'no-status.md'))).toHaveLength(1);
  });

  test('status:experimental file is included (not in blacklist)', () => {
    expect(buildRecords(resolve(fixtureDir, 'unknown-status.md'))).toHaveLength(1);
  });
});

// ─── Edge case tests ─────────────────────────────────────────────────────────

describe('buildRecords — edge cases', () => {
  test('file with no H2/H3 emits one record with empty headingPath', () => {
    const records = buildRecords(resolve(fixtureDir, 'no-headings.md'));
    expect(records).toHaveLength(1);
    expect(records[0].headingPath).toEqual([]);
  });

  test('multi-line VuePress directive does not leak attribute text into content', () => {
    const records = buildRecords(resolve(fixtureDir, 'multiline-directive.md'));
    expect(records.length).toBeGreaterThan(0);
    for (const r of records) {
      expect(r.content).not.toMatch(/<some-component/);
      expect(r.content).not.toMatch(/:items=/);
    }
  });

  test('nested H3 produces headingPath with parent H2 and child H3', () => {
    const records = buildRecords(resolve(fixtureDir, 'nested-headings.md'));
    const nested = records.find(r => r.headingPath.length === 2);
    expect(nested).toBeDefined();
    expect(nested.headingPath[1]).toBe('Subsection 1');
  });
});
