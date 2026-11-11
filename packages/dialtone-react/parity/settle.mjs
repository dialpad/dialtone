// Settling, identical on both sides of DOM parity: fake timers including requestAnimationFrame and a
// fixed clock; advance 10s, finish CSS transitions, advance again.
/* global document */
export const FAKE_TIMERS = {
  now: new Date('2026-01-01T00:00:00Z'),
  toFake: ['setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'Date', 'requestAnimationFrame', 'cancelAnimationFrame'],
};
export const SETTLE_MS = 10_000;
// What Math.random returns during every case, so components that pick at random (avatar colours) pick the same
// on both sides and on every run. A constant rather than a seeded sequence: React's StrictMode renders twice,
// so the two sides call Math.random a different number of times. A constant can't tell a port that hardcodes the
// result, so the goldens note when the Vue component called Math.random and the React case fails if its port never
// did (dom.test.tsx).
export const FIXED_RANDOM = 0.5;

/**
 * jsdom never fires transitionend, and libraries such as tippy wait for it rather than a timer. Fire it on every
 * element with a non-zero inline transition-duration, so the settled DOM is one a browser would reach.
 * @param {(ms: number) => Promise<unknown>} advance advances the fake clock (wrapped in act() on the React side)
 */
export async function settle (advance) {
  await advance(SETTLE_MS);
  for (const el of document.body.querySelectorAll('*')) {
    if (parseFloat(el.style?.transitionDuration || '0') > 0) el.dispatchEvent(new Event('transitionend', { bubbles: true }));
  }
  await advance(SETTLE_MS);
}
