import assert from 'node:assert/strict';

import { test } from 'vitest';

import { parseMarkdownFrontmatter } from './frontmatter.mjs';

test('adds the source path to invalid frontmatter errors', () => {
  const source = `---
keywords: [components
---
`;

  assert.throws(
    () => parseMarkdownFrontmatter(source, { filePath: '/docs/broken.md' }),
    /Invalid frontmatter in \/docs\/broken\.md/,
  );
});
