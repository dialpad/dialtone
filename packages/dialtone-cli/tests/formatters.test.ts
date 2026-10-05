import { describe, test, expect } from 'vitest';
import type { SearchResult } from '@dialpad/dialtone-query-core';
import { formatComponentOutput, formatPrompt } from '../src/formatters.js';

describe('import hints name the given package', () => {
  // Not a real Dialtone path, so a hint hard-coded to any of them fails.
  const importFrom = '@example/ui';
  const button: SearchResult = { type: 'component', name: 'DtButton', details: {}, metadata: null };

  test('minimal component view', () => {
    expect(formatComponentOutput(button, 'minimal', undefined, { importFrom })).toBe([
      'DtButton',
      '',
      "Import: import { DtButton } from '@example/ui'",
    ].join('\n'));
  });

  test('markdown component view', () => {
    expect(formatComponentOutput(button, 'markdown', undefined, { importFrom })).toBe([
      '# DtButton',
      '',
      '## Usage',
      '',
      '```vue',
      "import { DtButton } from '@example/ui'",
      '```',
    ].join('\n'));
  });

  test('examples', () => {
    expect(formatComponentOutput(button, 'minimal', 'examples', { importFrom }))
      .toBe("import { DtButton } from '@example/ui'\n\n<DtButton />");
  });

  test('prompt text', () => {
    expect(formatPrompt({ displayName: 'DtButton' }, importFrom))
      .toBe("<DtButton>\nImport: import { DtButton } from '@example/ui'");
  });
});
