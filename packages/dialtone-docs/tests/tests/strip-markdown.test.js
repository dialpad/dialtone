import { describe, test, expect } from 'vitest';
import { stripMarkdown, stripFrontmatter } from '@src/utils/strip-markdown.mjs';

describe('stripFrontmatter', () => {
  test('removes YAML frontmatter', () => {
    const md = '---\ntitle: Hello\n---\n\n# Body';
    expect(stripFrontmatter(md)).toBe('\n# Body');
  });
});

describe('stripMarkdown', () => {
  test.each([
    ['heading markers', '## Section Title', 'Section Title'],
    ['frontmatter', '---\ntype: workflow\n---\n\nPlain text here.', 'Plain text here.'],
    ['inline code backticks', 'Use `gray-matter` to parse.', 'Use gray-matter to parse.'],
    ['link syntax keeping text', '[Dialtone](https://dialtone.dialpad.com)', 'Dialtone'],
    ['bold emphasis', 'This is **bold** text.', 'This is bold text.'],
    ['italic emphasis', 'This is _italic_ text.', 'This is italic text.'],
  ])('removes %s', (_label, input, expected) => {
    expect(stripMarkdown(input)).toBe(expected);
  });

  test('removes code blocks but preserves surrounding text', () => {
    const md = 'Before\n\n```js\nconst x = 1;\n```\n\nAfter';
    const result = stripMarkdown(md);
    expect(result).not.toContain('const x = 1');
    expect(result).toMatch(/Before[\s\S]*After/);
  });
});
