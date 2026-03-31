/**
 * Resizable Core - Integration Layer
 *
 * Orchestrates panel state, storage, and initialization.
 * Creates single resizeHandler instance for the entire group.
 * Imports Model and Controller layers for separation of concerns.
 */

import { ref, reactive, nextTick, watch, type Ref } from 'vue';
import type {
  ResizablePanelConfig,
  ResizablePanelState,
  ResizableGroupState,
  ResizableDirection,
  CollapseRule,
  SpaceAllocationStrategy,
} from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';
import { useResizableStorage, validateStoredPanelSize } from './useResizableStorage';
import { useResizeHandling, type ResizeHandler } from './useResizableCalculations';
import {
  applyPanelPixelConstraints,
  createBasicPanelStates,
  ensureAtLeastOneUnlocked,
  shouldSkipPanelPair,
} from './useResizablePanelState';
import { calculateConstraintHierarchy } from './constraintResolver';

// Re-export Model layer functions for backward compatibility
export {
  applyPanelPixelConstraints,
  createPanelState,
  createBasicPanelStates,
  ensureAtLeastOneUnlocked,
  shouldSkipPanelPair,
  canResetPanelPair,
} from './useResizablePanelState';

// Re-export Controller layer composable for backward compatibility
export { useResizablePanelControls, type ResizablePanelControlsOptions } from './useResizablePanelControls';

// ============================================================================
// COLLAPSE RULE UTILITIES
// ============================================================================

/**
 * Sorts collapse rules by priority (lower numbers collapse first).
 * Creates a new sorted array - does not mutate the original.
 * Maintains stable sort for rules with equal priority.
 */
export function sortCollapseRules(rules: CollapseRule[]): CollapseRule[] {
  if (!rules || rules.length === 0) {
    return [];
  }

  const indexed = rules.map((rule, index) => ({ rule, index }));

  indexed.sort((a, b) => {
    const priorityDiff = a.rule.priority - b.rule.priority;
    if (priorityDiff !== 0) {
      return priorityDiff;
    }
    return a.index - b.index;
  });

  return indexed.map(item => item.rule);
}

// ============================================================================
// SPACE ALLOCATION UTILITIES
// ============================================================================

function applyProportionalAllocation(
  donors: ResizablePanelState[],
  newPanelSize: number,
  newSizes: Map<string, number>
): void {
  const totalSpace = donors.reduce((sum, p) => sum + p.pixelSize, 0);

  if (totalSpace < newPanelSize) {
    console.warn(
      `[resizable] proportional: Available panels only have ${totalSpace}px, need ${newPanelSize}px. Taking all available.`
    );
  }

  const actualContribution = Math.min(newPanelSize, totalSpace);

  donors.forEach(p => {
    const proportion = p.pixelSize / totalSpace;
    const contribution = actualContribution * proportion;
    const newSize = Math.max(0, p.pixelSize - contribution);
    newSizes.set(p.id, Math.round(newSize));
  });
}

function includeUnchangedPanels(allPanels: ResizablePanelState[], newSizes: Map<string, number>): void {
  allPanels
    .filter(p => p.collapsed || p.locked)
    .forEach(p => {
      newSizes.set(p.id, p.pixelSize);
    });
}

/**
 * Allocates space from existing panels when a new panel opens.
 * Returns a Map of panelId -> new pixel size for each panel.
 *
 * Strategies:
 * - 'proportional': Takes space proportionally from all unlocked, non-collapsed panels
 * - 'preserve-manual': Only takes from non-manually-resized panels; manual panels keep exact size
 */
export function allocateSpaceOnPanelOpen(
  newPanelSize: number,
  allPanels: ResizablePanelState[],
  strategy: SpaceAllocationStrategy = 'proportional'
): Map<string, number> {
  const newSizes = new Map<string, number>();
  const availablePanels = allPanels.filter(p => !p.collapsed && !p.locked);

  if (availablePanels.length === 0 || newPanelSize <= 0) {
    allPanels.forEach(p => newSizes.set(p.id, p.pixelSize));
    return newSizes;
  }

  if (strategy === 'preserve-manual') {
    const donors = availablePanels.filter(p => p.manualTargetSize === undefined);
    const manualPanels = availablePanels.filter(p => p.manualTargetSize !== undefined);

    if (donors.length === 0) {
      return allocateSpaceOnPanelOpen(newPanelSize, allPanels, 'proportional');
    }

    const totalDonorSpace = donors.reduce((sum, p) => sum + p.pixelSize, 0);
    if (totalDonorSpace < newPanelSize) {
      console.warn(
        `[resizable] preserve-manual: Donor panels only have ${totalDonorSpace}px, need ${newPanelSize}px. Falling back to proportional.`
      );
      return allocateSpaceOnPanelOpen(newPanelSize, allPanels, 'proportional');
    }

    applyProportionalAllocation(donors, newPanelSize, newSizes);
    manualPanels.forEach(p => newSizes.set(p.id, p.pixelSize));
    includeUnchangedPanels(allPanels, newSizes);
  } else {
    // Default: proportional
    applyProportionalAllocation(availablePanels, newPanelSize, newSizes);
    includeUnchangedPanels(allPanels, newSizes);
  }

  return newSizes;
}

// ============================================================================
// AUTO-COLLAPSE UTILITIES
// ============================================================================

function getCollapseThreshold(
  panel: ResizablePanelState,
  rule: CollapseRule,
  containerSize: number
): number | undefined {
  if (rule.minSizeBeforeCollapse !== undefined) {
    return parseSizeToPixels(rule.minSizeBeforeCollapse, containerSize);
  }
  return panel.userMinSizePixels;
}

function shouldPanelCollapse(
  panels: ResizablePanelState[],
  rule: CollapseRule,
  containerSize: number
): string | undefined {
  const panel = panels.find(p => p.id === rule.panelId);

  if (!panel || panel.collapsed || panel.locked) {
    return undefined;
  }

  const threshold = getCollapseThreshold(panel, rule, containerSize);

  if (threshold === undefined) {
    return undefined;
  }

  return panel.pixelSize <= threshold ? panel.id : undefined;
}

/**
 * Checks which panels should auto-collapse based on their current size and collapse rules.
 * Returns panel IDs in priority order (lowest priority first = first to collapse).
 */
export function checkAutoCollapseRules(
  panels: ResizablePanelState[],
  collapseRules: CollapseRule[],
  containerSize: number
): string[] {
  if (!panels || panels.length === 0 || !collapseRules || collapseRules.length === 0) {
    return [];
  }

  const sortedRules = sortCollapseRules(collapseRules);

  return sortedRules
    .map(rule => shouldPanelCollapse(panels, rule, containerSize))
    .filter((id): id is string => id !== undefined);
}

// ============================================================================
// GROUP SETUP - Integration Layer
// ============================================================================

/**
 * Centralized setup logic for ResizableGroup.
 * Handles panel registration, initialization, storage, and container size tracking.
 * Creates single resizeHandler instance to be shared with child components.
 */
export function useResizableGroupSetup(
  props: {
    direction: ResizableDirection;
    panels: ResizablePanelConfig[];
    storageKey: string | null;
  },
  containerRef: Ref<HTMLElement | null>
) {
  const resizeHandler: ResizeHandler = useResizeHandling(props.direction, () => state.containerSize);

  // ---- State ----
  const state = reactive<ResizableGroupState>({
    direction: props.direction,
    panels: [],
    containerSize: 0,
    isResizing: false,
    activeHandleId: undefined,
    activeCursorPosition: 0,
  });

  // ---- Panel registration ----
  const registeredPanels = ref<ResizablePanelConfig[]>([]);
  const isInitializing = ref(false);

  function registerPanel(config: ResizablePanelConfig) {
    const existingIndex = registeredPanels.value.findIndex(p => p.id === config.id);
    if (existingIndex !== -1) {
      registeredPanels.value[existingIndex] = config;

      const statePanel = state.panels.find(p => p.id === config.id);
      if (statePanel && state.containerSize > 0) {
        const constraints = calculateConstraintHierarchy(config, state.containerSize);
        statePanel.userMinSizePixels = constraints.userMinSizePixels;
        statePanel.userMaxSizePixels = constraints.userMaxSizePixels;
        statePanel.systemMinSizePixels = constraints.systemMinSizePixels;
        statePanel.systemMaxSizePixels = constraints.systemMaxSizePixels;
        statePanel.collapseSizePixels = constraints.collapseSizePixels;
        statePanel.initialSize = config.initialSize;
        statePanel.userMinSize = config.userMinSize;
        statePanel.userMaxSize = config.userMaxSize;
        statePanel.systemMinSize = config.systemMinSize;
        statePanel.systemMaxSize = config.systemMaxSize;
        statePanel.collapseSize = config.collapseSize;
        statePanel.peekEnabled = config.peekEnabled;
        statePanel.peekTrigger = config.peekTrigger;
        statePanel.peekWhenManual = config.peekWhenManual;
        statePanel.peekWidth = config.peekWidth;
        statePanel.peekGracePeriod = config.peekGracePeriod;
      }
    } else {
      registeredPanels.value.push(config);
    }
  }

  async function unregisterPanel(id: string) {
    registeredPanels.value = registeredPanels.value.filter(p => p.id !== id);
  }

  // ---- DOM Panel Ordering ----

  async function getDOMOrderedPanels(containerElement: HTMLElement): Promise<ResizablePanelConfig[]> {
    await nextTick();
    const panelEls = Array.from(
      containerElement.querySelectorAll('.dt-resizable-panel[data-panel-id]')
    ) as HTMLElement[];
    const ordered: ResizablePanelConfig[] = [];
    panelEls.forEach(el => {
      const id = el.getAttribute('data-panel-id');
      if (!id) return;
      const cfg = registeredPanels.value.find(p => p.id === id);
      if (cfg) ordered.push(cfg);
    });
    registeredPanels.value.forEach(p => {
      if (!ordered.find(o => o.id === p.id)) ordered.push(p);
    });
    return ordered;
  }

  function getPanelsToUse(propsPanels: ResizablePanelConfig[], containerElement: HTMLElement) {
    return propsPanels && propsPanels.length > 0
      ? propsPanels
      : registeredPanels.value.length > 0
        ? awaitableOrderedPanels(containerElement)
        : [];
  }

  async function awaitableOrderedPanels(containerElement: HTMLElement) {
    return getDOMOrderedPanels(containerElement);
  }

  // ---- Constraint-Aware Panel Initialization ----

  function applyConstraintLogicToPanels(panels: ResizablePanelState[], containerSize: number): void {
    for (let i = 0; i < panels.length - 1; i++) {
      const beforePanel = panels[i];
      const afterPanel = panels[i + 1];

      if (shouldSkipPanelPair(beforePanel, afterPanel)) continue;

      const beforeInitialPixelSize = parseSizeToPixels(beforePanel.initialSize || '50p', containerSize);
      const beforePanelLeft = 0;
      const targetCursorPosition = beforePanelLeft + beforeInitialPixelSize;

      const resizeResult = resizeHandler.processResizeMove(
        targetCursorPosition,
        beforePanel,
        afterPanel,
        containerSize,
        undefined,
        panels,
        beforePanelLeft
      );

      beforePanel.pixelSize = resizeResult.beforePanelSize;
      afterPanel.pixelSize = resizeResult.afterPanelSize;
    }
  }

  function preserveExistingPanelState(panels: ResizablePanelState[], existingPanels?: ResizablePanelState[]): void {
    panels.forEach(panel => {
      const existingPanel = existingPanels?.find(p => p.id === panel.id);
      if (existingPanel?.pixelSize !== undefined && !isNaN(existingPanel.pixelSize)) {
        panel.pixelSize = existingPanel.pixelSize;
      }
    });
  }

  function initializePanelsFromConfig(
    allPanels: ResizablePanelConfig[],
    containerSize: number,
    _containerElement?: HTMLElement,
    existingPanels?: ResizablePanelState[]
  ): ResizablePanelState[] {
    if (allPanels.length === 0) return [];

    const panels = createBasicPanelStates(allPanels, containerSize, existingPanels);
    applyConstraintLogicToPanels(panels, containerSize);
    preserveExistingPanelState(panels, existingPanels);

    return panels;
  }

  // ---- Container Size Management ----

  function getContainerSize(direction: ResizableDirection, containerElement: HTMLElement) {
    return direction === 'row' ? containerElement.clientWidth : containerElement.clientHeight;
  }

  function updateContainerSize() {
    if (!containerRef.value) return;
    const containerSize = state.direction === 'row' ? containerRef.value.clientWidth : containerRef.value.clientHeight;

    if (containerSize < 0) {
      console.warn(`[resizable] Invalid container size: ${containerSize}px. Skipping update.`);
      return;
    }

    const maxContainerSize = 10000;
    const validatedContainerSize = Math.min(containerSize, maxContainerSize);

    if (validatedContainerSize !== containerSize) {
      console.warn(
        `[resizable] Container size ${containerSize}px is unusually large. Capping at ${maxContainerSize}px.`
      );
    }

    const previousContainerSize = state.containerSize;
    state.containerSize = validatedContainerSize;

    state.panels.forEach(panel => {
      applyPanelPixelConstraints(panel, panel.pixelSize, containerSize);
    });

    if (Math.abs(validatedContainerSize - previousContainerSize) > 10) {
      applyConstraintAwareSizing();
    }
  }

  function applyConstraintAwareSizing() {
    if (!containerRef.value || state.panels.length === 0) return;

    const panelPixelSizes = new Map<string, number>();
    const flexiblePanelIds: string[] = [];
    let totalConstrainedPixels = 0;

    state.panels.forEach(panel => {
      let constrainedPixelSize = panel.pixelSize;

      if (panel.locked || panel.resizable === false) {
        if (panel.userMinSizePixels !== undefined && panel.pixelSize < panel.userMinSizePixels) {
          panel.locked = false;
          constrainedPixelSize = Math.max(panel.pixelSize, panel.userMinSizePixels);
        } else {
          panelPixelSizes.set(panel.id, panel.pixelSize);
          totalConstrainedPixels += panel.pixelSize;
          return;
        }
      }

      if (panel.userMinSizePixels !== undefined) {
        constrainedPixelSize = Math.max(constrainedPixelSize, panel.userMinSizePixels);
      }
      if (panel.userMaxSizePixels !== undefined) {
        constrainedPixelSize = Math.min(constrainedPixelSize, panel.userMaxSizePixels);
      }

      panelPixelSizes.set(panel.id, constrainedPixelSize);
      totalConstrainedPixels += constrainedPixelSize;
      flexiblePanelIds.push(panel.id);
    });

    const pixelDifference = state.containerSize - totalConstrainedPixels;
    if (Math.abs(pixelDifference) > 1 && flexiblePanelIds.length > 0) {
      const redistributionPerPanel = pixelDifference / flexiblePanelIds.length;

      flexiblePanelIds.forEach(panelId => {
        const panel = state.panels.find(p => p.id === panelId);
        if (!panel) return;

        const currentSize = panelPixelSizes.get(panelId) || 0;
        const redistributedSize = currentSize + redistributionPerPanel;
        const constrainedSize = applyPanelPixelConstraints(panel, redistributedSize, state.containerSize);
        const finalSize = Math.max(10, constrainedSize);
        panelPixelSizes.set(panelId, finalSize);
      });
    }

    state.panels.forEach(panel => {
      const constrainedPixelSize = panelPixelSizes.get(panel.id);
      if (constrainedPixelSize !== undefined) {
        panel.pixelSize = Math.round(constrainedPixelSize);
      }
    });
  }

  // ---- Storage Integration ----
  const storage = useResizableStorage(props.storageKey);

  function loadFromStorage(): { loaded: boolean; autoExpandedPanelIds: string[] } {
    const autoExpandedPanelIds: string[] = [];
    const loaded = storage.loadFromStorageWithValidation(state.panels);

    if (loaded) {
      state.panels.forEach(panel => {
        applyPanelPixelConstraints(panel, panel.pixelSize, state.containerSize, 'system');

        if (!panel.collapsed && panel.resizable !== false) {
          const validatedSize = validateStoredPanelSize(panel.pixelSize, state.containerSize, panel);
          const constrainedPixelSize = applyPanelPixelConstraints(panel, validatedSize, state.containerSize);

          if (constrainedPixelSize !== panel.pixelSize) {
            panel.pixelSize = constrainedPixelSize;
          }
        }
      });

      state.panels.forEach(panel => {
        if (panel.collapsed && panel.collapsible && panel.collapseSizePixels) {
          if (panel.autoCollapsed === true && state.containerSize >= panel.collapseSizePixels) {
            const initialSize = parseSizeToPixels(panel.initialSize ?? '50p', state.containerSize);
            const constrainedSize = applyPanelPixelConstraints(panel, initialSize, state.containerSize, 'system');
            panel.pixelSize = constrainedSize;

            panel.collapsed = false;
            panel.autoCollapsed = false;

            autoExpandedPanelIds.push(panel.id);
          }
        }
      });

      state.panels = [...state.panels];
      updateContainerSize();
    }

    return { loaded, autoExpandedPanelIds };
  }

  function saveToStorage(panels: ResizablePanelState[]) {
    if (isInitializing.value) {
      return;
    }

    const registeredIds = registeredPanels.value.map(p => p.id);
    const currentIds = panels.map(p => p.id);
    const allRegisteredPresent = registeredIds.every(id => currentIds.includes(id));

    if (!allRegisteredPresent) {
      return;
    }

    storage.saveToStorage(panels);
  }

  // ---- Initialization Flow ----

  async function initializePanels(): Promise<string[]> {
    let autoExpandedPanelIds: string[] = [];

    try {
      isInitializing.value = true;
      if (!containerRef.value) {
        isInitializing.value = false;
        return [];
      }
      const panelsToUse = await getPanelsToUse(props.panels, containerRef.value);
      if (panelsToUse.length === 0) {
        state.panels = [];
        isInitializing.value = false;
        return [];
      }

      const currentPanelIds = state.panels.map(p => p.id).sort();
      const newPanelIds = panelsToUse.map(p => p.id).sort();
      const panelsMatch = JSON.stringify(currentPanelIds) === JSON.stringify(newPanelIds);

      if (panelsMatch && state.panels.length > 0) {
        isInitializing.value = false;
        return [];
      }

      const containerSize = getContainerSize(props.direction, containerRef.value);
      state.containerSize = containerSize;

      const initialPanels = initializePanelsFromConfig(panelsToUse, containerSize, containerRef.value, state.panels);
      state.panels = initialPanels;

      ensureAtLeastOneUnlocked(state.panels);

      if (props.storageKey) {
        const result = loadFromStorage();
        autoExpandedPanelIds = result.autoExpandedPanelIds;

        setTimeout(() => {
          loadFromStorage();
        }, 100);
      } else {
        updateContainerSize();
      }
    } catch (error) {
      console.error('[resizable] Error in initializePanels:', error);
    } finally {
      isInitializing.value = false;
    }

    return autoExpandedPanelIds;
  }

  async function initialize(): Promise<string[]> {
    return await initializePanels();
  }

  // ---- Watchers ----
  let watchersActive = false;

  function activateWatchers() {
    if (watchersActive) return;
    watchersActive = true;

    watch(
      () => props.panels,
      async newPanels => {
        if (newPanels && Array.isArray(newPanels) && newPanels.length > 0) {
          await initializePanels();
        }
      },
      { deep: true }
    );

    watch(
      () =>
        registeredPanels.value
          .map(p => p.id)
          .sort()
          .join(','),
      async () => {
        if (!props.panels || props.panels.length === 0) {
          await initializePanels();
        }
      }
    );
  }

  watch(
    () => props.direction,
    newDirection => {
      state.direction = newDirection;
      updateContainerSize();
    }
  );

  return {
    state,
    registerPanel,
    unregisterPanel,
    updateContainerSize,
    loadFromStorage,
    saveToStorage,
    isInitializing,
    initialize,
    activateWatchers,
    resizeHandler,
  };
}
