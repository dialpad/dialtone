import { nextTick } from 'vue';
import { vi } from 'vitest';
import { settleCombinatorInitialization } from './combinatorSmokeTestUtils.js';

beforeEach(() => vi.useFakeTimers({ loopLimit: 1000 }));
afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

it('drains nested Vue, promise and delayed timer work without sleeping', async () => {
  const completed = vi.fn();
  nextTick(() => Promise.resolve().then(() => {
    setTimeout(() => {
      Promise.resolve().then(() => setTimeout(completed, 5000));
    }, 5000);
  }));
  await settleCombinatorInitialization('Fixture: final preset');
  expect(completed).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});

it('rejects unbounded periodic work with the owning preset in the failure', async () => {
  setInterval(() => {}, 10);
  await expect(settleCombinatorInitialization('Fixture: final preset'))
    .rejects.toThrow('Fixture: final preset: initialization did not settle after 20 timer batches (1 pending).');
});

it('allows intentional background work to be paused before draining initialization', async () => {
  const interval = setInterval(() => {}, 10);
  const pause = vi.fn(() => clearInterval(interval));
  const initialized = vi.fn();
  setTimeout(initialized, 5000);
  await settleCombinatorInitialization('Fixture: loop', pause);
  expect(pause).toHaveBeenCalled();
  expect(initialized).toHaveBeenCalledTimes(1);
  expect(vi.getTimerCount()).toBe(0);
});
