import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { advanceScrollPosition } from './showcaseCarouselMotion.js';

const VELOCITY = 0.035; // px/ms, the homepage carousel speed
const DURATION_MS = 10000;

// Safari stores scrollLeft as a whole number of pixels.
const truncatingScroller = () => {
  let value = 0;
  return {
    get scrollLeft () { return value; },
    set scrollLeft (next) { value = Math.trunc(next); },
  };
};

// Runs the carousel loop for DURATION_MS at the given refresh rate, with no looping
// (period 0), and returns how far the rendered scrollLeft moved.
const simulate = (refreshRate, step) => {
  const scroller = truncatingScroller();
  const frameMs = 1000 / refreshRate;
  let position = 0;

  for (let elapsed = 0; elapsed < DURATION_MS; elapsed += frameMs) {
    position = step(position, scroller, VELOCITY * frameMs);
  }

  return scroller.scrollLeft;
};

const floatStep = (position, scroller, distance) => {
  const next = advanceScrollPosition(position, scroller.scrollLeft, distance, 0, Infinity);
  scroller.scrollLeft = next;
  return next;
};

// The previous approach: read scrollLeft back each frame and add to it.
const readBackStep = (position, scroller, distance) => {
  scroller.scrollLeft = scroller.scrollLeft + distance;
  return scroller.scrollLeft;
};

describe('advanceScrollPosition', () => {
  const expected = VELOCITY * DURATION_MS; // 350px

  for (const refreshRate of [60, 120]) {
    it(`keeps sub-pixel progress when scrollLeft truncates at ${refreshRate}Hz`, () => {
      const moved = simulate(refreshRate, floatStep);

      assert.ok(Math.abs(moved - expected) <= 1, `moved ${moved}px, expected ~${expected}px`);
    });

    it(`shows the read-back approach stalls at ${refreshRate}Hz`, () => {
      assert.equal(simulate(refreshRate, readBackStep), 0);
    });
  }

  it('ignores sub-pixel rounding differences', () => {
    assert.equal(advanceScrollPosition(100.6, 100, 0.5, 0, Infinity), 101.1);
  });

  it('resyncs to scrollLeft after an outside scroll', () => {
    assert.equal(advanceScrollPosition(100.6, 400, 0.5, 0, Infinity), 400.5);
  });

  it('wraps into the looped range', () => {
    // period 1000, max 2500: past max - period / 2 wraps back by one period.
    assert.equal(advanceScrollPosition(2100, 2100, 5, 1000, 2500), 1105);
  });
});
