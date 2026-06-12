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
