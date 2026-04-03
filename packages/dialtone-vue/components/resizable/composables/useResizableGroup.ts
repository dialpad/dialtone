/**
 * useResizableGroup — Reactive Layout Controller
 *
 * Replaces the timer-based initialization flow with a Vue `computed` that
 * re-runs synchronously whenever panels or the container size change.
 *
 * Responsibilities:
 * - Maintain the `registeredPanels` ref (panels call registerPanel/unregisterPanel)
 * - Track `containerSize` via a ResizeObserver (set up here, not in the component)
 * - Load saved state ONCE synchronously at creation time
 * - Expose `layout` computed that calls `computeLayout()`
 * - Expose `syncedPanels` computed that converts `LayoutResult` to `ResizablePanelState[]`
 *
 * @see computeLayout.ts — the pure layout engine
 */

import { ref, computed, watch, nextTick, type ComputedRef, type Ref } from 'vue';
import type { ResizablePanelConfig, ResizablePanelState, ResizableDirection } from '../resizable_constants';
import type { LayoutResult } from './computeLayout';
import type { SavedPanelData } from './useResizableStorage';
import { computeLayout } from './computeLayout';
import { useResizableStorage } from './useResizableStorage';
import { calculateConstraintHierarchy } from './constraintResolver';
import { validateContainerSize } from '../resizable_utils';

// ============================================================================
// OPTIONS
// ============================================================================

export interface UseResizableGroupOptions {
  storageKey: string | null;
  direction: ComputedRef<ResizableDirection>;
  containerRef: Ref<HTMLElement | null>;
  /** Custom storage adapter. Overrides storageKey when provided. */
  storageAdapter?: import('../resizable_constants').ResizableStorageAdapter;
}

// ============================================================================
// HELPERS
// ============================================================================

/** Clamp a container dimension to a valid range. Delegates to the shared utility. */
const clampContainerSize = validateContainerSize;

/**
 * Extract mutable runtime fields from existing panel state.
 * These are preserved across layout recomputes so drag/collapse don't lose
 * in-flight values.
 */
function extractRuntimeFields(existingState: ResizablePanelState | undefined): {
  locked: boolean;
  manualTargetRatio: number | undefined;
  isPeeking: boolean | undefined;
} {
  return {
    locked: existingState?.locked ?? false,
    manualTargetRatio: existingState?.manualTargetRatio,
    isPeeking: existingState?.isPeeking,
  };
}

/**
 * Build a `ResizablePanelState` from a panel config + the layout result.
 */
function buildPanelState(
  config: ResizablePanelConfig,
  containerSize: number,
  layoutResult: LayoutResult,
  existingState: ResizablePanelState | undefined
): ResizablePanelState {
  const position = layoutResult.panels.get(config.id);
  const constraints = position?.constraints ?? calculateConstraintHierarchy(config, containerSize);

  const pixelSize = position?.width ?? 0;
  const collapsed = position?.collapsed ?? Boolean(config.collapsed);

  const runtime = extractRuntimeFields(existingState);

  return {
    ...config,
    pixelSize,
    collapsed,
    locked: runtime.locked,
    userMinSizePixels: constraints.userMinSizePixels,
    userMaxSizePixels: constraints.userMaxSizePixels,
    systemMinSizePixels: constraints.systemMinSizePixels,
    systemMaxSizePixels: constraints.systemMaxSizePixels,
    collapseSizePixels: constraints.collapseSizePixels,
    manualTargetRatio: runtime.manualTargetRatio,
    autoCollapsed: existingState?.autoCollapsed,
    isPeeking: runtime.isPeeking,
  };
}

// ============================================================================
// COMPOSABLE
// ============================================================================

export function useResizableGroup(options: UseResizableGroupOptions) {
  const { storageKey, direction, containerRef } = options;

  // ── Panel registry ──────────────────────────────────────────────────────────
  const registeredPanels = ref<ResizablePanelConfig[]>([]);

  // ── Container size ──────────────────────────────────────────────────────────
  const containerSize = ref(0);

  // ── Storage ─────────────────────────────────────────────────────────────────
  const storage = useResizableStorage(storageKey, options.storageAdapter);
  const savedState = ref<SavedPanelData[] | null>(storage.loadFromStorage());

  // ── isInitializing ─────────────────────────────────────────────────────────
  const isInitializing = ref(true);

  // ── Per-panel mutable state (not owned by computeLayout) ──────────────────
  const panelRuntimeState = new Map<
    string,
    {
      locked: boolean;
      manualTargetRatio?: number;
      isPeeking?: boolean;
    }
  >();

  // ── Layout computed ─────────────────────────────────────────────────────────
  const layout = computed((): LayoutResult => {
    const panels = registeredPanels.value;
    const size = containerSize.value;

    if (panels.length === 0 || size <= 0) {
      return { panels: new Map(), handles: [] };
    }

    const augmentedSavedState: SavedPanelData[] | undefined = savedState.value
      ? savedState.value.map(s => ({
          ...s,
          manualTargetRatio: panelRuntimeState.get(s.id)?.manualTargetRatio,
        }))
      : undefined;

    return computeLayout({
      panels,
      containerSize: size,
      savedState: augmentedSavedState,
    });
  });

  // ── syncedPanels computed ───────────────────────────────────────────────────
  const syncedPanels = computed((): ResizablePanelState[] => {
    const result = layout.value;
    const size = containerSize.value;

    return registeredPanels.value.map(config => {
      const position = result.panels.get(config.id);
      const runtime = panelRuntimeState.get(config.id);
      const saved = savedState.value?.find(s => s.id === config.id);
      const existingState: ResizablePanelState | undefined = runtime
        ? {
            ...config,
            pixelSize: position?.width ?? 0,
            collapsed: position?.collapsed ?? false,
            locked: runtime.locked,
            manualTargetRatio: runtime.manualTargetRatio,
            autoCollapsed: saved?.autoCollapsed,
            isPeeking: runtime.isPeeking,
          }
        : undefined;

      return buildPanelState(config, size, result, existingState);
    });
  });

  // Flip isInitializing to false after first successful layout
  watch(
    layout,
    result => {
      if (result.panels.size > 0 && isInitializing.value) {
        isInitializing.value = false;
      }
    },
    { immediate: true }
  );

  // ── Panel registration ──────────────────────────────────────────────────────

  let sortScheduled = false;

  function registerPanel(config: ResizablePanelConfig): void {
    if (config.id.includes(':')) {
      console.warn(
        `[resizable] Panel id "${config.id}" contains ':' which is reserved as the handle separator. Use kebab-case.`
      );
    }

    const index = registeredPanels.value.findIndex(p => p.id === config.id);
    if (index !== -1) {
      registeredPanels.value = registeredPanels.value.map((p, i) => (i === index ? config : p));
    } else {
      registeredPanels.value = [...registeredPanels.value, config];
      if (!panelRuntimeState.has(config.id)) {
        panelRuntimeState.set(config.id, { locked: false });
      }

      if (!sortScheduled) {
        sortScheduled = true;
        nextTick(() => {
          registeredPanels.value = sortByDOMOrder(registeredPanels.value);
          sortScheduled = false;
        });
      }
    }
  }

  /**
   * Sort panel configs to match DOM order inside the container element.
   */
  function sortByDOMOrder(panels: ResizablePanelConfig[]): ResizablePanelConfig[] {
    const container = containerRef.value;
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

  function unregisterPanel(id: string): void {
    registeredPanels.value = registeredPanels.value.filter(p => p.id !== id);
    panelRuntimeState.delete(id);
  }

  // ── Runtime state mutations ──────────────────────────────────────────────────

  function setManualTargetRatio(id: string, ratio: number | undefined): void {
    const runtime = panelRuntimeState.get(id);
    if (runtime) {
      runtime.manualTargetRatio = ratio;
    }
  }

  function setPanelLocked(id: string, locked: boolean): void {
    const runtime = panelRuntimeState.get(id);
    if (runtime) {
      runtime.locked = locked;
    }
  }

  // ── Storage operations ──────────────────────────────────────────────────────

  function saveCurrentLayout(panels: ResizablePanelState[]): void {
    storage.saveToStorage(panels);
    savedState.value = panels.map(p => {
      const runtime = panelRuntimeState.get(p.id);
      return {
        id: p.id,
        pixelSize: p.pixelSize,
        locked: p.locked,
        collapsed: p.collapsed,
        autoCollapsed: p.autoCollapsed,
        manualTargetRatio: runtime?.manualTargetRatio,
      };
    });
  }

  function updateSavedPanel(panelId: string, updates: Partial<SavedPanelData>): void {
    if (!savedState.value) savedState.value = [];
    const idx = savedState.value.findIndex(s => s.id === panelId);
    if (idx >= 0) {
      savedState.value[idx] = { ...savedState.value[idx], ...updates };
    } else {
      savedState.value.push({ id: panelId, pixelSize: 0, ...updates });
    }
    savedState.value = [...savedState.value]; // trigger reactivity

    // Also update runtime state for manualTargetRatio if provided
    if (updates.manualTargetRatio !== undefined) {
      const runtime = panelRuntimeState.get(panelId);
      if (runtime) runtime.manualTargetRatio = updates.manualTargetRatio;
    }

    // Persist to external storage
    storage.saveToStorage(savedState.value);
  }

  function reloadFromStorage(): void {
    savedState.value = storage.loadFromStorage();
  }

  function clearSavedState(): void {
    storage.clearStorage();
    savedState.value = null;
  }

  // ── ResizeObserver ─────────────────────────────────────────────────────────

  const resizeObserver = new ResizeObserver(entries => {
    for (const entry of entries) {
      const dim = direction.value === 'row' ? entry.contentRect.width : entry.contentRect.height;
      containerSize.value = clampContainerSize(Math.round(dim));
    }
  });

  function disconnectObserver(): void {
    resizeObserver.disconnect();
  }

  watch(
    containerRef,
    (el, prev) => {
      if (prev) resizeObserver.unobserve(prev);
      if (el) {
        const initial = direction.value === 'row' ? el.clientWidth : el.clientHeight;
        containerSize.value = clampContainerSize(initial);
        resizeObserver.observe(el);
      }
    },
    { immediate: true }
  );

  // ── Expose ─────────────────────────────────────────────────────────────────

  return {
    layout,
    syncedPanels,
    containerSize,
    isInitializing,

    registerPanel,
    unregisterPanel,

    setManualTargetRatio,
    setPanelLocked,

    saveCurrentLayout,
    updateSavedPanel,
    reloadFromStorage,
    clearSavedState,

    disconnectObserver,
  };
}
