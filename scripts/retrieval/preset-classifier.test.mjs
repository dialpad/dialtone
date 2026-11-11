import assert from 'node:assert/strict';
import test from 'node:test';
import { classifyPresetExample } from '../../packages/combinator/scripts/classify-preset-example.mjs';

const metadata = [{ displayName: 'DtButton', props: [
  { name: 'kind', tags: { deprecated: true } }, { name: 'size', values: ['100', '200'] },
], slots: [{ name: 'default' }], events: [] }];
function classify(materialize, extra = {}) {
  return classifyPresetExample({ component: 'DtButton', documentation: metadata,
    publicNames: new Set(['DtButton']), runtime: { DtButton: {} },
    icons: { DtIconPhone: { props: { size: {} } } }, policyReason: '', materialize, ...extra });
}

test('source classification delivers checked Vue and generated icon imports', () => {
  const result = classify(() => '<dt-button size="100"><dt-icon-phone size="200" /></dt-button>');
  assert.equal(result.disposition, 'eligible/setup-needed');
  assert.deepEqual(result.imports, ['DtButton', 'DtIconPhone']);
  assert.deepEqual(result.reasons, []);
});

test('deprecated prop use is explicitly deprecated rather than a materialization failure', () => {
  const result = classify(() => '<dt-button kind="primary">Label</dt-button>');
  assert.equal(result.disposition, 'deprecated');
  assert.match(result.reasons[0], /^API deprecated: DtButton\.kind/);
  const mixed = classify(() => '<dt-button unknown-prop><dt-icon /></dt-button>', {
    documentation: [...metadata, { displayName: 'DtIcon', tags: { deprecated: true }, props: [], slots: [], events: [] }],
    publicNames: new Set(['DtButton', 'DtIcon']),
  });
  assert.equal(mixed.disposition, 'deprecated');
  assert.match(mixed.reasons[0], /^API deprecated: DtIcon/);

});

test('API member and value failures retain their category separately from materialization', () => {
  for (const [template, code] of [
    ['<dt-button unknown-prop />', 'unknown-member'],
    ['<dt-button size="999" />', 'invalid-value'],
  ]) {
    const result = classify(() => template);
    assert.equal(result.disposition, 'unresolved');
    assert.ok(result.reasons[0].startsWith(`API ${code}:`), result.reasons[0]);
  }
  const broken = classify(() => { throw new Error('Cannot serialize source'); });
  assert.equal(broken.disposition, 'unresolved');
  assert.match(broken.reasons[0], /^Materialization unavailable: Cannot serialize source$/);
});

test('policy exclusion cannot enter materialization or delivery', () => {
  const result = classify(() => { throw new Error('Excluded source was materialized'); },
    { policyReason: 'Interactive runtime excluded' });
  assert.equal(result.disposition, 'policy-excluded');
  assert.equal(result.template, undefined);
});

test('source classification admits a documented native attribute', () => {
  const input = { displayName: 'DtInput', props: [], slots: [], events: [],
    tags: { property: [{ name: 'placeholder', description: 'attribute' }] } };
  const result = classify(() => '<dt-input placeholder="Placeholder" />', {
    component: 'DtInput', documentation: [input],
    publicNames: new Set(['DtInput']), runtime: { DtInput: {} },
  });
  assert.equal(result.disposition, 'eligible/setup-needed');
});

test('an owned preset exclusion prevents materialization for an incompatible consumer profile', () => {
  const result = classify(() => { throw new Error('Excluded source was materialized'); }, {
    exclusion: { reason: 'Pinned package lacks this API', owner: 'DLT-3738' },
  });
  assert.equal(result.disposition, 'policy-excluded');
  assert.match(result.reasons[0], /Pinned package lacks this API.*DLT-3738/);
  assert.equal(result.template, undefined);
});

test('preset exclusions require a nonempty reason and owner', () => {
  for (const exclusion of [{ reason: 'Incompatible' }, { reason: '', owner: 'DLT-3738' }]) {
    assert.throws(() => classify(() => '<dt-button />', { exclusion }), /reason and owner/);
  }
});
