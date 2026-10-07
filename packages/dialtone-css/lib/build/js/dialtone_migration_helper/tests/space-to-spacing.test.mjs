import { test } from 'node:test';
import assert from 'node:assert/strict';
import config from '../configs/space-to-spacing.mjs';
import { applyConfig } from './helpers.mjs';

test('space-to-spacing preserves the 8px stop and its negative variant', () => {
  assert.equal(applyConfig(config, 'margin: var(--dt-space-400-negative); padding: var(--dt-space-400);'), 'margin: var(--dt-spacing-100-negative); padding: var(--dt-spacing-100);');
});
test('subpixel, percent and out-of-scale spacing require review', () => {
  const input = 'gap: var(--dt-space-50) var(--dt-space-720) var(--dt-space-50-percent);';
  assert.equal(applyConfig(config, input), input);
});
