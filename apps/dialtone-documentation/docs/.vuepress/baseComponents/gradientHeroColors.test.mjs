import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { createDotColorLoop, createDotColorSampler } from './gradientHeroColors.js';

// Representative stops. The sampler is palette-agnostic, so these are fixed inputs for
// the loop maths rather than a mirror of whatever the hero currently declares.
const STOPS = ['#b9a3ff', '#ff89d0', '#ff8e9a', '#ffc56f'];

const toHex = (channels) => `#${channels
  .slice(0, 3)
  .map(value => Math.round(value * 255).toString(16).padStart(2, '0'))
  .join('')}`;

describe('createDotColorSampler', () => {
  it('returns a constant for a single stop', () => {
    const sample = createDotColorSampler(['#ff0000']);

    assert.equal(toHex(sample(0)), '#ff0000');
    assert.equal(toHex(sample(0.7)), '#ff0000');
    assert.equal(toHex(sample(12.34)), '#ff0000');
  });

  it('falls back to a usable colour for an empty palette', () => {
    const sample = createDotColorSampler([]);

    assert.match(toHex(sample(0)), /^#[0-9a-f]{6}$/);
  });

  it('lands each stop on its own phase', () => {
    const sample = createDotColorSampler(STOPS);

    STOPS.forEach((stop, index) => {
      assert.equal(toHex(sample(index / STOPS.length)), stop);
    });
  });

  it('closes the loop, so a whole phase returns to the first stop', () => {
    const sample = createDotColorSampler(STOPS);

    assert.equal(toHex(sample(1)), STOPS[0]);
    assert.equal(toHex(sample(3)), STOPS[0]);
  });

  it('wraps negative phase', () => {
    const sample = createDotColorSampler(STOPS);

    // A quarter turn back from the start is the last stop.
    assert.equal(toHex(sample(-0.25)), STOPS[3]);
  });

  it('keeps mid-leg colours saturated by interpolating in OKLCH', () => {
    const sample = createDotColorSampler(['#b9a3ff', '#ff89d0']);
    const [r, g, b] = sample(0.25); // eased midpoint of a two-stop loop

    // The sRGB midpoint of these two is around #dc96e7. OKLCH keeps more chroma, which
    // shows up as a wider spread between the channel extremes.
    const spread = Math.max(r, g, b) - Math.min(r, g, b);
    assert.ok(spread > 0.25, `expected a saturated midpoint, got spread ${spread}`);
  });

  it('emits channels clamped to 0-1 with opaque alpha', () => {
    const sample = createDotColorSampler(STOPS);

    for (let step = 0; step <= 20; step += 1) {
      const channels = sample(step / 20);

      assert.equal(channels.length, 4);
      assert.equal(channels[3], 1);
      channels.slice(0, 3).forEach((value) => {
        assert.ok(value >= 0 && value <= 1, `channel out of range: ${value}`);
      });
    }
  });
});

describe('createDotColorLoop', () => {
  it('reports a single-stop palette as not animated', () => {
    const loop = createDotColorLoop({ periodMs: 1000, onColor: () => {} });
    loop.setPalette(['#ff0000']);

    assert.equal(loop.isAnimated(), false);
    assert.equal(toHex(loop.current()), '#ff0000');
  });

  it('reports a multi-stop palette as animated', () => {
    const loop = createDotColorLoop({ periodMs: 1000, onColor: () => {} });
    loop.setPalette(STOPS);

    assert.equal(loop.isAnimated(), true);
  });

  it('has no colour before a palette is set', () => {
    const loop = createDotColorLoop({ periodMs: 1000, onColor: () => {} });

    assert.equal(loop.current(), null);
  });

  it('starts at the first stop and stays there while parked', () => {
    const loop = createDotColorLoop({ periodMs: 1000, onColor: () => {} });
    loop.setPalette(STOPS);

    assert.equal(toHex(loop.current()), STOPS[0]);
    loop.stop(); // parking must not advance phase
    assert.equal(toHex(loop.current()), STOPS[0]);
  });

  it('drops its sampler on dispose', () => {
    const loop = createDotColorLoop({ periodMs: 1000, onColor: () => {} });
    loop.setPalette(STOPS);
    loop.dispose();

    assert.equal(loop.current(), null);
    assert.equal(loop.isAnimated(), false);
  });
});
