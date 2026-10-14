import { expect, test } from 'vitest';
import { formatTokenResults } from '../../src/tools/tokens.js';

test.each([
  ['--dt-spacing-400', 'padding: var(--dt-spacing-400)', '0.8rem'],
  ['--dt-color-foreground-primary', 'color: var(--dt-color-foreground-primary)', '#111'],
  ['--dt-color-surface-primary', 'background-color: var(--dt-color-surface-primary)', '#fff'],
  ['--dt-color-border-default', 'border-color: var(--dt-color-border-default)', '#aaa'],
  ['--dt-color-border-ai', 'var(--dt-color-border-ai) — choose a property', 'linear-gradient(red, blue)'],
  ['--dt-font-family-body', 'var(--dt-font-family-body) — choose a property'],
])('formats valid token-property guidance for %s', (name, usage, value = 'example') => {
  const output = formatTokenResults([{
    type: 'design-token', name, metadata: null,
    details: { allThemes: { light: { value } } },
  }], name);
  expect(output).toContain(usage);
  if (!name.startsWith('--dt-color-foreground-'))
    expect(output).not.toContain(`Usage: style="color: var(${name})"`);
});
