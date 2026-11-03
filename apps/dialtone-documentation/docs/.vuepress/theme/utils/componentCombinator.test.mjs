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
  assert.equal(getCombinatorPresetName(variants, 'image'), 'image');
  assert.equal(getCombinatorPresetName(variants, 'with-presence-no-icon'), 'with presence, no icon');
  assert.equal(getCombinatorPresetName(variants, 'With-Presence-No-Icon'), 'with presence, no icon');
});

test('gives empty and colliding slugs unique deterministic links that round-trip', async () => {
  const { getCombinatorPresetSlugs, getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const variants = { default: {}, '!!!': {}, '你好': {}, 'same name': {}, 'same-name': {}, '': {} };
  const slugs = getCombinatorPresetSlugs(variants);
  assert.equal(new Set(Object.values(slugs)).size, Object.keys(variants).length);
  assert.ok(Object.values(slugs).every(Boolean));
  for (const [name, slug] of Object.entries(slugs)) assert.equal(getCombinatorPresetName(variants, slug), name);
  assert.deepEqual(getCombinatorPresetSlugs(variants), slugs);
});

test('keeps existing clean links when colliding preset names are appended', async () => {
  const { getCombinatorPresetSlugs, getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const original = { default: {}, 'same name': {} };
  const expanded = { ...original, 'same-name': {} };
  assert.equal(getCombinatorPresetSlugs(original)['same name'], 'same-name');
  const slugs = getCombinatorPresetSlugs(expanded);
  assert.equal(slugs['same name'], 'same-name');
  assert.equal(getCombinatorPresetName(expanded, 'same-name'), 'same name');
  assert.equal(getCombinatorPresetName(expanded, slugs['same-name']), 'same-name');
  assert.ok(slugs['same-name'].length < 25);
});

test('falls back to default for missing, unknown, reserved, or repeated preset queries', async () => {
  const { getCombinatorPresetName } = await loadComponentCombinatorUtils();
  const variants = { default: {}, image: {}, defaults: {}, exclusions: [] };

  for (const query of [undefined, null, '', 'unknown', 'defaults', 'exclusions', ['image', 'default']]) {
    assert.equal(getCombinatorPresetName(variants, query), 'default');
  }
});
