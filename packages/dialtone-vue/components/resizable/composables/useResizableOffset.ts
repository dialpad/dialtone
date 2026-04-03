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
  type Ref,
  type ComputedRef,
} from 'vue';

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

  function updateOffset(): void {
    if (!offsetElement) { calculatedOffset.value = 0; return; }

    try {
      const element = document.querySelector(offsetElement);
      if (!element) { calculatedOffset.value = 0; return; }

      const rect = element.getBoundingClientRect();
      const dim = direction.value === 'row' ? rect.height : rect.width;
      calculatedOffset.value = dim + offsetAmount;
    } catch {
      calculatedOffset.value = 0;
    }
  }

  // ── Computed styles for handle positioning ──────────────────────────

  // Logical properties — writing-mode on parent handles direction rotation
  const handleStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (!offsetElement || calculatedOffset.value <= 0) return styles;
    const offset = `${calculatedOffset.value}px`;

    if (offsetDirection === 'start' || offsetDirection === 'both') {
      styles.insetBlockStart = offset;
    }
    if (offsetDirection === 'end') {
      styles.insetBlockEnd = offset;
    }

    return styles;
  });

  const contentStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (!offsetElement || calculatedOffset.value <= 0) return styles;
    const offset = `${calculatedOffset.value}px`;

    if (offsetDirection === 'start' || offsetDirection === 'both') {
      styles.paddingBlockStart = offset;
    }
    if (offsetDirection === 'end') {
      styles.paddingBlockEnd = offset;
    }

    return styles;
  });

  onMounted(() => { updateOffset(); });

  return { calculatedOffset, updateOffset, handleStyles, contentStyles };
}
