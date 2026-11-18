/**
 * useResizableDrag — Per-group drag state hook
 *
 * Each DtResizable instance gets its own drag state, so nested groups can
 * drag independently without conflict.
 *
 * Key design: shadow state during drag.
 * - proposedBeforeSize / proposedAfterSize track the "what-if" layout during the drag.
 * - These are applied directly to DOM elements as inline styles (performance).
 * - The layout state is NOT changed during drag.
 * - On commit (pointerup / pointercancel): onDragEnd callback receives the final sizes.
 * - On cancel (Escape / unmount): inline styles are restored, DOM returns to layout state.
 */

import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import type { ResizableDirection, ResizablePanelState } from '../ResizableConstants';
import { RESIZABLE_HANDLE_CENTER_OFFSET_PX } from '../ResizableConstants';
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

const IDLE_STATE: DragStateIdle = {
  isActive: false,
  handleId: null,
  beforePanelId: null,
  afterPanelId: null,
  proposedBeforeSize: 0,
  proposedAfterSize: 0,
};

/** Vue passes refs; the port passes the current direction, and getters for what operations change. */
export interface UseResizableDragOptions {
  direction: ResizableDirection;
  containerRef: RefObject<HTMLElement | null>;
  panels: () => ResizablePanelState[];
  containerSize: () => number;
  resizeHandler: ResizeHandler;
  onDragEnd: (
    beforePanelId: string,
    afterPanelId: string,
    beforeSize: number,
    afterSize: number,
    sizesChanged: boolean,
  ) => void;
  onDragStart?: (handleId: string) => void;
}

// ============================================================================
// DOM HELPERS
// ============================================================================

function findPanelElement (container: HTMLElement, panelId: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-panel-id="${panelId}"]`);
}

function findHandleElement (container: HTMLElement, handleId: string): HTMLElement | null {
  return container.querySelector<HTMLElement>(`[data-handle-id="${handleId}"]`);
}

const DRAG_STYLE_PROPS = ['insetInlineStart', 'insetInlineEnd', 'inlineSize'] as const;
type DragStyleProp = typeof DRAG_STYLE_PROPS[number];
type InlineStyles = Partial<Record<DragStyleProp, string>>;

/** The inline values a drag is about to overwrite: React's, which it won't set again unless they change. */
function snapshotStyle (element: HTMLElement): InlineStyles {
  const style = element.style as unknown as Record<DragStyleProp, string | undefined>;
  return Object.fromEntries(DRAG_STYLE_PROPS.map(prop => [prop, style[prop] ?? ''])) as InlineStyles;
}

function restoreStyle (element: HTMLElement, snapshot: InlineStyles): void {
  const style = element.style as unknown as Record<DragStyleProp, string>;
  for (const prop of DRAG_STYLE_PROPS) style[prop] = snapshot[prop] ?? '';
}

function applyPanelDragStyle (element: HTMLElement, start: number, end: number): void {
  element.style.insetInlineStart = `${start}px`;
  element.style.insetInlineEnd = `${end}px`;
  element.style.inlineSize = '';
}

function applyHandleDragStyle (element: HTMLElement, position: number): void {
  element.style.insetInlineStart = `${Math.max(0, position)}px`;
}

// ============================================================================
// PANEL LOOKUP
// ============================================================================

/**
 * Find the before/after panel pair for a given handle ID.
 * Handle IDs are formatted as "{beforePanelId}:{afterPanelId}".
 */
export function findPanelsForHandle (
  handleId: string,
  panels: ResizablePanelState[],
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
// HOOK
// ============================================================================

interface DragSession {
  beforePanelEl: HTMLElement;
  afterPanelEl: HTMLElement;
  handleEl: HTMLElement | null;
  beforeStyle: InlineStyles;
  afterStyle: InlineStyles;
  handleStyle: InlineStyles;
  cachedBeforePanel: ResizablePanelState;
  cachedAfterPanel: ResizablePanelState;
  originalBeforeSize: number;
  originalAfterSize: number;
  beforePanelLeft: number;
  cachedContainerRect: DOMRect;
  pointerMove: (e: PointerEvent) => void;
  pointerUp: () => void;
  keydown: (e: KeyboardEvent) => void;
}

export function useResizableDrag (options: UseResizableDragOptions) {
  // The document listeners a drag adds outlive the render that started it, so they read the latest options.
  const latest = useRef(options);
  useLayoutEffect(() => {
    latest.current = options;
  });

  const dragState = useRef<DragState>({ ...IDLE_STATE });
  const session = useRef<DragSession | null>(null);

  function removeDocumentListeners (current: DragSession): void {
    document.removeEventListener('pointermove', current.pointerMove);
    document.removeEventListener('pointerup', current.pointerUp);
    document.removeEventListener('pointercancel', current.pointerUp);
    document.removeEventListener('keydown', current.keydown);
  }

  function cleanup (): void {
    if (session.current) removeDocumentListeners(session.current);

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    dragState.current = { ...IDLE_STATE };
    session.current = null;
  }

  function restoreDragStyles (current: DragSession): void {
    restoreStyle(current.beforePanelEl, current.beforeStyle);
    restoreStyle(current.afterPanelEl, current.afterStyle);
    if (current.handleEl) restoreStyle(current.handleEl, current.handleStyle);
  }

  function locateDragElements (
    container: HTMLElement,
    handleId: string,
    panelList: ResizablePanelState[],
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

  function startDrag (handleId: string): void {
    const { containerRef, panels, direction } = latest.current;
    const container = containerRef.current;
    if (!container) return;
    // A second pointerdown during a drag replaces it, rather than leaking the first one's listeners.
    if (session.current) cancelDrag();

    const elements = locateDragElements(container, handleId, panels());
    if (!elements) return;

    const current: DragSession = {
      beforePanelEl: elements.beforeEl,
      afterPanelEl: elements.afterEl,
      handleEl: elements.handleElement,
      beforeStyle: snapshotStyle(elements.beforeEl),
      afterStyle: snapshotStyle(elements.afterEl),
      handleStyle: elements.handleElement ? snapshotStyle(elements.handleElement) : {},
      cachedBeforePanel: elements.beforePanel,
      cachedAfterPanel: elements.afterPanel,
      originalBeforeSize: elements.beforePanel.pixelSize,
      originalAfterSize: elements.afterPanel.pixelSize,
      beforePanelLeft: parseFloat(elements.beforeEl.style.insetInlineStart || '0'),
      cachedContainerRect: container.getBoundingClientRect(),
      pointerMove: (e: PointerEvent) => onDragMove(e),
      pointerUp: () => commitDrag(),
      keydown: (e: KeyboardEvent) => handleKeydown(e),
    };
    session.current = current;

    dragState.current = {
      isActive: true,
      handleId,
      beforePanelId: elements.beforePanel.id,
      afterPanelId: elements.afterPanel.id,
      proposedBeforeSize: current.originalBeforeSize,
      proposedAfterSize: current.originalAfterSize,
    };

    document.body.style.userSelect = 'none';
    document.body.style.cursor = direction === 'row' ? 'ew-resize' : 'ns-resize';

    document.addEventListener('pointermove', current.pointerMove);
    document.addEventListener('pointerup', current.pointerUp);
    document.addEventListener('pointercancel', current.pointerUp);
    document.addEventListener('keydown', current.keydown);

    latest.current.onDragStart?.(handleId);
  }

  function computeDragPosition (event: PointerEvent, dir: ResizableDirection, rect: DOMRect): number {
    return dir === 'row' ? event.clientX - rect.left : event.clientY - rect.top;
  }

  function onDragMove (event: PointerEvent): void {
    const current = session.current;
    const state = dragState.current;
    const { containerRef, direction, resizeHandler, containerSize, panels } = latest.current;
    if (!current || !state.isActive || !containerRef.current) return;

    const rawCursorPosition = computeDragPosition(event, direction, current.cachedContainerRect);

    const result = resizeHandler.processResizeMove(
      rawCursorPosition,
      current.cachedBeforePanel,
      current.cachedAfterPanel,
      containerSize(),
      state.handleId,
      panels(),
      current.beforePanelLeft,
    );

    if (!result.isValidResize) return;

    state.proposedBeforeSize = result.beforePanelSize;
    state.proposedAfterSize = result.afterPanelSize;

    const containerSizeValue = containerSize();
    const constrainedCursor = result.constrainedCursorPosition;
    const beforeRight = containerSizeValue - constrainedCursor;
    const handlePos = constrainedCursor - RESIZABLE_HANDLE_CENTER_OFFSET_PX;

    const afterRight = containerSizeValue - constrainedCursor - result.afterPanelSize;

    applyPanelDragStyle(current.beforePanelEl, current.beforePanelLeft, beforeRight);
    applyPanelDragStyle(current.afterPanelEl, constrainedCursor, Math.max(0, afterRight));

    if (current.handleEl) {
      applyHandleDragStyle(current.handleEl, handlePos);
    }
  }

  function commitDrag (): void {
    const current = session.current;
    const state = dragState.current;
    if (!current || !state.isActive) return;

    const { beforePanelId, afterPanelId, proposedBeforeSize: beforeSize, proposedAfterSize: afterSize } = state;

    restoreDragStyles(current);
    cleanup();

    const sizesChanged = beforeSize !== current.originalBeforeSize || afterSize !== current.originalAfterSize;

    latest.current.onDragEnd(beforePanelId, afterPanelId, beforeSize, afterSize, sizesChanged);
  }

  function cancelDrag (): void {
    const current = session.current;
    if (!current || !dragState.current.isActive) return;

    restoreDragStyles(current);
    cleanup();
  }

  function handleKeydown (event: KeyboardEvent): void {
    if (event.key === 'Escape' && dragState.current.isActive) {
      event.preventDefault();
      cancelDrag();
    }
  }

  // Vue's onUnmounted. cancelDrag reads refs only, so the first render's copy does what the last one's would.
  const cancelOnUnmount = useRef(cancelDrag);
  useEffect(() => {
    const cancel = cancelOnUnmount.current;
    return () => cancel();
  }, []);

  return {
    dragState,
    startDrag,
    onDragMove,
    commitDrag,
    cancelDrag,
    cleanup,
  };
}
