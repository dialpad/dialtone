import { ref, type ComputedRef, type Ref } from 'vue';
import type {
  ResizablePanelState,
  ResizableDirection,
} from '../ResizableConstants';
import { MIN_PANEL_SIZE_PX, buildHandleId } from '../ResizableConstants';
import { useResizeHandling } from './UseResizableCalculations';

export interface ResizableKeyboardMessages {
  /**
   * Announcement template for resize actions.
   * Placeholders: {beforeId}, {afterId}, {beforePx}, {afterPx}
   */
  resizeAnnouncement?: string;
  /** Announced when a panel is collapsed. Placeholder: {panelId} */
  collapseAnnouncement?: string;
  /** Announced when a panel is expanded. Placeholder: {panelId} */
  expandAnnouncement?: string;
  /** Announced when panels are reset. Placeholders: {beforeId}, {afterId} */
  resetAnnouncement?: string;
  /** aria-valuetext template. Placeholders: {panelId}, {pixels} */
  ariaValueText?: string;
  /** aria-label template. Placeholders: {before}, {after} */
  handleAriaLabel?: string;
}

const DEFAULT_KEYBOARD_MESSAGES: Required<ResizableKeyboardMessages> = {
  resizeAnnouncement:
    '{beforeId}: {beforePx}px, {afterId}: {afterPx}px',
  collapseAnnouncement: '{panelId} collapsed',
  expandAnnouncement: '{panelId} expanded',
  resetAnnouncement: '{beforeId} and {afterId} reset',
  ariaValueText: '{panelId}: {pixels}px',
  handleAriaLabel: 'Resize handle between {before} and {after} panels',
};

export interface ResizableKeyboardOptions {
  panels: ComputedRef<ResizablePanelState[]>;
  direction: ComputedRef<ResizableDirection>;
  containerSize: ComputedRef<number>;
  beforePanelId: ComputedRef<string>;
  afterPanelId: ComputedRef<string>;
  handleElement: Ref<HTMLElement | null>;
  onResize: (
    beforePanelId: string,
    beforeSize: number,
    afterPanelId: string,
    afterSize: number,
  ) => void;
  onCollapse?: (panelId: string, collapsed: boolean) => void;
  onReset?: (beforePanelId: string, afterPanelId: string) => void;
  onSizeAnnouncement?: (message: string) => void;
  messages?: ResizableKeyboardMessages;
}

/**
 * Keyboard increment settings for different modifier combinations (pixels).
 */
export const KEYBOARD_INCREMENTS = {
  /** Fine control (Cmd/Ctrl + Arrow) */
  fine: 1,
  /** Normal increment (Arrow only) */
  normal: 8,
  /** Large increment (Shift + Arrow) */
  large: 24,
} as const;

/**
 * Composable for keyboard-driven resize on a single handle.
 * Implements the W3C ARIA separator keyboard pattern:
 * - Arrow keys: resize
 * - Enter: toggle collapse on before panel
 * - Home: resize to min
 * - End: resize to max
 * - R: reset adjacent panels
 * - Escape: blur handle
 */
export function useResizableKeyboard(options: ResizableKeyboardOptions) {
  const {
    panels,
    direction,
    containerSize,
    beforePanelId,
    afterPanelId,
    handleElement,
    onResize,
    onCollapse,
    onReset,
    onSizeAnnouncement,
    messages: userMessages,
  } = options;

  const msg = { ...DEFAULT_KEYBOARD_MESSAGES, ...userMessages };

  const isFocused = ref(false);

  const resizeHandler = useResizeHandling(() => containerSize.value);

  function getCurrentPanels() {
    const beforePanel = panels.value.find(
      (p) => p.id === beforePanelId.value,
    );
    const afterPanel = panels.value.find(
      (p) => p.id === afterPanelId.value,
    );
    return { beforePanel, afterPanel };
  }

  function getResizeIncrement(event: KeyboardEvent): number {
    if (event.metaKey || event.ctrlKey) return KEYBOARD_INCREMENTS.fine;
    if (event.shiftKey) return KEYBOARD_INCREMENTS.large;
    return KEYBOARD_INCREMENTS.normal;
  }

  function getResizeDirection(
    key: string,
    layoutDirection: ResizableDirection,
  ): 'increase' | 'decrease' | null {
    const rowKeyMap: Record<string, 'increase' | 'decrease'> = {
      ArrowLeft: 'decrease',
      ArrowRight: 'increase',
    };
    const columnKeyMap: Record<string, 'increase' | 'decrease'> = {
      ArrowUp: 'decrease',
      ArrowDown: 'increase',
    };
    return layoutDirection === 'row'
      ? rowKeyMap[key] || null
      : columnKeyMap[key] || null;
  }

  function generateSizeAnnouncement(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
  ): string {
    const beforePx = Math.round(beforePanel.pixelSize);
    const afterPx = Math.round(afterPanel.pixelSize);

    return msg.resizeAnnouncement
      .replace('{beforeId}', beforePanel.id)
      .replace('{afterId}', afterPanel.id)
      .replace('{beforePx}', String(beforePx))
      .replace('{afterPx}', String(afterPx));
  }

  // ─── DOM position updates (logical properties) ──────────────────────

  function updateLayout(
    beforeEl: HTMLElement,
    afterEl: HTMLElement,
    handleEl: HTMLElement | null,
    cursorPos: number,
    beforeEnd: number,
  ): void {
    beforeEl.style.insetInlineStart = beforeEl.style.insetInlineStart || '0px';
    beforeEl.style.insetInlineEnd = `${beforeEnd}px`;
    beforeEl.style.inlineSize = '';

    afterEl.style.insetInlineStart = `${cursorPos}px`;
    afterEl.style.inlineSize = '';

    if (handleEl) {
      handleEl.style.insetInlineStart = `${Math.max(0, cursorPos - 2)}px`;
    }
  }

  function clearInlineStyles(
    beforeEl: HTMLElement,
    afterEl: HTMLElement,
    handleEl: HTMLElement | null,
  ): void {
    beforeEl.style.insetInlineStart = '';
    beforeEl.style.insetInlineEnd = '';
    beforeEl.style.inlineSize = '';
    afterEl.style.insetInlineStart = '';
    afterEl.style.inlineSize = '';
    if (handleEl) handleEl.style.insetInlineStart = '';
  }

  function applyResize(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    newBeforePixels: number,
    newAfterPixels: number,
  ): void {
    const roundedBefore = Math.round(newBeforePixels);
    const roundedAfter = Math.round(newAfterPixels);

    // DOM updates for immediate visual feedback
    const cursorPos = newBeforePixels;
    const container = handleElement.value?.closest('.d-resizable');

    let beforeEl: HTMLElement | null = null;
    let afterEl: HTMLElement | null = null;
    let hEl: HTMLElement | null = null;

    if (container) {
      beforeEl = container.querySelector(
        `[data-panel-id="${beforePanelId.value}"]`,
      );
      afterEl = container.querySelector(
        `[data-panel-id="${afterPanelId.value}"]`,
      );
      hEl = container.querySelector(
        `[data-handle-id="${buildHandleId(beforePanelId.value, afterPanelId.value)}"]`,
      );

      if (beforeEl && afterEl) {
        const beforeEnd = containerSize.value - cursorPos;
        updateLayout(beforeEl, afterEl, hEl, cursorPos, beforeEnd);
      }
    }

    // Commit to reactive state — mirrors drag's commitDrag discipline
    onResize(
      beforePanelId.value,
      roundedBefore,
      afterPanelId.value,
      roundedAfter,
    );

    // Clear inline styles so Vue exclusively owns the DOM from this point.
    // Without this, there's a frame where both inline styles and Vue's
    // computed layout coexist — a latent bug surface if anything reads
    // DOM positions between onResize and Vue's next render.
    if (beforeEl && afterEl) {
      clearInlineStyles(beforeEl, afterEl, hEl);
    }
  }

  function processKeyboardResize(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    resizeDirection: 'increase' | 'decrease',
    incrementPixels: number,
  ): boolean {
    const delta =
      resizeDirection === 'increase' ? incrementPixels : -incrementPixels;
    const newCursorPosition = beforePanel.pixelSize + delta;

    const resizeResult = resizeHandler.processResizeMove(
      newCursorPosition,
      beforePanel,
      afterPanel,
      containerSize.value,
      buildHandleId(beforePanelId.value, afterPanelId.value),
      panels.value,
      0,
    );

    if (!resizeResult.isValidResize) return false;

    applyResize(
      beforePanel,
      afterPanel,
      resizeResult.beforePanelSize,
      resizeResult.afterPanelSize,
    );

    if (onSizeAnnouncement) {
      onSizeAnnouncement(
        generateSizeAnnouncement(beforePanel, afterPanel),
      );
    }

    return true;
  }

  // ─── Key handlers ─────────────────────────────────────────────────

  function handleArrowKey(event: KeyboardEvent): void {
    const resizeDirection = getResizeDirection(event.key, direction.value);
    if (!resizeDirection) return;

    event.preventDefault();
    event.stopPropagation();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel) return;

    const incrementPixels = getResizeIncrement(event);
    processKeyboardResize(
      beforePanel, afterPanel, resizeDirection, incrementPixels,
    );
  }

  function handleEnterKey(event: KeyboardEvent): void {
    const { beforePanel } = getCurrentPanels();
    if (!beforePanel?.collapsible || !onCollapse) return;

    event.preventDefault();
    const newCollapsed = !beforePanel.collapsed;
    onCollapse(beforePanel.id, newCollapsed);

    if (onSizeAnnouncement) {
      const template = newCollapsed
        ? msg.collapseAnnouncement
        : msg.expandAnnouncement;
      onSizeAnnouncement(template.replace('{panelId}', beforePanel.id));
    }
  }

  function handleHomeKey(event: KeyboardEvent): void {
    event.preventDefault();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel) return;

    const targetSize = beforePanel.userMinSizePixels ?? MIN_PANEL_SIZE_PX;
    const delta = targetSize - beforePanel.pixelSize;
    if (delta === 0) return;

    const dir = delta > 0 ? 'increase' : 'decrease';
    processKeyboardResize(beforePanel, afterPanel, dir, Math.abs(delta));
  }

  function handleEndKey(event: KeyboardEvent): void {
    event.preventDefault();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel) return;

    const afterMin = afterPanel.userMinSizePixels ?? MIN_PANEL_SIZE_PX;
    const maxSize = beforePanel.userMaxSizePixels
      ?? (containerSize.value - afterMin);
    const targetSize = Math.min(maxSize, containerSize.value - afterMin);
    const delta = targetSize - beforePanel.pixelSize;
    if (delta === 0) return;

    const dir = delta > 0 ? 'increase' : 'decrease';
    processKeyboardResize(beforePanel, afterPanel, dir, Math.abs(delta));
  }

  function handleResetKey(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;

    event.preventDefault();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel || !onReset) return;

    onReset(beforePanel.id, afterPanel.id);

    if (onSizeAnnouncement) {
      onSizeAnnouncement(
        msg.resetAnnouncement
          .replace('{beforeId}', beforePanel.id)
          .replace('{afterId}', afterPanel.id),
      );
    }
  }

  function handleEscapeKey(event: KeyboardEvent): void {
    event.preventDefault();
    handleElement.value?.blur();
  }

  // ─── Event handlers ─────────────────────────────────────────────────

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isFocused.value) return;

    switch (event.key) {
      case 'Enter':
        handleEnterKey(event);
        return;
      case 'Home':
        handleHomeKey(event);
        return;
      case 'End':
        handleEndKey(event);
        return;
      case 'r':
      case 'R':
        handleResetKey(event);
        return;
      case 'Escape':
        handleEscapeKey(event);
        return;
    }

    // Arrow keys — resize
    handleArrowKey(event);
  }

  function handleFocus(): void {
    isFocused.value = true;
  }

  function handleBlur(): void {
    isFocused.value = false;
  }

  function focusHandle(): void {
    handleElement.value?.focus();
  }

  return {
    isFocused,
    focusHandle,
    handleKeyDown,
    handleFocus,
    handleBlur,
    KEYBOARD_INCREMENTS,
  };
}
