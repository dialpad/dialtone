import { describe, test, expect } from 'vitest';
import { formatSourceLine } from '../src/context.js';
import type { DomainSource } from '../src/data-resolver.js';

const local = (pkg: string, version: string): DomainSource => ({ kind: 'local', package: pkg, version });
const bundled: DomainSource = { kind: 'bundled' };
const ALL_BUNDLED = { components: bundled, utilities: bundled, tokens: bundled, icons: bundled, docs: bundled };

describe('formatSourceLine', () => {
  test('names the umbrella, then lists the domains that came from elsewhere', () => {
    const umbrella = local('@dialpad/dialtone', '10.0.4');
    expect(formatSourceLine({ ...ALL_BUNDLED, components: umbrella, utilities: umbrella, tokens: umbrella, icons: local('@dialpad/dialtone-icons', '5.0.0') }, '1.1.0'))
      .toBe('Using local Dialtone data: @dialpad/dialtone@10.0.4 (icons: @dialpad/dialtone-icons@5.0.0, docs: bundled)');
  });

  test('an icons-only install lists every bundled domain', () => {
    expect(formatSourceLine({ ...ALL_BUNDLED, icons: local('@dialpad/dialtone-icons', '5.0.0') }, '1.1.0'))
      .toBe('Using local Dialtone data: @dialpad/dialtone-icons@5.0.0 (components: bundled, utilities: bundled, tokens: bundled, docs: bundled)');
  });

  test('bundled data names the CLI version', () => {
    expect(formatSourceLine(ALL_BUNDLED, '1.1.0')).toBe('Using bundled Dialtone data (@dialpad/dialtone-cli@1.1.0)');
  });
});
