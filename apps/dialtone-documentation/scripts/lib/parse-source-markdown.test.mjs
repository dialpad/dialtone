import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { test } from 'vitest';

import { parseSourceMarkdown } from './parse-source-markdown.mjs';
import { setComponentDocs } from './transform-vue-api.mjs';

for (const name of ['modal', 'card']) {
  test(`${name} raw usage retains Do/Don't labels and source items`, () => {
    const source = readFileSync(new URL(`../../docs/components/${name}.md`, import.meta.url), 'utf8');
    const block = source.match(/<dialtone-usage>[\s\S]*?<\/dialtone-usage>/)[0];
    const output = parseSourceMarkdown(block, {});
    const [, doText, dontText] = output.split(/\*\*(?:Do|Don't):\*\*/);
    assert.deepEqual([...output.matchAll(/\*\*(Do|Don't):\*\*/g)].map(match => match[1]), ['Do', 'Don\'t']);
    for (const [index, slot] of [...block.matchAll(/<template #(do|dont)>([\s\S]*?)<\/template>/g)].entries()) {
      assert.equal([doText, dontText][index].trim(), slot[2].trim());
    }
    if (name === 'modal') assert.ok(dontText.includes('[Toast](toast.md)'));
  });
}

test('unresolved API references report their source page and repair command', () => {
  setComponentDocs([]);
  assert.throws(() => parseSourceMarkdown('<component-vue-api component-name="missing_component" />', { filePath: 'docs/components/missing.md' }),
    /missing_component.*docs\/components\/missing.md.*build-dialtone-vue-docs/);
});

test('emits multiline reader metadata without navigation metadata', () => {
  const source = `---
title: Dialtone CLI
description: >-
  Search the installed Dialtone version
  from the command line.
status: ready
keywords:
  [
    "command line",
    "cli",
    "documentation search",
  ]
next:
  text: Another page
  link: /another-page/
---

Body content.
`;

  const output = parseSourceMarkdown(source, {});

  assert.equal(output, `# Dialtone CLI

Search the installed Dialtone version from the command line.

- **Status**: ready
- **Keywords**: command line, cli, documentation search

Body content.
`);
  assert.doesNotMatch(output, /Another page|\/another-page\//);
});

test('formats parsed frontmatter dates as ISO calendar dates', () => {
  const source = `---
heading: Release update
posted: 2026-08-27
---
`;

  const output = parseSourceMarkdown(source, {});

  assert.match(output, /- \*\*Posted\*\*: 2026-08-27/);
});
