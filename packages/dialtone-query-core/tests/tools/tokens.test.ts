import { expect, test } from 'vitest';
import { formatTokenResults } from '../../src/tools/tokens.js';

test.each([
  ['--dt-spacing-400', 'padding: var(--dt-spacing-400)'],
  ['--dt-font-family-body', 'var(--dt-font-family-body) — choose a property'],
])('does not recommend a color property for %s', (name, usage) => {
  const output = formatTokenResults([{
    type: 'design-token', name, metadata: null,
    details: { allThemes: { light: { value: 'example' } } },
  }], name);
  expect(output).toContain(usage);
  expect(output).not.toContain(`color: var(${name})`);
});
