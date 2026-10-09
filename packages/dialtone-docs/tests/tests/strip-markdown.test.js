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

  test('preserves literal markup as code while removing layout HTML', () => {
    expect(stripMarkdown('<dialtone-usage>Wrap the button in a `<span>` element.</dialtone-usage>'))
      .toBe('Wrap the button in a `<span>` element.');
  });

  test('inline code retains punctuation and link-like text', () => {
    expect(stripMarkdown('Use `content_mode`, `[label](url)`, and ``a`b``.'))
      .toBe('Use content_mode, [label](url), and a`b.');
  });

  test('embedded scripts and styles stay out of searchable prose', () => {
    expect(stripMarkdown('Guidance.\n<script setup>\nimport Demo from "./Demo.vue";\n</script>\n<style>.demo { color: red; }</style>\nMore guidance.'))
      .toBe('Guidance.\n\nMore guidance.');
  });

  test('indented fenced examples do not leak literal markup into prose', () => {
    const result = stripMarkdown('Before\n   ````vue\n<span>Example</span>\n```\nstill code\n   ````\nAfter');
    expect(result).toBe('Before\n\nAfter');
  });

  test('literal markup survives longer backtick runs inside inline code', () => {
    expect(stripMarkdown('Use ``<span>``` text`` and `<button>`.'))
      .toBe('Use ``<span>``` text`` and `<button>`.');
  });

  test('fences inside comments do not suppress prose or quoted comments', () => {
    expect(stripMarkdown('Before\n<!-- hidden\n```\n-->\nAfter `<!-- reference -->`.'))
      .toBe('Before\n\nAfter `<!-- reference -->`.');
  });

  test('a triple-backtick inline reference is not a fenced block with invalid info text', () => {
    expect(stripMarkdown('```<span>```\n\nAfter.'))
      .toBe('```<span>```\n\nAfter.');
  });

  test.each([
    '<script>\nconst x = `value`;\n</script>',
    '<!-- hidden `code` -->',
  ])('an unmatched inline opener cannot bridge a block containing code: %s', block => {
    expect(stripMarkdown(`Before \`stray\n${block}\nAfter.`))
      .toBe('Before `stray\n\nAfter.');
  });
});
