import { describe, test, expect } from 'vitest';
import { stripMarkdown, stripFrontmatter } from '@src/utils/strip-markdown.mjs';

describe('stripFrontmatter', () => {
  test('removes YAML frontmatter', () => {
    const md = '---\ntitle: Hello\n---\n\n# Body';
    expect(stripFrontmatter(md)).toBe('\n# Body');
  });
});

describe('stripMarkdown', () => {
  const usage = (body) => `<dialtone-usage>${body}</dialtone-usage>`;

  test('keeps opposite usage slots distinct in source order', () => {
    expect(stripMarkdown(usage('<template #dont>Discouraged.</template><template #do>Recommended.</template>')))
      .toBe('Don\'t:\n\nDiscouraged.\n\nDo:\n\nRecommended.');
  });

  test('labels only slots with content after stripping and keeps outside prose separate', () => {
    expect(stripMarkdown(usage('<template #do><svg-loader name="example" /></template><template #dont>Avoid this.</template>') + '\nAfter.'))
      .toBe('Don\'t:\n\nAvoid this.\n\nAfter.');
    expect(stripMarkdown(usage('<template #do> <!-- hidden --> <img src="example.png" /></template>') + '\nAfter.'))
      .toBe('After.');
    expect(stripMarkdown(usage('<template #do>![Useful alt](image.png) and `<span>`</template>')))
      .toBe('Do:\n\nUseful alt and `<span>`');
  });

  test('supports attributed wrappers and indented slots without leaking across wrappers', () => {
    const markdown = '<dialtone-usage class="grid">\n  <template #do>\n- First.\n  </template>\n</dialtone-usage>\n' +
      usage('<template #dont>- Second.</template>') + '\n<template #do>Outside.</template>';
    expect(stripMarkdown(markdown)).toBe('Do:\n\n- First.\n\nDon\'t:\n\n- Second.\n\nOutside.');
  });

  test.each(['`', '~'])('does not interpret usage slots inside %s fences', (marker) => {
    const code = `${marker.repeat(3)}vue\n${usage('<template #do>Literal.</template>')}\n\n\n${marker.repeat(3)}`;
    const markdown = `${code}\n\n${usage('<template #dont>Real guidance.</template>')}`;
    expect(stripMarkdown(markdown)).toBe('Don\'t:\n\nReal guidance.');
    expect(stripMarkdown(markdown, { preserveFencedCode: true })).toBe(`${code}\n\nDon't:\n\nReal guidance.`);
  });

  test('keeps literal slot markup inside inline code and ignores hidden blocks', () => {
    const literal = '`<dialtone-usage><template #do>Example.</template></dialtone-usage>`';
    const hidden = ['<!--', '<script>', '<style>'].map((open, index) =>
      `${open}${usage('<template #do>Hidden.</template>')}${['-->', '</script>', '</style>'][index]}`,
    ).join('\n');
    expect(stripMarkdown(`${hidden}\n${usage(`<template #dont>Use ${literal} as code.</template>`)}`))
      .toBe(`Don't:\n\nUse ${literal} as code.`);
  });

  test('keeps unslotted and incomplete usage markup as unlabeled prose', () => {
    expect(stripMarkdown('<dialtone-usage><template #do>Incomplete.')).toBe('Incomplete.');
    expect(stripMarkdown('<dialtone-usage><template #do>Incomplete wrapper.</template>'))
      .toBe('Incomplete wrapper.');
    expect(stripMarkdown('<dialtone-usage-example><template #do>Outside.</template></dialtone-usage-example>'))
      .toBe('Outside.');
  });

  test('does not assign polarity to nested usage but preserves all its prose', () => {
    const nested = usage(`<template #do>Outer. ${usage('<template #dont>Avoid nested.</template>')}</template>`);
    expect(stripMarkdown(nested)).toBe('Outer. Avoid nested.');
  });

  test('keeps an ordinary nested template inside its usage slot', () => {
    expect(stripMarkdown(usage('<template #do>First. <template v-if="show">Conditional.</template> Last.</template>')))
      .toBe('Do:\n\nFirst. Conditional. Last.');
  });

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
    const markdown = `Before use \`<span>\`.\n\n${code}\n\nAfter`;
    expect(stripMarkdown(markdown, { preserveFencedCode: true })).toContain(code);
    expect(stripMarkdown(markdown, { preserveFencedCode: true })).toContain('`<span>`');
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

  test('script and style prefixes in custom elements do not hide prose or interrupt inline code', () => {
    for (const tag of ['style-guide', 'script-editor']) {
      expect(stripMarkdown(`<${tag}>Guidance.</${tag}> More guidance.`))
        .toBe('Guidance. More guidance.');
      const inline = `Use \`an example\n<${tag}>still literal</${tag}>\` after.`;
      expect(stripMarkdown(inline)).toBe(inline);
    }
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
