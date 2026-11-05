import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loaderSwap } from './loader-swap.mjs';

// The map each of the three configs used to spell out for itself, kept here as the expected values.
const EXPECTED = { 100: 200, 200: 200, 300: 300, 400: 400, 500: 500 };

test('every Button size maps to the Loader size the configs used to hard-code', () => {
  for (const [size, loader] of Object.entries(EXPECTED)) {
    assert.deepEqual(loaderSwap({ size }), { selector: 'd-loader', component: 'loader', variant: { size: loader } });
    assert.deepEqual(loaderSwap({ size: Number(size) }).variant, { size: loader });
  }
});

test('Button, ButtonIcon and ButtonLink all share the one helper', async () => {
  process.env.SYNC_TARGET = '';
  const { COMPONENTS } = await import('./component-axes.mjs');
  for (const name of ['button', 'button_icon', 'button_link']) {
    assert.equal(COMPONENTS[name].anatomySwap, loaderSwap, name);
  }
});
