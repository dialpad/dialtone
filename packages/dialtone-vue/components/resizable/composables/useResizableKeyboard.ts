import { ref, type ComputedRef, type Ref } from 'vue';
import type {
  ResizablePanelState,
  ResizableDirection,
} from '../resizable_constants';
import { useResizeHandling } from './useResizableCalculations';

export interface ResizableKeyboardMessages {
  /**
   * Announcement template for resize actions.
   * Placeholders: {beforeId}, {afterId}, {beforePx}, {afterPx}, {action}, {incrementType}
   */
  resizeAnnouncement?: string;
}

const DEFAULT_KEYBOARD_MESSAGES: Required<ResizableKeyboardMessages> = {
  resizeAnnouncement:
    'Panel {beforeId} {action} to {beforePx}px, Panel {afterId} adjusted to {afterPx}px. {incrementType} adjustment applied.',
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
    onSizeAnnouncement,
    messages: userMessages,
  } = options;

  const msg = { ...DEFAULT_KEYBOARD_MESSAGES, ...userMessages };

  const isFocused = ref(false);

  const resizeHandler = useResizeHandling(
    direction.value,
    () => containerSize.value,
  );

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
    resizeDirection: 'increase' | 'decrease',
    increment: number,
  ): string {
    const beforePx = Math.round(beforePanel.pixelSize);
    const afterPx = Math.round(afterPanel.pixelSize);
    const action =
      resizeDirection === 'increase' ? 'increased' : 'decreased';
    const incrementType =
      increment === KEYBOARD_INCREMENTS.fine
        ? 'fine'
        : increment === KEYBOARD_INCREMENTS.large
          ? 'large'
          : 'normal';

    return msg.resizeAnnouncement
      .replace('{beforeId}', beforePanel.id)
      .replace('{afterId}', afterPanel.id)
      .replace('{beforePx}', String(beforePx))
      .replace('{afterPx}', String(afterPx))
      .replace('{action}', action)
      .replace('{incrementType}', incrementType);
  }

  // ─── DOM position updates (mirrors mouse drag approach) ─────────────

  function updateRowLayout(
    beforeEl: HTMLElement,
    afterEl: HTMLElement,
    handleEl: HTMLElement | null,
    cursorPos: number,
    beforeRight: number,
  ): void {
    beforeEl.style.left = beforeEl.style.left || '0px';
    beforeEl.style.right = `${beforeRight}px`;
    beforeEl.style.width = '';

    afterEl.style.left = `${cursorPos}px`;
    afterEl.style.width = '';

    if (handleEl) {
      handleEl.style.left = `${Math.max(0, cursorPos - 2)}px`;
    }
  }

  function updateColumnLayout(
    beforeEl: HTMLElement,
    afterEl: HTMLElement,
    handleEl: HTMLElement | null,
    cursorPos: number,
    beforeBottom: number,
  ): void {
    beforeEl.style.top = beforeEl.style.top || '0px';
    beforeEl.style.bottom = `${beforeBottom}px`;
    beforeEl.style.height = '';

    afterEl.style.top = `${cursorPos}px`;
    afterEl.style.height = '';

    if (handleEl) {
      handleEl.style.top = `${Math.max(0, cursorPos - 2)}px`;
    }
  }

  function applyResize(
    beforePanel: ResizablePanelState,
    afterPanel: ResizablePanelState,
    newBeforePixels: number,
    newAfterPixels: number,
  ): void {
    beforePanel.pixelSize = Math.round(newBeforePixels);
    afterPanel.pixelSize = Math.round(newAfterPixels);

    const cursorPos = newBeforePixels;
    const container = handleElement.value?.closest('.dt-resizable');

    if (container) {
      const beforeEl = container.querySelector(
        `[data-panel-id="${beforePanelId.value}"]`,
      ) as HTMLElement;
      const afterEl = container.querySelector(
        `[data-panel-id="${afterPanelId.value}"]`,
      ) as HTMLElement;
      const hEl = container.querySelector(
        `[data-handle-id="${beforePanelId.value}:${afterPanelId.value}"]`,
      ) as HTMLElement;

      if (beforeEl && afterEl) {
        const beforeRight = containerSize.value - cursorPos;

        if (direction.value === 'row') {
          updateRowLayout(beforeEl, afterEl, hEl, cursorPos, beforeRight);
        } else {
          updateColumnLayout(
            beforeEl, afterEl, hEl, cursorPos, beforeRight,
          );
        }
      }
    }

    onResize(
      beforePanelId.value,
      beforePanel.pixelSize,
      afterPanelId.value,
      afterPanel.pixelSize,
    );
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
      `${beforePanelId.value}:${afterPanelId.value}`,
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
        generateSizeAnnouncement(
          beforePanel, afterPanel, resizeDirection, incrementPixels,
        ),
      );
    }

    return true;
  }

  // ─── Event handlers ─────────────────────────────────────────────────

  function handleKeyDown(event: KeyboardEvent): void {
    if (!isFocused.value) return;

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
