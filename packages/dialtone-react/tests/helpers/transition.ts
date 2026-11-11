import { act } from '@testing-library/react';

// Fake timers (@sinonjs/fake-timers, under vi.useFakeTimers) mark the functions they replace with `clock`.
const isFaked = (fn: unknown) => typeof fn === 'function' && 'clock' in fn;
const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Lets every running DtTransition enter and leave finish, and React apply the result, with real or fake timers.
 * jsdom computes no transition durations, so DtTransition ends two animation frames after it starts, as Vue's
 * <Transition> does; pass `ms` for one with an explicit `duration`. Vue Test Utils stubs <transition>, so Vue tests
 * see the end state at once: call this where the Vue test expects it.
 */
export async function finishTransitions (ms = 0) {
  await act(async () => {
    if (isFaked(requestAnimationFrame)) vi.advanceTimersByTime(32);
    else {
      await frame();
      await frame();
    }
    if (ms <= 0) return;
    if (isFaked(setTimeout)) vi.advanceTimersByTime(ms + 1);
    else await sleep(ms + 1);
  });
}
