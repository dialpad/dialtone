import {
  useCallback,
  useEffect,
  useEffectEvent,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import { cx, type ClassValue } from '../../common/cx';
import {
  RESIZABLE_CONTEXT_KEY,
  buildHandleId,
  type CollapseRule,
  type ResizableContext,
  type ResizableDirection,
  type ResizableGroupState,
  type ResizablePanelConfig,
  type ResizablePanelState,
  type ResizableResetBehavior,
  type ResizableStorageAdapter,
  type ResizableStoragePanelData,
} from './ResizableConstants';
import type { CollapseOptions } from './Composables/UseResizablePanelControls';
import type { ResizableKeyboardMessages } from './Composables/UseResizableKeyboard';
import {
  useResizablePanelControls,
  checkAutoCollapseRules,
} from './Composables/UseResizablePanelControls';
import { useResizableGroup } from './Composables/UseResizableGroup';
import { useResizeHandling } from './Composables/UseResizableCalculations';
import { useResizableAnnouncements } from './Composables/UseResizableAnnouncements';
import { useResizableOffset } from './Composables/UseResizableOffset';
import { useResizableDrag } from './Composables/UseResizableDrag';

export type ResizableSpaceAllocationStrategy = 'proportional' | 'preserve-manual';

/** What the default slot receives when it's a function: Vue's scoped slot props. */
export interface DtResizableSlotScope {
  panels: ResizablePanelState[];
  direction: ResizableDirection;
  isResizing: boolean;
  spaceAllocationStrategy: ResizableSpaceAllocationStrategy;
  resizePanel: (panelId: string, newPixelSize: number) => void;
  collapsePanel: (panelId: string, collapsed: boolean, options?: CollapseOptions) => void;
  startResize: (handleId: string) => void;
  stopResize: () => void;
}

/** What a `ref` on DtResizable receives: Vue's exposed methods and state. */
export interface DtResizableInstance {
  resizePanel: (panelId: string, newPixelSize: number) => void;
  collapsePanel: (panelId: string, collapsed: boolean, options?: CollapseOptions) => void;
  resetPanels: (beforePanelId?: string, afterPanelId?: string, behavior?: ResizableResetBehavior) => void;
  readonly state: ResizableGroupState;
  readonly panelConfigs: ResizablePanelConfig[];
  readonly allocationStrategy: ResizableSpaceAllocationStrategy;
}

interface DtResizableOwnProps {
  /**
   * Layout direction. 'row' for horizontal, 'column' for vertical.
   * @values 'row', 'column'
   */
  direction?: ResizableDirection;

  /** localStorage key for persisting panel sizes across page loads. Read when the component mounts. */
  storageKey?: string | null;

  /** Additional CSS classes applied to the container element. */
  className?: ClassValue;

  /**
   * Panel configurations array. When provided, panels are initialized
   * from this array instead of registering via child DtResizablePanel components.
   */
  panels?: ResizablePanelConfig[];

  /**
   * Strategy for redistributing space when panels open/close.
   * @values 'proportional', 'preserve-manual'
   */
  spaceAllocationStrategy?: ResizableSpaceAllocationStrategy;

  /** Rules defining which panels collapse first when space is constrained */
  collapseRules?: CollapseRule[];

  /** Custom storage adapter. Overrides storageKey when both are provided. Read when the component mounts. */
  storage?: ResizableStorageAdapter | null;

  /** CSS selector for a fixed element to offset handles and panel content from. */
  offsetElement?: string | null;

  /** Explicit pixel offset. Overrides offsetElement measurement when both provided. */
  offsetAmount?: number | null;

  /**
   * Which edge(s) the offset applies to.
   * @values 'start', 'end', 'both'
   */
  offsetDirection?: 'start' | 'end' | 'both';

  /**
   * i18n message overrides for screen reader announcements.
   * Accepts keys from ResizableKeyboardMessages.
   */
  messages?: ResizableKeyboardMessages;

  /** Container for panels and handles, or a function of the group's state (Vue's scoped slot). */
  children?: ReactNode | ((scope: DtResizableSlotScope) => ReactNode);

  /** Called when a panel is resized, with (panelId, size). */
  onPanelResize?: (panelId: string, size: number) => void;

  /** Called when a panel collapses or expands, with (panelId, collapsed). */
  onPanelCollapse?: (panelId: string, collapsed: boolean) => void;

  /** Called when a resize drag begins, with (handleId). */
  onResizeStart?: (handleId: string) => void;

  /** Called when a resize drag ends, with (handleId). */
  onResizeEnd?: (handleId: string) => void;

  /** Vue's exposed methods and state. */
  ref?: Ref<DtResizableInstance>;
}

export type DtResizableProps = DtResizableOwnProps
  & Omit<HTMLAttributes<HTMLDivElement>, keyof DtResizableOwnProps>;

/**
 * A container of resizable panels, separated by draggable handles.
 */
export function DtResizable ({
  direction = 'row',
  storageKey = null,
  className = '',
  panels = [],
  spaceAllocationStrategy = 'proportional',
  collapseRules = [],
  storage = null,
  offsetElement = null,
  offsetAmount = null,
  offsetDirection = 'start',
  messages = {},
  children,
  onPanelResize,
  onPanelCollapse,
  onResizeStart,
  onResizeEnd,
  ref,
  ...attrs
}: DtResizableProps) {
  // The consumer's callbacks, for operations that run outside a render (document listeners, effects).
  const callbacks = useRef({ onPanelResize, onPanelCollapse, onResizeStart, onResizeEnd });
  useLayoutEffect(() => {
    callbacks.current = { onPanelResize, onPanelCollapse, onResizeStart, onResizeEnd };
  });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerElement, setContainerElement] = useState<HTMLDivElement | null>(null);
  const setContainer = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
    setContainerElement(el);
  }, []);

  // storageKey and storage are read once, when the component mounts, as in Vue.
  const group = useResizableGroup({
    storageKey: storageKey ?? null,
    direction,
    containerElement,
    storageAdapter: storage ?? undefined,
  });

  const [isResizing, setIsResizing] = useState(false);
  const [activeHandleId, setActiveHandleId] = useState<string | undefined>(undefined);

  const resizeHandler = useResizeHandling(group.getContainerSize);

  const {
    commitPanelSize,
    resizePanel,
    collapsePanel,
    resetPanels: originalResetPanels,
    processAutoCollapseExpand,
  } = useResizablePanelControls({
    panels: group.getPanels,
    containerSize: group.getContainerSize,
    containerRef,
    onPanelResize: (panelId, size) => callbacks.current.onPanelResize?.(panelId, size),
    onPanelCollapse: (panelId, collapsed) => callbacks.current.onPanelCollapse?.(panelId, collapsed),
    updateSavedPanel: group.updateSavedPanel,
  });

  function resetPanels (beforePanelId?: string, afterPanelId?: string, behavior: ResizableResetBehavior = 'all') {
    originalResetPanels(beforePanelId, afterPanelId, behavior);

    if (behavior === 'all') {
      group.getPanels().forEach(p => group.updateSavedPanel(p.id, { manualTargetRatio: undefined }));
      group.clearSavedState();
    } else {
      if (beforePanelId) group.updateSavedPanel(beforePanelId, { manualTargetRatio: undefined });
      if (afterPanelId) group.updateSavedPanel(afterPanelId, { manualTargetRatio: undefined });
    }
  }

  function processAutoCollapse () {
    processAutoCollapseExpand();
    if (!collapseRules?.length) return;
    const current = group.getPanels();
    const panelsToCollapse = checkAutoCollapseRules(current, collapseRules, group.getContainerSize());
    if (panelsToCollapse.length === 0) return;
    const panel = current.find(p => p.id === panelsToCollapse[0]);
    if (panel && !panel.collapsed) collapsePanel(panelsToCollapse[0], true);
  }

  const { announce } = useResizableAnnouncements();

  const offset = useResizableOffset({ offsetElement, offsetAmount, offsetDirection, direction });

  // Vue keeps a set of the mounted handles; nothing reads it, but handles register as they do there.
  const [handleInstances] = useState(() => new Set<unknown>());
  const registerHandle = useCallback((inst: unknown) => { handleInstances.add(inst); }, [handleInstances]);
  const unregisterHandle = useCallback((inst: unknown) => { handleInstances.delete(inst); }, [handleInstances]);

  const drag = useResizableDrag({
    direction,
    containerRef,
    panels: group.getPanels,
    containerSize: group.getContainerSize,
    resizeHandler,
    onDragStart (handleId) {
      setIsResizing(true);
      setActiveHandleId(handleId);
      callbacks.current.onResizeStart?.(handleId);
    },
    onDragEnd (beforePanelId, afterPanelId, beforeSize, afterSize, sizesChanged) {
      const handleId = buildHandleId(beforePanelId, afterPanelId);
      setIsResizing(false);
      setActiveHandleId(undefined);

      if (sizesChanged) {
        commitPanelSize(beforePanelId, beforeSize);
        commitPanelSize(afterPanelId, afterSize);

        callbacks.current.onResizeEnd?.(handleId);
        processAutoCollapse();
      }
    },
  });

  function startResize (handleId: string) { drag.startDrag(handleId); }
  function stopResize () { drag.cancelDrag(); }
  function savePanelsToStorage () { group.saveCurrentLayout(group.getPanels()); }
  function emitPanelResize (panelId: string, size: number) { callbacks.current.onPanelResize?.(panelId, size); }

  // Vue's post-flush watcher on the synced panels: after every layout change, collapse or expand what the container's
  // size and the collapse rules call for.
  const onPanelsChange = useEffectEvent(() => {
    if (group.syncedPanels.length > 0 && !group.isInitializing) processAutoCollapse();
  });
  useEffect(() => {
    onPanelsChange();
  }, [group.syncedPanels]);

  // Single context object for child components
  const context: ResizableContext = {
    layout: group.layout,
    panels: group.syncedPanels,
    panelMap: group.panelMap,
    direction,
    containerSize: group.containerSize,
    containerElement,
    isResizing,
    activeHandleId,
    isInitializing: group.isInitializing,
    messages: messages as Record<string, string>,
    startResize,
    resetPanels,
    registerHandle,
    unregisterHandle,
    registerPanel: group.registerPanel,
    unregisterPanel: group.unregisterPanel,
    saveToStorage: savePanelsToStorage,
    announce,
    offsetHandleStyles: offset.handleStyles,
    offsetContentStyles: offset.contentStyles,
    collapsePanel,
    emitPanelResize,
    commitPanelSize,
    updateSavedPanel: (panelId: string, updates: Partial<ResizableStoragePanelData>) =>
      group.updateSavedPanel(panelId, updates),
  };

  // Methods for programmatic control
  useImperativeHandle(ref, () => ({
    resizePanel,
    collapsePanel,
    resetPanels,
    state: {
      direction,
      panels: group.syncedPanels,
      containerSize: group.containerSize,
      isResizing,
      activeHandleId,
    },
    panelConfigs: panels,
    allocationStrategy: spaceAllocationStrategy,
  }));

  const scope: DtResizableSlotScope = {
    panels: group.syncedPanels,
    direction,
    isResizing,
    spaceAllocationStrategy,
    resizePanel,
    collapsePanel,
    startResize,
    stopResize,
  };

  return (
    <RESIZABLE_CONTEXT_KEY.Provider value={context}>
      <div
        ref={setContainer}
        className={cx(
          'd-resizable',
          `d-resizable--${direction}`,
          { 'd-resizable--resizing': isResizing },
          className,
        )}
        data-storage-key={storageKey || undefined}
        {...attrs}
      >
        {typeof children === 'function' ? children(scope) : children}
      </div>
    </RESIZABLE_CONTEXT_KEY.Provider>
  );
}
