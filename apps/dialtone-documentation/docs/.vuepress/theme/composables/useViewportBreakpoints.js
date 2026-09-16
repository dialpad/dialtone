import { onMounted, onUnmounted, readonly, ref } from 'vue';
import {
  getViewportBreakpointMediaQuery,
  isAtLeastViewportBreakpointName,
  pickViewportValueByBreakpointName,
  resolveActiveViewportBreakpoint,
  VIEWPORT_BREAKPOINT_NAMES,
  VIEWPORT_BREAKPOINTS,
} from '../utils/viewportBreakpoints.js';

/**
 * @typedef {import('../utils/viewportBreakpoints.js').ViewportBreakpointName} ViewportBreakpointName
 */

/**
 * @typedef {import('../utils/viewportBreakpoints.js').ActiveViewportBreakpointName} ActiveViewportBreakpointName
 */

/**
 * @template T
 * @typedef {import('../utils/viewportBreakpoints.js').ViewportPickValues<T>} ViewportPickValues
 */

/** @type {import('vue').Ref<ActiveViewportBreakpointName>} */
const activeBreakpoint = ref('');
let activeConsumers = 0;

// Shared by every consumer: one MediaQueryList per breakpoint, created on the first
// mount and torn down after the last unmount.
/** @type {Record<ViewportBreakpointName, MediaQueryList> | null} */
let mediaQueryLists = null;

const updateActiveBreakpoint = () => {
  if (!mediaQueryLists) return;

  const nextActiveBreakpoint = resolveActiveViewportBreakpoint(
    (name) => mediaQueryLists[name].matches,
  );

  // Crossing several thresholds in one resize fires one `change` per query; the
  // equality check collapses those into a single reactive write.
  if (nextActiveBreakpoint !== activeBreakpoint.value) {
    activeBreakpoint.value = nextActiveBreakpoint;
  }
};

const startTracking = () => {
  if (activeConsumers === 0) {
    // Each query fires only when its own threshold is crossed, so resizing within a
    // band costs nothing — unlike a `resize` listener, which ran on every frame.
    mediaQueryLists = Object.fromEntries(VIEWPORT_BREAKPOINT_NAMES.map((name) => [
      name,
      window.matchMedia(getViewportBreakpointMediaQuery(name)),
    ]));

    Object.values(mediaQueryLists).forEach((mediaQueryList) => {
      mediaQueryList.addEventListener('change', updateActiveBreakpoint);
    });

    updateActiveBreakpoint();
  }

  activeConsumers += 1;
};

const stopTracking = () => {
  activeConsumers = Math.max(activeConsumers - 1, 0);
  if (activeConsumers > 0) return;

  Object.values(mediaQueryLists ?? {}).forEach((mediaQueryList) => {
    mediaQueryList.removeEventListener('change', updateActiveBreakpoint);
  });

  mediaQueryLists = null;
  activeBreakpoint.value = '';
};

/**
 * Tracks viewport width by active breakpoint band and exposes docs-theme
 * breakpoint helpers.
 *
 * @example
 * ```vue
 * <template>
 *   <dt-box>
 *     <dt-box>
 *       Show this by default
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('xs')">
 *       Show this element at xs or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('sm')">
 *       Show this element at sm or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('md')">
 *       Show this element at md or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('lg')">
 *       Show this element at lg or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('xl')">
 *       Show this element at xl or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('xxl')">
 *       Show this element at xxl or wider
 *     </dt-box>
 *     <dt-box v-if="viewport.atLeast('xxxl')">
 *       Show this element at xxxl or wider
 *     </dt-box>
 *     <dt-box
 *       surface="critical"
 *       :inline-size="viewport.pick({
 *         default: '100p',
 *         xs: '100',
 *         sm: '200',
 *         md: '300',
 *         lg: '400',
 *         xl: '500',
 *         xxl: '600',
 *         xxxl: '700',
 *       })"
 *     >
 *       Change inline-size with viewport.pick().
 *     </dt-box>
 *     <dt-stack
 *       :direction="viewport.pick({
 *         default: 'column',
 *         lg: 'row',
 *       })"
 *       align="baseline"
 *       justify="between"
 *     >
 *       Responsive stack direction
 *     </dt-stack>
 *   </dt-box>
 * </template>
 *
 * <script setup>
 * import { useViewportBreakpoints } from '../composables/useViewportBreakpoints.js';
 *
 * const viewport = useViewportBreakpoints();
 * </script>
 * ```
 */
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
  const atLeast = (name) => {
    return isAtLeastViewportBreakpointName(activeBreakpoint.value, name);
  };

  /**
   * @template T
   * @param {ViewportPickValues<T>} values
   * @returns {T | undefined}
   */
  const pick = (values) => {
    return pickViewportValueByBreakpointName(activeBreakpoint.value, values);
  };

  return {
    activeBreakpoint: readonly(activeBreakpoint),
    breakpoints: VIEWPORT_BREAKPOINTS,
    atLeast,
    pick,
  };
}
