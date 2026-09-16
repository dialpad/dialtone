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
  /** CSS selector for the element to measure offset from (auto-measures block-size) */
  offsetElement?: string | null;
  /** Explicit pixel offset. Overrides offsetElement measurement when both provided. */
  offsetAmount?: number | null;
  /** Which edge(s) the offset applies to (default: 'start') */
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
    offsetElement = null,
    offsetAmount = null,
    offsetDirection = 'start',
    direction = ref('row'),
  } = options;

  const calculatedOffset = ref(0);

  function updateOffset(): void {
    // Explicit amount wins over element measurement
    if (offsetAmount != null && offsetAmount > 0) {
      calculatedOffset.value = offsetAmount;
      return;
    }

    if (!offsetElement) { calculatedOffset.value = 0; return; }

    try {
      const element = document.querySelector(offsetElement);
      if (!element) { calculatedOffset.value = 0; return; }

      const rect = element.getBoundingClientRect();
      const dim = direction.value === 'row' ? rect.height : rect.width;
      calculatedOffset.value = dim;
    } catch (error) {
      console.warn('[resizable] Failed to measure offset element:', error);
      calculatedOffset.value = 0;
    }
  }

  // ── Computed styles — logical properties rotate with writing-mode ──

  const handleStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (calculatedOffset.value <= 0) return styles;
    const px = `${calculatedOffset.value}px`;
    if (offsetDirection === 'start' || offsetDirection === 'both') styles.insetBlockStart = px;
    if (offsetDirection === 'end' || offsetDirection === 'both') styles.insetBlockEnd = px;
    return styles;
  });

  const contentStyles = computed(() => {
    const styles: Record<string, string> = {};
    if (calculatedOffset.value <= 0) return styles;
    const px = `${calculatedOffset.value}px`;
    if (offsetDirection === 'start' || offsetDirection === 'both') styles.paddingBlockStart = px;
    if (offsetDirection === 'end' || offsetDirection === 'both') styles.paddingBlockEnd = px;
    return styles;
  });

  onMounted(() => { updateOffset(); });

  return { calculatedOffset, updateOffset, handleStyles, contentStyles };
}
