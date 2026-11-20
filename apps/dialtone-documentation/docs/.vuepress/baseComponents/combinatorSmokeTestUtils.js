import { flushPromises } from '@vue/test-utils';
import { nextTick } from 'vue';
import { vi } from 'vitest';

const MAX_INITIALIZATION_BATCHES = 20;

/**
 * Drain finite initialization work under the caller's fake clock, without a wall-clock sleep.
 * The optional callback pauses intentional background work before checking for quiescence.
 * @param {string} context - Component and preset label for a failure.
 * @param {() => void} pauseBackgroundWork - Synchronous fixture hook for recurring work.
 */
export async function settleCombinatorInitialization (context, pauseBackgroundWork = () => {}) {
  for (let batch = 0; batch <= MAX_INITIALIZATION_BATCHES; batch++) {
    await nextTick();
    await flushPromises();
    pauseBackgroundWork();
    await nextTick();
    await flushPromises();
    const pending = vi.getTimerCount();
    if (!pending) return;
    if (batch === MAX_INITIALIZATION_BATCHES) {
      throw new Error(`${context}: initialization did not settle after ${batch} timer batches (${pending} pending).`);
    }
    await vi.runOnlyPendingTimersAsync();
  }
}
