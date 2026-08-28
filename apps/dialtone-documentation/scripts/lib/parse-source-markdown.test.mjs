import assert from 'node:assert/strict';

import { test } from 'vitest';

import { parseSourceMarkdown } from './parse-source-markdown.mjs';

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
