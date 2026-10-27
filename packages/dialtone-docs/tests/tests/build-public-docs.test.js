import { describe, test, expect, beforeAll } from 'vitest';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { globSync } from 'glob';
import matter from 'gray-matter';
import { buildRecords, chunkSections } from '@src/generators/build-public-docs.mjs';
import { readKeywords } from '@src/utils/keywords.mjs';
import { stripMarkdown } from '@src/utils/strip-markdown.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtureDir = resolve(__dirname, '../fixtures/public-docs');
const directiveRoot = resolve(__dirname, '../../../dialtone-vue/directives');
const docsRoot = resolve(__dirname, '../../../../apps/dialtone-documentation/docs');
const normalize = (text) => text.replace(/\s+/g, ' ').trim();
// Existing emphasis stripping can pair '*' markers across adjacent slots.
const normalizeProse = (text) => normalize(text.replace(/\*/g, ''));

// Read authored, standalone usage blocks independently of the production token walk.
function usageBlocks(markdown) {
  const blocks = [];
  let fence = null;
  let block = null;
  let slot = null;
  for (const line of markdown.replace(/<!--[\s\S]*?-->/g, '').split('\n')) {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    if (fence) continue;
    if (/^\s*<dialtone-usage\b[^>]*>\s*$/.test(line)) {
      block = { lines: [], slots: [] };
    }
    if (!block) continue;
    block.lines.push(line);
    const opening = line.match(/^\s*<template\s+#(do|dont)\s*>\s*$/);
    if (opening) {
      slot = { label: opening[1] === 'do' ? 'Do' : 'Don\'t', lines: [] };
      block.slots.push(slot);
    } else if (/^\s*<\/template>\s*$/.test(line)) slot = null;
    else if (slot) slot.lines.push(line);
    if (/^\s*<\/dialtone-usage>\s*$/.test(line)) {
      blocks.push(block);
      block = null;
    }
  }
  return blocks;
}

describe('authored usage guidance', () => {
  test.each(['modal', 'card'])('%s keeps source items in their labeled usage group', (name) => {
    const path = resolve(docsRoot, `components/${name}.md`);
    const record = buildRecords(path).find(record => record.id === `components/${name}#usage`);
    expect(record.headingPath).toEqual(['Usage']);
    expect(record.filePath).toBe(`apps/dialtone-documentation/docs/components/${name}.md`);
    const labels = [...record.content.matchAll(/^(Do|Don't):$/gm)];
    const [, doText, dontText] = record.content.split(/(?:^|\n)(?:Do|Don't):\n/);
    expect(labels.map(match => match[1])).toEqual(['Do', 'Don\'t']);
    const block = usageBlocks(readFileSync(path, 'utf8'))[0];
    for (const [index, group] of [doText, dontText].entries()) {
      const items = block.slots[index].lines.filter(line => line.startsWith('- '));
      expect(normalize(group)).toBe(normalize(items.map(item => stripMarkdown(item)).join('\n')));
    }
    expect(doText).toContain(name === 'modal' ? 'Confirming a destructive action' : 'content and actions on a single topic');
    expect(dontText).toContain(name === 'modal' ? 'Form-related critical, positive, or warning messages' : 'too many call-to-action elements');
  });

  test('all authored usage blocks label exactly their nonempty stripped slots', () => {
    const paths = globSync('**/*.md', { cwd: docsRoot, absolute: true, ignore: ['_data/**', '.vuepress/**'] });
    let checked = 0;
    for (const path of paths) {
      const source = readFileSync(path, 'utf8');
      const records = buildRecords(path);
      for (const section of chunkSections(matter(source).content)) {
        const blocks = usageBlocks(section.raw);
        if (!blocks.length) continue;
        const expected = blocks.flatMap(block => block.slots.map(slot => ({
          label: slot.label,
          content: stripMarkdown(slot.lines.join('\n'), { stripFrontmatter: false }),
        })).filter(slot => slot.content.trim()));
        for (const block of blocks) {
          const slots = block.slots.map(slot => ({ label: slot.label, content: stripMarkdown(slot.lines.join('\n')) }))
            .filter(slot => slot.content.trim());
          const text = stripMarkdown(block.lines.join('\n'));
          expect(normalizeProse(text), path).toBe(normalizeProse(slots.map(slot => `${slot.label}:\n\n${slot.content}`).join('\n\n')));
          expect(text, path).not.toMatch(/[\uE000\uE001]/);
          checked++;
        }
        if (!records.length) continue; // Non-ready pages still get the isolated-block check.
        const record = records.find(record => !record.example &&
          JSON.stringify(record.headingPath) === JSON.stringify(section.headingPath));
        expect(record, path).toBeDefined();
        expect([...record.content.matchAll(/^(Do|Don't):$/gm)].map(match => match[1]), path)
          .toEqual(expected.map(slot => slot.label));
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});

describe('public directive MDX records', () => {
  test.each(['tooltip', 'scrollbar', 'mode', 'focusgroup', 'focustrap'])('%s retains its public contract and source reference', (name) => {
    const records = buildRecords(resolve(directiveRoot, `${name}_directive/${name}.mdx`));
    expect(records[0].docId).toBe(`directives/${name}`);
    expect(records[0].category).toBe('directives');
    const content = records.map(record => record.content).join(' ');
    expect(content).toContain(`v-dt-${name}`);
    expect(content).toContain(`Dt${name[0].toUpperCase()}${name.slice(1)}Directive`);
    expect(content).toContain('app.use');
    expect(content).toContain('```js\nimport {');
    expect(content).not.toMatch(/import \*|<Meta|<Canvas|Stories|addon-docs/);
    for (const record of records) expect(record.content.trim()).not.toBe('');
  });

  test('source qualification and Storybook identity are derived for a public directive', () => {
    const { frontmatter } = buildRecords(resolve(directiveRoot, 'tooltip_directive/tooltip.mdx'))[0];
    expect(frontmatter.sourcePackage).toBe('@dialpad/dialtone-vue');
    expect(frontmatter.sourceVersion).toMatch(/^\d+\.\d+\.\d+/);
    expect(frontmatter.storybook).toBe('https://dialtone.dialpad.com/vue/?path=/docs/directives-tooltip--docs');
  });
});

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

  test('fence line with info text inside an open fence does not close it', () => {
    const body = '## Real\n```\n```js\n## Fake\n```\nAfter.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].headingPath).toEqual(['Real']);
    expect(sections[0].raw).toContain('After.');
  });

  test('shorter closing fence does not close a longer opening fence', () => {
    const body = '## Real\nIntro.\n````js\n## Fake\nconst x = 1;\n```\nstill inside\n````\nAfter.';
    const sections = chunkSections(body);
    expect(sections).toHaveLength(1);
    expect(sections[0].headingPath).toEqual(['Real']);
    expect(sections[0].raw).toContain('After.');
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

  test('preserves validated keywords on every section record', () => {
    expect(records.map(r => r.frontmatter.keywords)).toEqual(records.map(() => ['spinner', 'activity indicator']));
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

  test('uppercase status (e.g. "WIP") is normalized and excluded', () => {
    expect(buildRecords(resolve(fixtureDir, 'uppercase-status.md'))).toHaveLength(0);
  });
});

// ─── Edge case tests ─────────────────────────────────────────────────────────

describe('buildRecords — edge cases', () => {
  test('Tooltip prose keeps the literal wrapper independently of examples and source identity', () => {
    const tooltip = resolve(__dirname, '../../../../apps/dialtone-documentation/docs/components/tooltip.md');
    const record = buildRecords(tooltip).find(r => r.headingPath.includes('Tooltip as a Component'));
    expect(record.content).toContain('wrap the button in a `<span>` element');
    expect(record.content).toContain('disabled elements do not fire mouse events');
    expect(record.content).not.toContain('<dt-tooltip');
    expect(record.filePath).toBe('apps/dialtone-documentation/docs/components/tooltip.md');
    expect(record.frontmatter.storybook).toContain('components-tooltip');
  });

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

  test('fence line with info text does not close an open fence', () => {
    // info-text-fence.md: ``` opens, ```js inside must NOT close (has info text), ``` closes.
    const records = buildRecords(resolve(fixtureDir, 'info-text-fence.md'));
    const fakeRecord = records.find(r => r.headingPath.some(h => h.includes('Fake Heading')));
    expect(fakeRecord).toBeUndefined();
    const usage = records.find(r => r.headingPath.includes('Usage'));
    expect(usage).toBeDefined();
    expect(usage.content).toContain('More content after the fence');
  });

  test('shorter closing fence does not close a longer opening fence', () => {
    // long-fence.md opens with ```` (4 backticks); the ``` inside must NOT close it.
    const records = buildRecords(resolve(fixtureDir, 'long-fence.md'));
    const fakeRecord = records.find(r => r.headingPath.some(h => h.includes('Fake Heading')));
    expect(fakeRecord).toBeUndefined();
    const usage = records.find(r => r.headingPath.includes('Usage'));
    expect(usage).toBeDefined();
    expect(usage.content).toContain('More content after the fence');
  });

  test('heading inside an indented fenced code block does not split', () => {
    // indented-fence.md has only one ## Usage section; the indented ```js block
    // contains a fake ## heading that must NOT produce a separate record.
    const records = buildRecords(resolve(fixtureDir, 'indented-fence.md'));
    const fakeRecord = records.find(r => r.headingPath.some(h => h.includes('Fake Heading')));
    expect(fakeRecord).toBeUndefined();
    const usage = records.find(r => r.headingPath.includes('Usage'));
    expect(usage).toBeDefined();
    expect(usage.content).toContain('More content after the fence');
  });
});

// Public source keywords must reach both lookup adapters without a Vue rebuild.
describe('readKeywords', () => {
  test('trims authored keywords and keeps them optional', () => {
    expect(readKeywords([' spinner ', 'activity indicator'], 'loader.md')).toEqual(['spinner', 'activity indicator']);
    expect(readKeywords(undefined, 'loader.md')).toBeUndefined();
  });

  test.each([['spinner'], [['spinner', 42]], [[' ']], [[]]])('rejects malformed keywords %j', (keywords) => {
    expect(() => readKeywords(keywords, 'loader.md')).toThrow(/Invalid keywords in loader\.md: expected an array of nonempty strings/);
  });
});
