import assert from 'node:assert/strict';
import test from 'node:test';

async function loadComponentCombinatorUtils () {
  return await import('./componentCombinator.js');
}

test('gets an exact component combinator name from frontmatter', async () => {
  const { getComponentCombinatorName } = await loadComponentCombinatorUtils();

  assert.equal(typeof getComponentCombinatorName, 'function');
  assert.equal(getComponentCombinatorName({ combinator: 'DtAvatar' }), 'DtAvatar');
  assert.equal(getComponentCombinatorName({ combinator: 'DtTabGroup' }), 'DtTabGroup');
});

test('skips the component combinator when frontmatter omits a valid component name', async () => {
  const { getComponentCombinatorName } = await loadComponentCombinatorUtils();

  assert.equal(getComponentCombinatorName({}), null);
  assert.equal(getComponentCombinatorName({ combinator: false }), null);
  assert.equal(getComponentCombinatorName({ combinator: true }), null);
  assert.equal(getComponentCombinatorName({ combinator: 'Avatar' }), null);
  assert.equal(getComponentCombinatorName({ combinator: 'dt-avatar' }), null);
});

test('uses lowercase hyphenated preset slugs while preserving readable names', async () => {
  const { getCombinatorPresetSlug, getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const variants = { default: {}, image: {}, 'with presence, no icon': {}, defaults: {}, exclusions: [] };

  assert.equal(getCombinatorPresetSlug('with presence, no icon'), 'with-presence-no-icon');
  assert.equal(getCombinatorPresetSlug('  Icon Avatar  '), 'icon-avatar');
  assert.equal(getCombinatorPresetSlug('Crème brûlée'), 'creme-brulee');
  assert.equal(getCombinatorPresetName(variants, 'image'), 'image');
  assert.equal(getCombinatorPresetName(variants, 'with-presence-no-icon'), 'with presence, no icon');
  assert.equal(getCombinatorPresetName(variants, 'With-Presence-No-Icon'), 'with presence, no icon');
});

test('maps preset names to clean slugs while excluding bank metadata', async () => {
  const { getCombinatorPresetSlugs, getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const variants = { default: {}, 'Crème brûlée': {}, defaults: {}, exclusions: [] };
  assert.deepEqual(getCombinatorPresetSlugs(variants), { default: 'default', 'Crème brûlée': 'creme-brulee' });
  assert.equal(getCombinatorPresetName(variants, 'CREME-BRULEE'), 'Crème brûlée');
});

test('falls back to default for missing, unknown, reserved, or repeated preset queries', async () => {
  const { getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const variants = { default: {}, image: {}, defaults: {}, exclusions: [] };

  for (const query of [undefined, null, '', 'unknown', 'defaults', 'exclusions', ['image', 'default']]) {
    assert.equal(getCombinatorPresetName(variants, query), 'default');
  }
});
