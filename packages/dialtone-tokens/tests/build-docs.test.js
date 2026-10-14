import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import { buildDocs, writeDocs } from '../build-docs.js';

describe('token documentation', () => {
  it('retains zero-valued tokens and the source deprecation reason', () => {
    const write = vi.spyOn(fs, 'writeFile').mockImplementation(() => {});
    try {
      buildDocs('css/variables', 'fixture', { name: 'dt-space-0', value: 0, path: ['space', '0'], $deprecated: 'Use spacing tokens in Dialtone 10.' });
      writeDocs();
      const output = JSON.parse(write.mock.calls[0][1]);
      expect(output.fixture['space/0']['css/variables']).toMatchObject({ value: 0, deprecated: 'Use spacing tokens in Dialtone 10.' });
    } finally {
      write.mockRestore();
    }
  });
});
