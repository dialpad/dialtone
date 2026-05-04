/**
 * useResizableDrag — Per-group drag state composable
 *
 * Each ResizableGroup instance gets its own drag composable, so nested groups can
 * drag independently without conflict.
 *
 * Key design: shadow state during drag.
 * - proposedBeforeSize / proposedAfterSize track the "what-if" layout during the drag.
 * - These are applied directly to DOM elements as inline styles (performance).
 * - The reactive layout state is NOT mutated during drag.
 * - On commit (mouseup / touchend): onDragEnd callback receives the final sizes.
 * - On cancel (Escape / unmount): inline styles are removed, DOM returns to layout state.
 */

import { reactive, onUnmounted, type ComputedRef, type Ref } from 'vue';
import type { ResizableDirection, ResizablePanelState } from '../ResizableConstants';
import type { ResizeHandler } from './UseResizableCalculations';

// ============================================================================
// TYPES
// ============================================================================

export type DragState = DragStateIdle | DragStateActive;

export interface DragStateIdle {
  isActive: false;
  handleId: null;
  beforePanelId: null;
  afterPanelId: null;
  proposedBeforeSize: 0;
  proposedAfterSize: 0;
}

export interface DragStateActive {
  isActive: true;
  handleId: string;
  beforePanelId: string;
  afterPanelId: string;
  /** Proposed before-panel size during drag (shadow — not committed to layout yet) */
  proposedBeforeSize: number;
  /** Proposed after-panel size during drag (shadow — not committed to layout yet) */
  proposedAfterSize: number;
}

/** Initial idle state for reactive() initialization. */
const IDLE_STATE: DragStateIdle = {
  isActive: false,
  handleId: null,
  beforePanelId: null,
  afterPanelId: null,
  proposedBeforeSize: 0,
  proposedAfterSize: 0,
};

export interface UseResizableDragOptions {
  direction: ComputedRef<ResizableDirection>;
  containerRef: Ref<HTMLElement | null>;
  panels: ComputedRef<ResizablePanelState[]> | Ref<ResizablePanelState[]>;
  containerSize: ComputedRef<number> | Ref<number>;
  resizeHandler: ResizeHandler;
  onDragEnd: (
    beforePanelId: string,
    afterPanelId: string,
    beforeSize: number,
    afterSize: number,
    sizesChanged: boolean
  ) => void;
  onDragStart?: (handleId: string) => void;
}

// ============================================================================
// DOM HELPERS
// ============================================================================

function findPanelElement(container: HTMLElement, panelId: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-panel-id="${panelId}"]`);
}

function findHandleElement(container: HTMLElement, handleId: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-handle-id="${handleId}"]`);
}

function applyPanelDragStyle(element: HTMLElement, start: number, end: number): void {
  element.style.insetInlineStart = `${start}px`;
  element.style.insetInlineEnd = `${end}px`;
  element.style.inlineSize = '';
}

function clearDragStyle(element: HTMLElement): void {
  element.style.insetInlineStart = '';
  element.style.insetInlineEnd = '';
  element.style.inlineSize = '';
}

function applyHandleDragStyle(element: HTMLElement, position: number): void {
  element.style.insetInlineStart = `${Math.max(0, position)}px`;
}

function clearHandleDragStyle(element: HTMLElement): void {
  element.style.insetInlineStart = '';
}

// ============================================================================
// PANEL LOOKUP
// ============================================================================

/**
 * Find the before/after panel pair for a given handle ID.
 * Handle IDs are formatted as "{beforePanelId}:{afterPanelId}".
 */
export function findPanelsForHandle(
  handleId: string,
  panels: ResizablePanelState[]
): { beforePanel: ResizablePanelState | null; afterPanel: ResizablePanelState | null } {
  const sepIndex = handleId.indexOf(':');
  if (sepIndex === -1) return { beforePanel: null, afterPanel: null };

  const beforeId = handleId.slice(0, sepIndex);
  const afterId = handleId.slice(sepIndex + 1);

  const beforePanel = panels.find(p => p.id === beforeId) ?? null;
  const afterPanel = panels.find(p => p.id === afterId) ?? null;
  return { beforePanel, afterPanel };
}

// ============================================================================
// COMPOSABLE
// ============================================================================

/**
 * Must be called from component setup context (uses `onUnmounted` lifecycle hook).
 */
export function useResizableDrag(options: UseResizableDragOptions) {
  const { direction, containerRef, panels, containerSize, resizeHandler, onDragEnd, onDragStart } = options;

  const dragState = reactive<DragState>({ ...IDLE_STATE });

  let beforePanelEl: HTMLElement | null = null;
  let afterPanelEl: HTMLElement | null = null;
  let handleEl: HTMLElement | null = null;

  let cachedBeforePanel: ResizablePanelState | null = null;
  let cachedAfterPanel: ResizablePanelState | null = null;

  let originalBeforeSize = 0;
  let originalAfterSize = 0;
  let beforePanelLeft = 0;
  let cachedContainerRect: DOMRect | null = null;

  let boundPointerMove: ((e: PointerEvent) => void) | null = null;
  let boundPointerUp: ((e: PointerEvent) => void) | null = null;

  function attachDocumentListeners(): void {
    boundPointerMove = (e: PointerEvent) => onDragMove(e);
    boundPointerUp = () => commitDrag();

    document.addEventListener('pointermove', boundPointerMove);
    document.addEventListener('pointerup', boundPointerUp);
    document.addEventListener('pointercancel', boundPointerUp);
    document.addEventListener('keydown', handleKeydown);
  }

  function removeDocumentListeners(): void {
    if (boundPointerMove) {
      document.removeEventListener('pointermove', boundPointerMove);
      boundPointerMove = null;
    }
    if (boundPointerUp) {
      document.removeEventListener('pointerup', boundPointerUp);
      document.removeEventListener('pointercancel', boundPointerUp);
      boundPointerUp = null;
    }
    document.removeEventListener('keydown', handleKeydown);
  }

  function cleanup(): void {
    removeDocumentListeners();

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    Object.assign(dragState, IDLE_STATE);

    beforePanelEl = null;
    afterPanelEl = null;
    handleEl = null;
    cachedBeforePanel = null;
    cachedAfterPanel = null;
    originalBeforeSize = 0;
    originalAfterSize = 0;
    beforePanelLeft = 0;
    cachedContainerRect = null;
  }

  function locateDragElements(
    container: HTMLElement,
    handleId: string,
    panelList: ResizablePanelState[]
  ): {
    beforePanel: ResizablePanelState;
    afterPanel: ResizablePanelState;
    beforeEl: HTMLElement;
    afterEl: HTMLElement;
    handleElement: HTMLElement | null;
  } | null {
    const { beforePanel, afterPanel } = findPanelsForHandle(handleId, panelList);
    if (!beforePanel || !afterPanel) {
      console.warn(`[resizable] No panel pair found for handle "${handleId}"`);
      return null;
    }

    const beforeEl = findPanelElement(container, beforePanel.id);
    const afterEl = findPanelElement(container, afterPanel.id);
    const handleElement = findHandleElement(container, handleId);

    if (!beforeEl || !afterEl) {
      console.warn(`[resizable] Panel element(s) not found for handle "${handleId}"`);
      return null;
    }

    return { beforePanel, afterPanel, beforeEl, afterEl, handleElement };
  }

  function startDrag(handleId: string): void {
    const container = containerRef.value;
    if (!container) return;

    const elements = locateDragElements(container, handleId, panels.value);
    if (!elements) return;

    beforePanelEl = elements.beforeEl;
    afterPanelEl = elements.afterEl;
    handleEl = elements.handleElement;

    cachedBeforePanel = elements.beforePanel;
    cachedAfterPanel = elements.afterPanel;

    originalBeforeSize = elements.beforePanel.pixelSize;
    originalAfterSize = elements.afterPanel.pixelSize;

    beforePanelLeft = parseFloat(beforePanelEl.style.insetInlineStart || '0');
    cachedContainerRect = container.getBoundingClientRect();

    Object.assign(dragState, {
      isActive: true,
      handleId,
      beforePanelId: elements.beforePanel.id,
      afterPanelId: elements.afterPanel.id,
      proposedBeforeSize: originalBeforeSize,
      proposedAfterSize: originalAfterSize,
    } satisfies DragStateActive);

    document.body.style.userSelect = 'none';
    document.body.style.cursor = direction.value === 'row' ? 'ew-resize' : 'ns-resize';

    attachDocumentListeners();
    onDragStart?.(handleId);
  }

  function computeDragPosition(
    event: PointerEvent,
    dir: ResizableDirection
  ): number {
    const rect = cachedContainerRect!;
    return dir === 'row' ? event.clientX - rect.left : event.clientY - rect.top;
  }

  function isDragMoveReady(): boolean {
    return (
      dragState.isActive &&
      !!containerRef.value &&
      !!beforePanelEl &&
      !!afterPanelEl &&
      !!dragState.handleId &&
      !!cachedBeforePanel &&
      !!cachedAfterPanel
    );
  }

  function onDragMove(event: PointerEvent): void {
    if (!isDragMoveReady()) return;

    const rawCursorPosition = computeDragPosition(event, direction.value);

    const result = resizeHandler.processResizeMove(
      rawCursorPosition,
      cachedBeforePanel!,
      cachedAfterPanel!,
      containerSize.value,
      dragState.handleId!,
      panels.value,
      beforePanelLeft
    );

    if (!result.isValidResize) return;

    if (dragState.proposedBeforeSize !== result.beforePanelSize) {
      dragState.proposedBeforeSize = result.beforePanelSize;
    }
    if (dragState.proposedAfterSize !== result.afterPanelSize) {
      dragState.proposedAfterSize = result.afterPanelSize;
    }

    const containerSizeValue = containerSize.value;
    const constrainedCursor = result.constrainedCursorPosition;
    const beforeRight = containerSizeValue - constrainedCursor;
    const handlePos = constrainedCursor - 2;

    const afterRight = containerSizeValue - constrainedCursor - result.afterPanelSize;

    applyPanelDragStyle(beforePanelEl!, beforePanelLeft, beforeRight);
    applyPanelDragStyle(afterPanelEl!, constrainedCursor, Math.max(0, afterRight));

    if (handleEl) {
      applyHandleDragStyle(handleEl, handlePos);
    }
  }

  function commitDrag(): void {
    if (!dragState.isActive) return;

    const beforePanelId = dragState.beforePanelId;
    const afterPanelId = dragState.afterPanelId;
    const beforeSize = dragState.proposedBeforeSize;
    const afterSize = dragState.proposedAfterSize;

    const capturedOriginalBeforeSize = originalBeforeSize;
    const capturedOriginalAfterSize = originalAfterSize;

    if (beforePanelEl) clearDragStyle(beforePanelEl);
    if (afterPanelEl) clearDragStyle(afterPanelEl);
    if (handleEl) clearHandleDragStyle(handleEl);

    cleanup();

    const sizesChanged = beforeSize !== capturedOriginalBeforeSize || afterSize !== capturedOriginalAfterSize;

    if (beforePanelId && afterPanelId) {
      onDragEnd(beforePanelId, afterPanelId, beforeSize, afterSize, sizesChanged);
    }
  }

  function cancelDrag(): void {
    if (!dragState.isActive) return;

    if (beforePanelEl && afterPanelEl) {
      clearDragStyle(beforePanelEl);
      clearDragStyle(afterPanelEl);
    }
    if (handleEl) {
      clearHandleDragStyle(handleEl);
    }

    cleanup();
  }

  function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && dragState.isActive) {
      event.preventDefault();
      cancelDrag();
    }
  }

  onUnmounted(() => {
    cancelDrag();
  });

  return {
    dragState,
    startDrag,
    onDragMove,
    commitDrag,
    cancelDrag,
    cleanup,
  };
}
