import { onMounted, onUnmounted, readonly, ref } from 'vue';
import {
  getActiveViewportBreakpoint,
  isAboveViewportBreakpointName,
  pickViewportValueByBreakpointName,
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

const updateActiveBreakpoint = () => {
  const nextActiveBreakpoint = getActiveViewportBreakpoint(window.innerWidth);

  if (nextActiveBreakpoint !== activeBreakpoint.value) {
    activeBreakpoint.value = nextActiveBreakpoint;
  }
};

const startTracking = () => {
  if (activeConsumers === 0) {
    updateActiveBreakpoint();
    window.addEventListener('resize', updateActiveBreakpoint, { passive: true });
  }

  activeConsumers += 1;
};

const stopTracking = () => {
  activeConsumers = Math.max(activeConsumers - 1, 0);
  if (activeConsumers > 0) return;

  window.removeEventListener('resize', updateActiveBreakpoint);
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
 *     <dt-box v-if="viewport.above('xs')">
 *       Show this element above xs
 *     </dt-box>
 *     <dt-box v-if="viewport.above('sm')">
 *       Show this element above sm
 *     </dt-box>
 *     <dt-box v-if="viewport.above('md')">
 *       Show this element above md
 *     </dt-box>
 *     <dt-box v-if="viewport.above('lg')">
 *       Show this element above lg
 *     </dt-box>
 *     <dt-box v-if="viewport.above('xl')">
 *       Show this element above xl
 *     </dt-box>
 *     <dt-box v-if="viewport.above('xxl')">
 *       Show this element above xxl
 *     </dt-box>
 *     <dt-box v-if="viewport.above('xxxl')">
 *       Show this element above xxxl
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
  const above = (name) => {
    return isAboveViewportBreakpointName(activeBreakpoint.value, name);
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
    above,
    pick,
  };
}
