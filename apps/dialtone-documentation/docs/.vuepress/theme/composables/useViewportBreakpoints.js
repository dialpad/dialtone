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

/**
 * Tracks viewport width and exposes docs-theme breakpoint helpers.
 *
 * @example
 * ```vue
 * <template>
 *   <DtBox>
 *     <DtBox>
 *       Show this by default
 *     </DtBox>
 *     <DtBox v-if="viewport.above('xs')">
 *       Show this element above xs
 *     </DtBox>
 *     <DtBox v-if="viewport.above('sm')">
 *       Show this element above sm
 *     </DtBox>
 *     <DtBox v-if="viewport.above('md')">
 *       Show this element above md
 *     </DtBox>
 *     <DtBox v-if="viewport.above('lg')">
 *       Show this element above lg
 *     </DtBox>
 *     <DtBox v-if="viewport.above('xl')">
 *       Show this element above xl
 *     </DtBox>
 *     <DtBox v-if="viewport.above('xxl')">
 *       Show this element above xxl
 *     </DtBox>
 *     <DtBox v-if="viewport.above('xxxl')">
 *       Show this element above xxxl
 *     </DtBox>
 *     <DtBox
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
 *     </DtBox>
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
 *   </DtBox>
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
