import { describe, test, expect } from 'vitest';
import type { SearchResult } from '@dialpad/dialtone-query-core';
import { componentImportPath, formatComponentOutput, formatPrompt } from '../src/formatters.js';

describe('componentImportPath', () => {
  test('umbrella data imports from @dialpad/dialtone/vue', () => {
    expect(componentImportPath({ kind: 'local', package: '@dialpad/dialtone', version: '10.0.4' })).toBe('@dialpad/dialtone/vue');
  });

  test('dialtone-vue data imports from @dialpad/dialtone-vue', () => {
    expect(componentImportPath({ kind: 'local', package: '@dialpad/dialtone-vue', version: '4.0.2' })).toBe('@dialpad/dialtone-vue');
  });

  test('bundled data imports from @dialpad/dialtone/vue', () => {
    expect(componentImportPath({ kind: 'bundled' })).toBe('@dialpad/dialtone/vue');
  });
});

describe('import hints name the given package', () => {
  // Hints used to hard-code @dialpad/dialtone-vue, so passing it would pass against the old code.
  const importFrom = '@dialpad/dialtone/vue';
  const button: SearchResult = { type: 'component', name: 'DtButton', details: {}, metadata: null };

  test('minimal component view', () => {
    expect(formatComponentOutput(button, 'minimal', undefined, { importFrom })).toBe([
      'DtButton',
      '',
      "Import: import { DtButton } from '@dialpad/dialtone/vue'",
    ].join('\n'));
  });

  test('markdown component view', () => {
    expect(formatComponentOutput(button, 'markdown', undefined, { importFrom })).toBe([
      '# DtButton',
      '',
      '## Usage',
      '',
      '```vue',
      "import { DtButton } from '@dialpad/dialtone/vue'",
      '```',
    ].join('\n'));
  });

  test('examples', () => {
    expect(formatComponentOutput(button, 'minimal', 'examples', { importFrom }))
      .toBe("import { DtButton } from '@dialpad/dialtone/vue'\n\n<DtButton />");
  });

  test('prompt text', () => {
    expect(formatPrompt({ displayName: 'DtButton' }, importFrom))
      .toBe("<DtButton>\nImport: import { DtButton } from '@dialpad/dialtone/vue'");
  });
});
