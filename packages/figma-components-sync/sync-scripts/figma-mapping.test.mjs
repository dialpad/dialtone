import { test } from 'node:test';
import assert from 'node:assert/strict';
import { marginFoldable, buildFamilyPage } from './figma-mapping.mjs';

// A margin on an unpainted box can be folded into its own padding; a painted box cannot.
const box = (extra) => ({ marginTop: '4px', marginRight: '0px', marginBottom: '0px', marginLeft: '0px', ...extra });

test('a transparent background in any computed colour format is unpainted, so its margin folds', () => {
  for (const c of ['rgba(0, 0, 0, 0)', 'transparent', 'oklch(0.5 0.1 200 / 0)', 'color(srgb 1 0 0 / 0)']) {
    assert.equal(marginFoldable(box({ backgroundColor: c })), true, c);
  }
});

test('an opaque or translucent background in any format is painted, so its margin does not fold', () => {
  for (const c of ['rgb(0, 0, 0)', 'rgba(0, 0, 0, 0.5)', 'oklch(0.5 0.1 200)', 'oklch(0.5 0.1 200 / 0.3)', 'color(srgb 1 0 0)']) {
    assert.equal(marginFoldable(box({ backgroundColor: c })), false, c);
  }
});

test('a colour that cannot be parsed is treated as painted, the safe side', () => {
  assert.equal(marginFoldable(box({ backgroundColor: 'not-a-colour' })), false);
});

test('a negative margin never folds, and no background folds', () => {
  assert.equal(marginFoldable(box({ marginTop: '-2px', backgroundColor: 'transparent' })), false);
  assert.equal(marginFoldable(box({})), true);
});

test('a set is placed on its family page, a trial merged build on its own, and no family keeps the old page', () => {
  assert.equal(buildFamilyPage({ page: 'ButtonLink', family: 'Buttons' }, false), 'Buttons');
  assert.equal(buildFamilyPage({ page: 'ButtonLink', family: 'Buttons' }, true), 'Buttons Merged');
  assert.equal(buildFamilyPage({ page: 'ButtonLink', family: 'Buttons', merged: true }, true), 'Buttons');
  assert.equal(buildFamilyPage({ page: 'Avatar' }, false), 'Avatar');
});
