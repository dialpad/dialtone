import { computed, onBeforeUnmount, ref } from 'vue';

/**
 * Composable for managing expandable container behavior with max-height constraints.
 * Provides expand/collapse state management and ResizeObserver-based content measurement.
 * Designed for documentation components that need to clamp content height.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.maxHeightClass - CSS utility class for max-height (e.g., 'd-hmx332')
 * @param {number} options.heightFudge - Pixels to subtract from threshold for better UX (default: 8)
 * @param {number} options.debounceMs - Debounce delay for resize events (default: 100)
 * @returns {Object} Expandable state and methods
 */
export function useDocExpandable({
  maxHeightClass = 'd-hmx464',
  heightFudge = 8,
  debounceMs = 100,
} = {}) {
  // Constants
  const DEFAULT_MAX_HEIGHT = 464;

  // State
  const isExpanded = ref(false);
  const isExpandable = ref(false);
  const timers = {
    debounceResize: null,
    debounceWindow: null,
  };

  const observers = {
    resize: null,
  };

  /**
   * Parse the numeric value from the provided max-height utility class.
   * @returns {number} Parsed height in pixels
   */
  const resolvedMaxHeight = computed(() => {
    const match = maxHeightClass.match(/d-hmx(\d+)/);

    if (!match) {
      return DEFAULT_MAX_HEIGHT;
    }

    const [, heightString] = match;
    const parsedHeight = Number.parseInt(heightString, 10);

    return Number.isNaN(parsedHeight) ? DEFAULT_MAX_HEIGHT : parsedHeight;
  });

  /**
   * Calculate the threshold for determining if content is expandable.
   * Subtracts fudge factor for better UX.
   */
  const expandThreshold = computed(() => Math.max(resolvedMaxHeight.value - heightFudge, 0));

  /**
   * Computed property to determine if the expand button should be shown.
   */
  const shouldShowButton = computed(() => !isExpanded.value && isExpandable.value);

  /**
   * Determine whether the content exceeds the max-height threshold.
   * @param {HTMLElement} element - The container element to measure
   */
  const updateExpandable = (element) => {
    if (!element) {
      isExpandable.value = false;
      return;
    }

    const scrollHeight = element.scrollHeight ?? 0;
    isExpandable.value = scrollHeight > expandThreshold.value;
  };

  /**
   * Handle window resize events with debouncing.
   * @param {HTMLElement} element - The container element to measure
   */
  const handleResize = (element) => {
    clearTimeout(timers.debounceWindow);
    timers.debounceWindow = setTimeout(() => {
      updateExpandable(element);
    }, debounceMs);
  };

  /**
   * Initialize ResizeObserver for the given element.
   * @param {HTMLElement} element - The container element to observe
   */
  const initExpandable = (element) => {
    if (!element) {
      return;
    }

    // Initial measurement
    updateExpandable(element);

    // Set up window resize listener
    const resizeHandler = () => handleResize(element);
    window.addEventListener('resize', resizeHandler, { passive: true });

    // Store the handler for cleanup
    timers.resizeHandler = resizeHandler;

    // Set up ResizeObserver if available
    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    observers.resize = new ResizeObserver(() => {
      clearTimeout(timers.debounceResize);
      timers.debounceResize = setTimeout(() => {
        updateExpandable(element);
      }, debounceMs);
    });

    observers.resize.observe(element);
  };

  /**
   * Expand the container by setting isExpanded to true.
   * The component using this composable should handle class removal.
   */
  const handleExpand = () => {
    isExpanded.value = true;
  };

  /**
   * Clean up observers and timers.
   * Should be called in onBeforeUnmount.
   */
  const cleanup = () => {
    // Remove window resize listener
    if (timers.resizeHandler) {
      window.removeEventListener('resize', timers.resizeHandler);
    }

    // Clear all timers
    clearTimeout(timers.debounceResize);
    clearTimeout(timers.debounceWindow);

    // Disconnect and clean up ResizeObserver
    if (observers.resize) {
      observers.resize.disconnect();
      observers.resize = null;
    }
  };

  // Auto-cleanup on unmount
  onBeforeUnmount(() => {
    cleanup();
  });

  return {
    // State
    isExpanded,
    isExpandable,

    // Computed
    shouldShowButton,
    expandThreshold,
    resolvedMaxHeight,

    // Methods
    handleExpand,
    updateExpandable,
    initExpandable,
    cleanup,
  };
}
