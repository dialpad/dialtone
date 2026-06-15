import { computed, onMounted, onUnmounted, readonly, ref } from 'vue';
import {
  isAboveViewportBreakpoint,
  pickViewportValue,
  VIEWPORT_BREAKPOINTS,
} from '../utils/viewportBreakpoints.js';

/**
 * @typedef {import('../utils/viewportBreakpoints.js').ViewportBreakpointName} ViewportBreakpointName
 */

/**
 * @template T
 * @typedef {import('../utils/viewportBreakpoints.js').ViewportPickValues<T>} ViewportPickValues
 */

const width = ref(0);
let activeConsumers = 0;

const updateWidth = () => {
  width.value = window.innerWidth;
};

const startTracking = () => {
  if (activeConsumers === 0) {
    updateWidth();
    window.addEventListener('resize', updateWidth, { passive: true });
  }

  activeConsumers += 1;
};

const stopTracking = () => {
  activeConsumers = Math.max(activeConsumers - 1, 0);
  if (activeConsumers > 0) return;

  window.removeEventListener('resize', updateWidth);
  width.value = 0;
};

export function useViewportBreakpoints () {
  onMounted(() => {
    startTracking();
  });

  onUnmounted(() => {
    stopTracking();
  });

  /**
   * @param {ViewportBreakpointName} name
   * @returns {boolean}
   */
  const above = (name) => {
    return isAboveViewportBreakpoint(width.value, name);
  };

  /**
   * @template T
   * @param {ViewportPickValues<T>} values
   * @returns {T | undefined}
   */
  const pick = (values) => {
    return pickViewportValue(width.value, values);
  };

  return {
    width: readonly(width),
    breakpoints: VIEWPORT_BREAKPOINTS,
    active: computed(() => {
      return Object.fromEntries(
        Object.keys(VIEWPORT_BREAKPOINTS).map(name => [name, above(name)]),
      );
    }),
    above,
    pick,
  };
}
