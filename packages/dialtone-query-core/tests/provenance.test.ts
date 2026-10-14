import { describe, it, expect } from 'vitest';
import { stampDatasets } from '../scripts/build-bundled-provenance.mjs';
describe('reproducible bundled stamp', () => {
  it('changes data identity when bytes change even at the same package version', () => {
    const inputs = [
      {
        domain: 'components',
        package: '@dialpad/dialtone-vue',
        version: '4.3.1',
        schemaVersion: 2,
        bytes: Buffer.from('[1]'),
      },
    ];
    const first = stampDatasets(inputs);
    expect(first).toEqual(stampDatasets(inputs));
    expect(first.buildHash).not.toBe(
      stampDatasets([{ ...inputs[0], bytes: Buffer.from('[2]') }]).buildHash,
    );
    expect(first.domains.components.version).toBe('4.3.1');
  });
});
it('separates exact artifact bytes from stable content identity across checkout paths', () => {
  const input = {
    domain: 'components',
    package: '@dialpad/dialtone-vue',
    version: '4.3.1',
    schemaVersion: 2,
  };
  const a = stampDatasets(
    [
      {
        ...input,
        bytes: Buffer.from(
          JSON.stringify([
            {
              displayName: 'DtButton',
              sourceFiles: [
                '/one/packages/dialtone-vue/components/button/button.vue',
              ],
            },
          ]),
        ),
      },
    ],
    { sourceRoot: '/one' },
  );
  const b = stampDatasets(
    [
      {
        ...input,
        bytes: Buffer.from(
          JSON.stringify([
            {
              displayName: 'DtButton',
              sourceFiles: [
                '/two/packages/dialtone-vue/components/button/button.vue',
              ],
            },
          ]),
        ),
      },
    ],
    { sourceRoot: '/two' },
  );
  expect(a.domains.components.hash).not.toBe(b.domains.components.hash);
  expect(a.domains.components.contentHash).toBe(
    b.domains.components.contentHash,
  );
  expect(a.buildHash).toBe(b.buildHash);
});
it('preserves semantic source directories when normalizing a declared checkout root', () => {
  const input = {
    domain: 'components',
    package: '@dialpad/dialtone-vue',
    version: '4.3.1',
    schemaVersion: 2,
  };
  const a = stampDatasets(
    [
      {
        ...input,
        bytes: Buffer.from(
          JSON.stringify([{ sourceFiles: ['/one/components/A/button.vue'] }]),
        ),
      },
    ],
    { sourceRoot: '/one' },
  );
  const b = stampDatasets(
    [
      {
        ...input,
        bytes: Buffer.from(
          JSON.stringify([{ sourceFiles: ['/two/components/B/button.vue'] }]),
        ),
      },
    ],
    { sourceRoot: '/two' },
  );
  expect(a.domains.components.contentHash).not.toBe(
    b.domains.components.contentHash,
  );
});
