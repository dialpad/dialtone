/**
 * useResizableGroup — Layout Controller
 *
 * Responsibilities:
 * - Maintain the registered panels (panels call registerPanel/unregisterPanel)
 * - Track the container size via a ResizeObserver
 * - Load saved state ONCE, when the group is created
 * - Derive `layout` (computeLayout()) and `syncedPanels` (ResizablePanelState[]) from those
 *
 * Vue keeps these in refs and computeds, so an operation that updates the saved state and then reads the panels sees
 * its own update straight away (resetting all panel pairs, collapsing). The port keeps the same values in state for
 * rendering, and a synchronous copy for operations: `getPanels()` and `getContainerSize()` read that copy, derived
 * the same way, so a sequence of operations in one event behaves as it does in Vue.
 *
 * @see ComputeLayout.ts — the pure layout engine
 */

import { useCallback, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import type {
  ResizablePanelConfig,
  ResizablePanelState,
  ResizableDirection,
  ResizableStorageAdapter,
} from '../ResizableConstants';
import type { LayoutResult } from './ComputeLayout';
import type { SavedPanelData } from './UseResizableStorage';
import { computeLayout } from './ComputeLayout';
import { useResizableStorage } from './UseResizableStorage';
import { calculateConstraintHierarchy } from './ConstraintResolver';
import { validateContainerSize } from '../ResizableUtils';

// ============================================================================
// OPTIONS
// ============================================================================

export interface UseResizableGroupOptions {
  /** Read once, when the group is created, as in Vue. */
  storageKey: string | null;
  direction: ResizableDirection;
  /** The container element: state the caller sets from a callback ref, so the group follows it. */
  containerElement: HTMLElement | null;
  /** Custom storage adapter. Overrides storageKey when provided. Read once, when the group is created. */
  storageAdapter?: ResizableStorageAdapter;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Clamp a container dimension to a valid range. Delegates to the shared utility. */
const clampContainerSize = validateContainerSize;

/**
 * Build a `ResizablePanelState` from a panel config + the layout result.
 * Reads `manualTargetRatio` and `autoCollapsed` from savedState.
 */
function buildPanelState (
  config: ResizablePanelConfig,
  containerSize: number,
  layoutResult: LayoutResult,
  saved: SavedPanelData | undefined,
): ResizablePanelState {
  const position = layoutResult.panels.get(config.id);
  const constraints = position?.constraints ?? calculateConstraintHierarchy(config, containerSize);

  const pixelSize = position?.width ?? 0;
  const collapsed = position?.collapsed ?? Boolean(config.collapsed);

  return {
    ...config,
    pixelSize,
    collapsed,
    userMinSizePixels: constraints.userMinSizePixels,
    userMaxSizePixels: constraints.userMaxSizePixels,
    systemMinSizePixels: constraints.systemMinSizePixels,
    systemMaxSizePixels: constraints.systemMaxSizePixels,
    collapseSizePixels: constraints.collapseSizePixels,
    manualTargetRatio: saved?.manualTargetRatio,
    autoCollapsed: saved?.autoCollapsed,
  };
}

/** What the group's derived values are computed from. A new object whenever any of them changes. */
interface GroupSource {
  registered: ResizablePanelConfig[];
  containerSize: number;
  savedState: SavedPanelData[] | null;
}

interface GroupDerived {
  layout: LayoutResult;
  syncedPanels: ResizablePanelState[];
  panelMap: Map<string, ResizablePanelState>;
}

function derive ({ registered, containerSize, savedState }: GroupSource): GroupDerived {
  const layout: LayoutResult = registered.length === 0 || containerSize <= 0
    ? { panels: new Map(), handles: [] }
    : computeLayout({ panels: registered, containerSize, savedState: savedState ?? undefined });

  const savedMap = new Map(savedState?.map(s => [s.id, s]) ?? []);
  const syncedPanels = registered.map(config =>
    buildPanelState(config, containerSize, layout, savedMap.get(config.id)));

  const panelMap = new Map<string, ResizablePanelState>();
  for (const p of syncedPanels) panelMap.set(p.id, p);

  return { layout, syncedPanels, panelMap };
}

// ============================================================================
// HOOK
// ============================================================================

export function useResizableGroup (options: UseResizableGroupOptions) {
  const { direction, containerElement } = options;

  // ── Storage (captured when the group is created, as Vue's setup does) ──────
  const [initial] = useState(() => ({ storageKey: options.storageKey, storageAdapter: options.storageAdapter }));
  const storage = useResizableStorage(initial.storageKey, initial.storageAdapter);

  // ── Source state, and its synchronous copy for operations ─────────────────
  const [source, setSourceState] = useState<GroupSource>(() => ({
    registered: [],
    containerSize: 0,
    savedState: storage.loadFromStorage(),
  }));
  const live = useRef(source);

  const update = useCallback((changes: Partial<GroupSource>) => {
    live.current = { ...live.current, ...changes };
    setSourceState(live.current);
  }, []);

  // One derivation per source object, shared by rendering and operations (Vue's computed cache).
  const cache = useRef<{ source: GroupSource; derived: GroupDerived } | null>(null);
  const derived = useCallback((from: GroupSource): GroupDerived => {
    if (cache.current?.source !== from) cache.current = { source: from, derived: derive(from) };
    return cache.current.derived;
  }, []);

  const { layout, syncedPanels, panelMap } = derived(source);
  const containerSize = source.containerSize;

  /** The panels as of the latest operation. */
  const getPanels = useCallback(() => derived(live.current).syncedPanels, [derived]);
  /** The container size as of the latest measurement. */
  const getContainerSize = useCallback(() => live.current.containerSize, []);

  // ── isInitializing: true until the first layout with panels ───────────────
  const [isInitializing, setIsInitializing] = useState(true);
  if (isInitializing && layout.panels.size > 0) setIsInitializing(false);

  // ── Panel registration ──────────────────────────────────────────────────────

  const sortPending = useRef(false);

  const registerPanel = useCallback((config: ResizablePanelConfig): void => {
    if (config.id.includes(':')) {
      console.warn(
        `[resizable] Panel id "${config.id}" contains ':' which is reserved as the handle separator. Use kebab-case.`,
      );
    }

    const registered = live.current.registered;
    const index = registered.findIndex(p => p.id === config.id);
    if (index !== -1) {
      update({ registered: registered.map((p, i) => (i === index ? config : p)) });
    } else {
      update({ registered: [...registered, config] });
      // Sorted once the container has its panels in the DOM (Vue's nextTick), in the layout effect below.
      sortPending.current = true;
    }
  }, [update]);

  const unregisterPanel = useCallback((id: string): void => {
    update({ registered: live.current.registered.filter(p => p.id !== id) });
  }, [update]);

  // Panels register in their own layout effects, which run before this one, so the container holds them by now. On
  // mount the container element arrives a render later (it's state), so the sort waits for it.
  useLayoutEffect(() => {
    if (!sortPending.current || !containerElement) return;
    sortPending.current = false;
    update({ registered: sortByDOMOrder(live.current.registered, containerElement) });
  });

  // ── Storage operations ──────────────────────────────────────────────────────

  const saveCurrentLayout = useCallback((panels: ResizablePanelState[]): void => {
    storage.saveToStorage(panels);
    update({
      savedState: panels.map(p => ({
        id: p.id,
        pixelSize: p.pixelSize,
        collapsed: p.collapsed,
        autoCollapsed: p.autoCollapsed,
        manualTargetRatio: p.manualTargetRatio,
      })),
    });
  }, [storage, update]);

  const updateSavedPanel = useCallback((panelId: string, updates: Partial<SavedPanelData>): void => {
    const savedState = [...(live.current.savedState ?? [])];
    const idx = savedState.findIndex(s => s.id === panelId);
    if (idx >= 0) {
      savedState[idx] = { ...savedState[idx], ...updates };
    } else {
      // Use current computed size as default, not 0
      const currentPanel = getPanels().find(p => p.id === panelId);
      const currentSize = currentPanel?.pixelSize ?? 0;
      savedState.push({ id: panelId, pixelSize: currentSize, ...updates });
    }
    update({ savedState });

    // Persist to external storage
    storage.saveToStorage(savedState);
  }, [getPanels, storage, update]);

  const reloadFromStorage = useCallback((): void => {
    update({ savedState: storage.loadFromStorage() });
  }, [storage, update]);

  const clearSavedState = useCallback((): void => {
    storage.clearStorage();
    update({ savedState: null });
  }, [storage, update]);

  // ── ResizeObserver ─────────────────────────────────────────────────────────

  const observer = useRef<ResizeObserver | null>(null);

  const measure = useEffectEvent((el: HTMLElement) => (direction === 'row' ? el.clientWidth : el.clientHeight));
  const onResize = useEffectEvent((entries: ResizeObserverEntry[]) => {
    for (const entry of entries) {
      const dim = direction === 'row' ? entry.contentRect.width : entry.contentRect.height;
      update({ containerSize: clampContainerSize(Math.round(dim)) });
    }
  });

  // Vue measures when the container element changes, then follows the ResizeObserver; a change of direction alone
  // doesn't re-measure there either.
  useLayoutEffect(() => {
    if (!containerElement) return;
    update({ containerSize: clampContainerSize(measure(containerElement)) });
    // Guard against SSR, where ResizeObserver is not defined.
    if (typeof ResizeObserver === 'undefined') return;
    const resizeObserver = new ResizeObserver(entries => onResize(entries));
    resizeObserver.observe(containerElement);
    observer.current = resizeObserver;
    return () => {
      resizeObserver.disconnect();
      if (observer.current === resizeObserver) observer.current = null;
    };
  }, [containerElement, update]);

  const disconnectObserver = useCallback((): void => {
    observer.current?.disconnect();
  }, []);

  // ── Expose ─────────────────────────────────────────────────────────────────

  return {
    layout,
    syncedPanels,
    panelMap,
    containerSize,
    isInitializing,

    getPanels,
    getContainerSize,

    registerPanel,
    unregisterPanel,

    saveCurrentLayout,
    updateSavedPanel,
    reloadFromStorage,
    clearSavedState,

    disconnectObserver,
  };
}

/**
 * Sort panel configs to match DOM order inside the container element.
 */
function sortByDOMOrder (panels: ResizablePanelConfig[], container: HTMLElement | null): ResizablePanelConfig[] {
  if (!container) return panels;

  const panelElements = Array.from(container.querySelectorAll<HTMLElement>('.d-resizable-panel[data-panel-id]'));
  if (panelElements.length === 0) return panels;

  const domOrder = new Map<string, number>();
  panelElements.forEach((el, i) => {
    const id = el.getAttribute('data-panel-id');
    if (id) domOrder.set(id, i);
  });

  return [...panels].sort((a, b) => {
    const aPos = domOrder.get(a.id) ?? Infinity;
    const bPos = domOrder.get(b.id) ?? Infinity;
    return aPos - bPos;
  });
}
