/**
 * Offset positioning composable for resize handles.
 *
 * Calculates dynamic offsets from DOM elements (e.g. a fixed header/toolbar)
 * so handles and panel content can avoid overlapping external UI.
 */

import {
  ref,
  computed,
  onMounted,
  onUnmounted,
  type Ref,
  type ComputedRef,
} from 'vue';
import { useDOMCache } from '../../../common/composables/useDOMCache';

// ─── Types ────────────────────────────────────────────────────────────────

export interface ResizableOffsetOptions {
  /** CSS selector for the element to measure offset from */
  offsetElement?: string;
  /** Additional pixels added to the measured offset (default: 0) */
  offsetAmount?: number;
  /** Which edge(s) the offset applies to (default: 'both') */
  offsetDirection?: 'start' | 'end' | 'both';
  /** Layout direction — affects which dimension is measured */
  direction?: ComputedRef<'row' | 'column'> | Ref<'row' | 'column'>;
}

export interface ResizableOffsetResult {
  calculatedOffset: Ref<number>;
  updateOffset: () => void;
  handleStyles: ComputedRef<Record<string, string>>;
  contentStyles: ComputedRef<Record<string, string>>;
}

// ─── Composable ───────────────────────────────────────────────────────────

export function useResizableOffset(
  options: ResizableOffsetOptions = {},
): ResizableOffsetResult {
  const {
    offsetElement,
    offsetAmount = 0,
    offsetDirection = 'both',
    direction = ref('row'),
  } = options;

  const calculatedOffset = ref(0);
  const { querySelector } = useDOMCache({ maxAge: 2000 });

  function updateOffset(): void {
    if (!offsetElement) { calculatedOffset.value = 0; return; }

    try {
      const element = querySelector(offsetElement);
      if (!element) { calculatedOffset.value = 0; return; }

      const rect = element.getBoundingClientRect();
      const dim = direction.value === 'row' ? rect.height : rect.width;
      calculatedOffset.value = dim + offsetAmount;
    } catch {
      calculatedOffset.value = 0;
    }
  }

  // ── Computed styles for handle positioning ──────────────────────────

  const handleStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (!offsetElement || calculatedOffset.value <= 0) return styles;
    const offset = calculatedOffset.value;

    if (direction.value === 'row') {
      if (offsetDirection === 'start' || offsetDirection === 'both') {
        styles.top = `${offset}px`;
      }
      if (offsetDirection === 'end') styles.bottom = `${offset}px`;
    } else {
      if (offsetDirection === 'start' || offsetDirection === 'both') {
        styles.left = `${offset}px`;
      }
      if (offsetDirection === 'end') styles.right = `${offset}px`;
    }

    return styles;
  });

  // ── Computed styles for panel content padding ──────────────────────

  const contentStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (!offsetElement || calculatedOffset.value <= 0) return styles;
    const offset = calculatedOffset.value;

    if (direction.value === 'row') {
      if (offsetDirection === 'start' || offsetDirection === 'both') {
        styles.paddingTop = `${offset}px`;
      }
      if (offsetDirection === 'end') styles.paddingBottom = `${offset}px`;
    } else {
      if (offsetDirection === 'start' || offsetDirection === 'both') {
        styles.paddingLeft = `${offset}px`;
      }
      if (offsetDirection === 'end') styles.paddingRight = `${offset}px`;
    }

    return styles;
  });

  onMounted(() => { updateOffset(); });
  onUnmounted(() => { /* cleanup handled by useDOMCache */ });

  return { calculatedOffset, updateOffset, handleStyles, contentStyles };
}
