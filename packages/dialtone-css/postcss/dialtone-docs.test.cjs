const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
// Use the token builder's declared PostCSS dependency; this is a build-pipeline test.
const postcss = require('node:module').createRequire(path.resolve(__dirname, '../../dialtone-tokens/package.json'))('postcss');
const plugin = require('./dialtone-docs.cjs');

async function generateDocumentation (source) {
  // Capture the generator's actual output boundary; leave fresh build data intact.
  const outputs = {};
  const writeFile = fs.promises.writeFile;
  fs.promises.writeFile = async (file, value) => { outputs[path.basename(file)] = JSON.parse(value); };
  try {
    await postcss([plugin()]).process(source, { from: undefined });
  } finally {
    fs.promises.writeFile = writeFile;
  }
  return outputs;
}

test('generated metadata carries safe legacy migrations and source token deprecation', async () => {
  const outputs = await generateDocumentation(`
      .d-p8, .d-p-100 { padding: var(--dt-spacing-100) !important; }
      .d-bar6, .d-bar-350 { border-radius: var(--dt-size-radius-350) !important; }
      .d-bar-pill, .d-btr-pill { border-radius: var(--dt-size-radius-pill) !important; }
      .d-bar-circle, .d-btr-circle { border-radius: var(--dt-size-radius-circle) !important; }
      .d-flg8 > * { --fl-gap: var(--dt-spacing-100) !important; }
      ${fs.readFileSync(path.resolve(__dirname, '../lib/build/less/utilities/flex.less'), 'utf8').match(/\.d-flg2 > \* \{[^}]+\}/)[0]}
      .d-g8 > *, .d-cg8 > * { --fl-gap: var(--dt-spacing-100); margin: unset; }
      .d-pt96 { padding-block-start: 6rem !important; }
    `);
  const utilities = outputs['dialtone-docs.json'];
  for (const [legacy, current] of [['d-p8', 'd-p-100'], ['d-bar6', 'd-bar-350'], ['d-flg8', 'd-g-100']]) {
    assert.deepEqual(utilities[legacy]?.metadata?.alternatives, [current]);
    assert.equal(utilities[legacy]?.metadata?.deprecated, true);
  }
  assert.equal(utilities['d-p-100'].metadata, undefined);
  for (const keyword of ['pill', 'circle']) {
    assert.equal(utilities[`d-bar-${keyword}`].metadata, undefined);
    assert.deepEqual(utilities[`d-btr-${keyword}`].metadata.alternatives, [`d-bbsr-${keyword}`]);
  }
  assert.deepEqual(utilities['d-pt96']?.metadata?.alternatives, []);
  assert.match(utilities['d-flg8'].metadata.reason, /manual layout review/);
  assert.equal(utilities['d-flg2'].values[0].value, 'var(--dt-spacing-1) !important');
  assert.equal(utilities['d-flg2'].values[0].description, '0.1rem');
  assert.deepEqual(utilities['d-flg2'].metadata.alternatives, []);
  assert.match(utilities['d-flg2'].metadata.reason, /1px.*manual.*review/i);
  for (const name of ['d-g8', 'd-cg8']) {
    assert.match(utilities[name].metadata.reason, /child margins.*manual layout review/);
  }
  const tokens = outputs['tokens-docs.json'];
  assert.equal(tokens['--dt-space-400']['base-light'].value, '0.8rem');
  assert.equal(tokens['--dt-spacing-100']['base-light'].value, '8px');
  assert.equal(tokens['--dt-space-400-negative']['base-light'].value, '-0.8rem');
  assert.equal(tokens['--dt-spacing-100-negative']['base-light'].value, '-8px');
  assert.deepEqual(tokens['--dt-space-400']?.metadata?.alternatives, ['--dt-spacing-100']);
  assert.deepEqual(tokens['--dt-space-400-negative']?.metadata?.alternatives, ['--dt-spacing-100-negative']);
  assert.deepEqual(tokens['--dt-space-50-percent']?.metadata?.alternatives, []);
  assert.match(tokens['--dt-space-50-percent'].metadata.reason, /manual review/);
  for (const [name, target] of [['--dt-size-825', '--dt-layout-250'], ['--dt-size-1115', '71.25rem']]) {
    assert.equal(tokens[name].metadata.deprecated, true);
    assert.deepEqual(tokens[name].metadata.alternatives, []);
    assert.ok(tokens[name].metadata.reason.includes(target));
  }
  assert.equal(tokens['--dt-color-foreground-success']?.metadata?.deprecated, true);
  assert.match(tokens['--dt-color-foreground-success'].metadata.reason, /positive/);
});

test('catalogs the public utility after a non-public selector with all source declarations', async () => {
  const layout = fs.readFileSync(path.resolve(__dirname, '../lib/build/less/utilities/layout.less'), 'utf8');
  const source = layout.match(/\.sr-only,\s*\.d-vi-visible-sr\s*\{[^}]+\}/)[0];
  const expectedValues = postcss.parse(source).first.nodes.map(node => ({ prop: node.prop, value: node.value }));
  const outputs = await generateDocumentation(source);
  const utilities = outputs['dialtone-docs.json'];
  assert.deepEqual(utilities['d-vi-visible-sr']?.values.map(({ prop, value }) => ({ prop, value })), expectedValues);
  assert.equal(utilities['sr-only'], undefined);
});

test('preserves grouped component exclusions and filters non-public and state selectors', async () => {
  const outputs = await generateDocumentation(`
      .d-d-block, .unprefixed { display: block !important; }
      .d-input, .d-textarea { appearance: none; }
      .sm\\:d-d-inline, .d-fc-primary:hover, .d-d-inline { display: inline !important; }
    `);
  const utilities = outputs['dialtone-docs.json'];
  assert.deepEqual(utilities['d-d-block']?.values, [{ prop: 'display', value: 'block !important' }]);
  assert.deepEqual(utilities['d-d-inline']?.values, [{ prop: 'display', value: 'inline !important' }]);
  for (const name of ['d-input', 'd-textarea', 'unprefixed', 'sm\\:d-d-inline', 'd-fc-primary:hover']) {
    assert.equal(utilities[name], undefined);
  }
});
