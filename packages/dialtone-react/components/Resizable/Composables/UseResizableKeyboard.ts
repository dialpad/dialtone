import { useRef, type KeyboardEvent, type RefObject } from 'react';
import type {
  ResizablePanelState,
  ResizableDirection,
} from '../ResizableConstants';
import { MIN_PANEL_SIZE_PX, RESIZABLE_HANDLE_CENTER_OFFSET_PX, buildHandleId } from '../ResizableConstants';
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

/** Vue passes refs; the port passes the handle's current values, as its event handlers run with the latest render. */
export interface ResizableKeyboardOptions {
  panels: ResizablePanelState[];
  direction: ResizableDirection;
  containerSize: number;
  beforePanelId: string;
  afterPanelId: string;
  handleElement: RefObject<HTMLElement | null>;
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

type HandleKeyboardEvent = KeyboardEvent<HTMLElement> | globalThis.KeyboardEvent;

const STYLE_PROPS = ['insetInlineStart', 'insetInlineEnd', 'inlineSize'] as const;
type StyleProp = typeof STYLE_PROPS[number];
type InlineStyles = Record<StyleProp, string>;

function snapshotStyle (element: HTMLElement): InlineStyles {
  const style = element.style as unknown as Record<StyleProp, string | undefined>;
  return Object.fromEntries(STYLE_PROPS.map(prop => [prop, style[prop] ?? ''])) as InlineStyles;
}

function restoreStyle (element: HTMLElement, snapshot: InlineStyles): void {
  const style = element.style as unknown as InlineStyles;
  for (const prop of STYLE_PROPS) style[prop] = snapshot[prop];
}

/**
 * Hook for keyboard-driven resize on a single handle.
 * Implements the W3C ARIA separator keyboard pattern:
 * - Arrow keys: resize
 * - Enter: toggle collapse on before panel
 * - Home: resize to min
 * - End: resize to max
 * - R: reset adjacent panels
 * - Escape: blur handle
 */
export function useResizableKeyboard (options: ResizableKeyboardOptions) {
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

  const isFocused = useRef(false);

  const resizeHandler = useResizeHandling(() => containerSize);

  function getCurrentPanels () {
    const beforePanel = panels.find(p => p.id === beforePanelId);
    const afterPanel = panels.find(p => p.id === afterPanelId);
    return { beforePanel, afterPanel };
  }

  function getResizeIncrement (event: HandleKeyboardEvent): number {
    if (event.metaKey || event.ctrlKey) return KEYBOARD_INCREMENTS.fine;
    if (event.shiftKey) return KEYBOARD_INCREMENTS.large;
    return KEYBOARD_INCREMENTS.normal;
  }

  function getResizeDirection (
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

  function generateSizeAnnouncement (
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

  function updateLayout (
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
      handleEl.style.insetInlineStart = `${Math.max(0, cursorPos - RESIZABLE_HANDLE_CENTER_OFFSET_PX)}px`;
    }
  }

  function applyResize (
    newBeforePixels: number,
    newAfterPixels: number,
  ): void {
    const roundedBefore = Math.round(newBeforePixels);
    const roundedAfter = Math.round(newAfterPixels);

    // DOM updates for immediate visual feedback
    const cursorPos = newBeforePixels;
    const container = handleElement.current?.closest('.d-resizable');

    let beforeEl: HTMLElement | null = null;
    let afterEl: HTMLElement | null = null;
    let hEl: HTMLElement | null = null;
    let snapshots: [InlineStyles, InlineStyles, InlineStyles | null] | null = null;

    if (container) {
      beforeEl = container.querySelector<HTMLElement>(`[data-panel-id="${beforePanelId}"]`);
      afterEl = container.querySelector<HTMLElement>(`[data-panel-id="${afterPanelId}"]`);
      hEl = container.querySelector<HTMLElement>(`[data-handle-id="${buildHandleId(beforePanelId, afterPanelId)}"]`);

      if (beforeEl && afterEl) {
        snapshots = [snapshotStyle(beforeEl), snapshotStyle(afterEl), hEl && snapshotStyle(hEl)];
        const beforeEnd = containerSize - cursorPos;
        updateLayout(beforeEl, afterEl, hEl, cursorPos, beforeEnd);
      }
    }

    // Commit to state — mirrors drag's commitDrag discipline
    onResize(
      beforePanelId,
      roundedBefore,
      afterPanelId,
      roundedAfter,
    );

    // Hand the DOM back to React. Vue clears these inline styles and re-applies every style on its next render; React
    // only re-applies the values that change, so the ones it rendered are put back instead of cleared.
    if (beforeEl && afterEl && snapshots) {
      restoreStyle(beforeEl, snapshots[0]);
      restoreStyle(afterEl, snapshots[1]);
      if (hEl && snapshots[2]) restoreStyle(hEl, snapshots[2]);
    }
  }

  function processKeyboardResize (
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
      containerSize,
      buildHandleId(beforePanelId, afterPanelId),
      panels,
      0,
    );

    if (!resizeResult.isValidResize) return false;

    applyResize(
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

  function handleArrowKey (event: HandleKeyboardEvent): void {
    const resizeDirection = getResizeDirection(event.key, direction);
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

  function handleEnterKey (event: HandleKeyboardEvent): void {
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

  function handleHomeKey (event: HandleKeyboardEvent): void {
    event.preventDefault();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel) return;

    const targetSize = beforePanel.userMinSizePixels ?? MIN_PANEL_SIZE_PX;
    const delta = targetSize - beforePanel.pixelSize;
    if (delta === 0) return;

    const dir = delta > 0 ? 'increase' : 'decrease';
    processKeyboardResize(beforePanel, afterPanel, dir, Math.abs(delta));
  }

  function handleEndKey (event: HandleKeyboardEvent): void {
    event.preventDefault();

    const { beforePanel, afterPanel } = getCurrentPanels();
    if (!beforePanel || !afterPanel) return;

    const afterMin = afterPanel.userMinSizePixels ?? MIN_PANEL_SIZE_PX;
    const maxSize = beforePanel.userMaxSizePixels
      ?? (containerSize - afterMin);
    const targetSize = Math.min(maxSize, containerSize - afterMin);
    const delta = targetSize - beforePanel.pixelSize;
    if (delta === 0) return;

    const dir = delta > 0 ? 'increase' : 'decrease';
    processKeyboardResize(beforePanel, afterPanel, dir, Math.abs(delta));
  }

  function handleResetKey (event: HandleKeyboardEvent): void {
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

  function handleEscapeKey (event: HandleKeyboardEvent): void {
    event.preventDefault();
    handleElement.current?.blur();
  }

  // ─── Event handlers ─────────────────────────────────────────────────

  function handleKeyDown (event: HandleKeyboardEvent): void {
    if (!isFocused.current) return;

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

  function handleFocus (): void {
    isFocused.current = true;
  }

  function handleBlur (): void {
    isFocused.current = false;
  }

  function focusHandle (): void {
    handleElement.current?.focus();
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
