/**
 * Runs a callback at most once per animation frame, however many times it is asked to.
 *
 * The theme hand-rolls this shape in several places — a `frame` handle, a "bail if already
 * scheduled" guard, and a cancel-and-reset on teardown. Each copy is a chance to leak a
 * frame on unmount or to double-schedule. This is the same three lines, once, testable.
 *
 * @module theme/utils/frameCoalescer
 */

/**
 * @param {() => void} callback Invoked on the next frame after one or more `schedule` calls.
 * @param {object} [options]
 * @param {(cb: FrameRequestCallback) => number} [options.request] Override for testing.
 * @param {(handle: number) => void} [options.cancel] Override for testing.
 * @returns {{ schedule: () => void, cancel: () => void, isScheduled: () => boolean }}
 */
export function createFrameCoalescer (callback, options = {}) {
  const request = options.request
    ?? (typeof requestAnimationFrame === 'function' ? requestAnimationFrame : null);
  const cancelFrame = options.cancel
    ?? (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame : null);

  // Frame handles are truthy in browsers, but 0 is a legal handle under a stub, so track
  // scheduling separately rather than inferring it from the handle.
  let handle = null;
  let scheduled = false;

  const run = () => {
    scheduled = false;
    handle = null;
    callback();
  };

  return {
    schedule () {
      if (scheduled) return;

      // No rAF (SSR, or a stub that omits it): run straight away rather than dropping the
      // work. Callers here are all client-side, so this is a guard, not a code path.
      if (!request) {
        callback();

        return;
      }

      scheduled = true;
      handle = request(run);
    },

    cancel () {
      if (!scheduled) return;

      scheduled = false;
      if (handle !== null) cancelFrame?.(handle);
      handle = null;
    },

    isScheduled () {
      return scheduled;
    },
  };
}
