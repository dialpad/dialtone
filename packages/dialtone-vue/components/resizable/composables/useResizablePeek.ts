/**
 * Peek Overlay Composable
 *
 * Manages the peek/preview overlay for collapsed panels.
 * Provides hover detection with grace period, button triggers,
 * and keyboard dismissal (Escape).
 */

import {
  ref,
  computed,
  watch,
  onUnmounted,
  type Ref,
  type ComputedRef,
  type CSSProperties,
} from 'vue';
import type {
  ResizablePanelState,
  ResizableDirection,
  PeekTriggerMode,
} from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';

// ─── Types ────────────────────────────────────────────────────────────────

export interface UseResizablePeekOptions {
  panel: Ref<ResizablePanelState | undefined>;
  containerElement: Ref<HTMLElement | null>;
  direction: Ref<ResizableDirection>;
  containerSize: Ref<number>;
  panelPosition: ComputedRef<'first' | 'last' | 'middle'>;
  panelOffset: ComputedRef<number>;
  onPeekChange?: (isPeeking: boolean) => void;
}

export interface UseResizablePeekReturn {
  isPeeking: Readonly<Ref<boolean>>;
  canPeek: ComputedRef<boolean>;
  triggerRef: Ref<HTMLElement | null>;
  peekRef: Ref<HTMLElement | null>;
  enterPeek: () => void;
  exitPeek: () => void;
  exitPeekWithGracePeriod: () => void;
  togglePeek: () => void;
  peekStyles: ComputedRef<CSSProperties>;
  peekClasses: ComputedRef<string[]>;
  showPeekButton: ComputedRef<boolean>;
  hoverEnabled: ComputedRef<boolean>;
  handlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onKeyDown: (event: KeyboardEvent) => void;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────

const DEFAULT_GRACE_PERIOD = 150;
const DEFAULT_PEEK_TRIGGER: PeekTriggerMode = 'hover';

// ─── Composable ───────────────────────────────────────────────────────────

export function useResizablePeek(
  options: UseResizablePeekOptions,
): UseResizablePeekReturn {
  const {
    panel, direction, containerSize, panelPosition, panelOffset,
    onPeekChange,
  } = options;

  const isPeeking = ref(false);
  const triggerRef = ref<HTMLElement | null>(null);
  const peekRef = ref<HTMLElement | null>(null);
  let gracePeriodTimer: ReturnType<typeof setTimeout> | null = null;

  // ─── Config accessors ───────────────────────────────────────────────

  const peekEnabled = computed(() => panel.value?.peekEnabled ?? false);
  const peekTrigger = computed(
    () => panel.value?.peekTrigger ?? DEFAULT_PEEK_TRIGGER,
  );
  const peekWhenManual = computed(
    () => panel.value?.peekWhenManual ?? false,
  );
  const gracePeriod = computed(
    () => panel.value?.peekGracePeriod ?? DEFAULT_GRACE_PERIOD,
  );

  // ─── Computed: can peek? ────────────────────────────────────────────

  const canPeek = computed((): boolean => {
    const p = panel.value;
    if (!p || !peekEnabled.value || !p.collapsed) return false;
    // Only allow peek for auto-collapsed unless peekWhenManual is true
    if (!p.autoCollapsed && !peekWhenManual.value) return false;
    return true;
  });

  const showPeekButton = computed((): boolean => {
    const trigger = peekTrigger.value;
    return trigger === 'button' || trigger === 'both';
  });

  const hoverEnabled = computed((): boolean => {
    const trigger = peekTrigger.value;
    return trigger === 'hover' || trigger === 'both';
  });

  // ─── Computed: peek width ───────────────────────────────────────────

  const peekWidthPixels = computed((): number => {
    const p = panel.value;
    if (!p) return 300;
    const sizeValue = p.peekWidth ?? p.initialSize ?? '300';
    return parseSizeToPixels(sizeValue, containerSize.value);
  });

  // ─── Computed: position helpers ─────────────────────────────────────

  const isFirstPanel = computed(
    () => panelPosition.value === 'first',
  );
  const isLastPanel = computed(
    () => panelPosition.value === 'last',
  );

  // ─── Computed: peek styles ──────────────────────────────────────────

  const peekStyles = computed((): CSSProperties => {
    const styles: CSSProperties = {};
    const offset = panelOffset.value;

    if (direction.value === 'row') {
      styles.width = `${peekWidthPixels.value}px`;
      styles.top = '0';
      styles.bottom = '0';
      styles.left = `${offset}px`;
    } else {
      styles.height = `${peekWidthPixels.value}px`;
      styles.left = '0';
      styles.right = '0';
      styles.top = `${offset}px`;
    }

    return styles;
  });

  // ─── Computed: peek classes ─────────────────────────────────────────

  const peekClasses = computed((): string[] => {
    const classes: string[] = ['dt-resizable-panel__peek-overlay'];

    if (isPeeking.value) {
      classes.push('dt-resizable-panel__peek-overlay--visible');
    }

    const dir = direction.value === 'row' ? 'row' : 'column';
    classes.push(`dt-resizable-panel__peek-trigger--${dir}`);

    if (isFirstPanel.value) {
      classes.push('dt-resizable-panel__peek-trigger--first');
    }
    if (isLastPanel.value) {
      classes.push('dt-resizable-panel__peek-trigger--last');
    }

    return classes;
  });

  // ─── Actions ────────────────────────────────────────────────────────

  function clearGracePeriodTimer(): void {
    if (gracePeriodTimer) {
      clearTimeout(gracePeriodTimer);
      gracePeriodTimer = null;
    }
  }

  function enterPeek(): void {
    if (!canPeek.value) return;
    clearGracePeriodTimer();
    isPeeking.value = true;
  }

  function exitPeek(): void {
    isPeeking.value = false;
  }

  function exitPeekWithGracePeriod(): void {
    clearGracePeriodTimer();
    gracePeriodTimer = setTimeout(() => {
      isPeeking.value = false;
      gracePeriodTimer = null;
    }, gracePeriod.value);
  }

  function togglePeek(): void {
    if (isPeeking.value) exitPeek();
    else enterPeek();
  }

  // ─── Event handlers ─────────────────────────────────────────────────

  function onMouseEnter(): void {
    if (!hoverEnabled.value) return;
    enterPeek();
  }

  function onMouseLeave(): void {
    if (!hoverEnabled.value) return;
    exitPeekWithGracePeriod();
  }

  function onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && isPeeking.value) {
      event.preventDefault();
      event.stopPropagation();
      exitPeek();
      if (showPeekButton.value && triggerRef.value) {
        triggerRef.value.focus();
      }
    }
  }

  // ─── Watchers ───────────────────────────────────────────────────────

  watch(isPeeking, (newValue) => {
    if (onPeekChange) onPeekChange(newValue);
    if (panel.value) panel.value.isPeeking = newValue;
  });

  watch(
    () => panel.value?.collapsed,
    (collapsed) => {
      if (!collapsed && isPeeking.value) {
        clearGracePeriodTimer();
        isPeeking.value = false;
      }
    },
  );

  onUnmounted(() => { clearGracePeriodTimer(); });

  return {
    isPeeking: isPeeking as Readonly<Ref<boolean>>,
    canPeek,
    triggerRef,
    peekRef,
    enterPeek,
    exitPeek,
    exitPeekWithGracePeriod,
    togglePeek,
    peekStyles,
    peekClasses,
    showPeekButton,
    hoverEnabled,
    handlers: { onMouseEnter, onMouseLeave, onKeyDown },
  };
}
