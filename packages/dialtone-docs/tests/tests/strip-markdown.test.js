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

  test('preserves fenced examples verbatim only when requested', () => {
    const code = ['```html', `<button v-dt-tooltip="'Save'">Save</button>`, '<!-- example comment -->', '```'].join('\n');
    const markdown = `Before\n\n${code}\n\nAfter`;
    expect(stripMarkdown(markdown, { preserveFencedCode: true })).toContain(code);
    expect(stripMarkdown(markdown)).not.toContain('v-dt-tooltip');
  });

  test.each(['`', '~'])('preserves %s fences through invalid closing markers', marker => {
    const fence = marker.repeat(4);
    const other = marker === '`' ? '~~~~' : '````';
    const code = [
      `${fence}html`,
      marker.repeat(3),
      other,
      `${fence} still code`,
      '<button v-dt-tooltip="\'Save\'">Save</button>',
      `${fence}${marker}  `,
    ].join('\n');
    expect(stripMarkdown(`Before\n\n${code}\n\nAfter`, { preserveFencedCode: true }))
      .toBe(`Before\n\n${code}\n\nAfter`);
  });

  test('removes code blocks but preserves surrounding text', () => {
    const md = 'Before\n\n```js\nconst x = 1;\n```\n\nAfter';
    const result = stripMarkdown(md);
    expect(result).not.toContain('const x = 1');
    expect(result).toMatch(/Before[\s\S]*After/);
  });
});
