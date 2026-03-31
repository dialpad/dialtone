/**
 * Panel Controls Controller
 *
 * Operations for manipulating panel state: resize, collapse, lock, reset.
 * Receives resizeHandler from Integration layer (single instance pattern).
 */

import type { Ref } from 'vue';
import { DEFAULT_PANEL_SIZE } from '../resizable_constants';
import type { ResizablePanelState, ResizableSizeValue } from '../resizable_constants';
import { parseSizeToPixels, hasPercentageMinSize } from '../resizable_utils';
import { applyPanelPixelConstraints, ensureAtLeastOneUnlocked, canResetPanelPair } from './useResizablePanelState';
import type { ResizeHandler } from './useResizableCalculations';
import { clampSize } from './constraintResolver';

// ============================================================================
// TYPES
// ============================================================================

/**
 * State snapshot captured before a panel is collapsed.
 */
export interface PreCollapseState {
  sizes: Map<string, number>;
  manualTargets: Map<string, number | undefined>;
  containerSize: number;
}

export type CollapseRequestSource =
  | 'user'
  | 'system'
  | 'prop'
  | 'storage';

export interface CollapseRequest {
  panelId: string;
  action: 'collapse' | 'expand';
  source: CollapseRequestSource;
}

export interface CollapseRequestResult {
  success: boolean;
  reason?: string;
  panelId: string;
  newState: 'collapsed' | 'expanded' | 'unchanged';
}

export interface CollapseOptions {
  isAutoCollapse?: boolean;
}

export interface ResizablePanelControlsOptions {
  panels: Ref<ResizablePanelState[]>;
  containerSize: Ref<number>;
  containerRef: Ref<HTMLElement | null>;
  resizeHandler: ResizeHandler;
  onPanelResize: (panelId: string, pixelSize: number) => void;
  onPanelCollapse: (panelId: string, collapsed: boolean) => void;
  updateContainerSize: () => void;
  saveToStorage: (panels: ResizablePanelState[]) => void;
  isInitializing: Ref<boolean>;
}

// ============================================================================
// MAIN COMPOSABLE
// ============================================================================

export function useResizablePanelControls(options: ResizablePanelControlsOptions) {
  const {
    panels,
    containerSize,
    containerRef,
    resizeHandler,
    onPanelResize,
    onPanelCollapse,
    updateContainerSize,
    saveToStorage,
    isInitializing,
  } = options;

  const preCollapseStates = new Map<string, PreCollapseState>();

  // ---- Size Conversion ----

  function convertToPixelSize(initialSize: ResizableSizeValue): number {
    return parseSizeToPixels(initialSize, containerSize.value);
  }

  // ============================================================================
  // CENTRALIZED COLLAPSE LOGIC
  // ============================================================================

  function processCollapseRequest(request: CollapseRequest): CollapseRequestResult {
    const { panelId, action, source } = request;
    const panel = panels.value.find(p => p.id === panelId);
    const isCollapse = action === 'collapse';

    const validationResult = validateCollapseRequest(panelId, panel, isCollapse);
    if (validationResult) return validationResult;

    if (isCollapse) {
      executeCollapse(panel!, source);
    } else {
      executeExpand(panel!);
    }

    updateContainerSize();
    onPanelCollapse(panelId, isCollapse);
    saveToStorage(panels.value);
    if (containerRef.value) {
      containerRef.value.dispatchEvent(new CustomEvent('panels-updated'));
    }

    const newState = isCollapse ? 'collapsed' : 'expanded';

    return { success: true, panelId, newState };
  }

  function validateCollapseRequest(
    panelId: string,
    panel: ResizablePanelState | undefined,
    isCollapse: boolean
  ): CollapseRequestResult | undefined {
    if (!panel) {
      return { success: false, reason: 'Panel not found', panelId, newState: 'unchanged' };
    }

    const currentlyCollapsed = panel.collapsed;
    if (isCollapse && currentlyCollapsed) {
      return { success: true, reason: 'Already collapsed', panelId, newState: 'unchanged' };
    }
    if (!isCollapse && !currentlyCollapsed) {
      return { success: true, reason: 'Already expanded', panelId, newState: 'unchanged' };
    }
    if (isCollapse && !panel.collapsible) {
      return { success: false, reason: 'Panel is not collapsible', panelId, newState: 'unchanged' };
    }

    return undefined;
  }

  function executeCollapse(panel: ResizablePanelState, source: CollapseRequestSource): void {
    const state: PreCollapseState = {
      sizes: new Map(),
      manualTargets: new Map(),
      containerSize: containerSize.value,
    };
    panels.value.forEach(p => {
      state.sizes.set(p.id, p.pixelSize);
      state.manualTargets.set(p.id, p.manualTargetSize);
    });
    preCollapseStates.set(panel.id, state);

    panel.collapsed = true;
    panel.autoCollapsed = source === 'system';

    panels.value.forEach(p => {
      if (p.id !== panel.id && !p.collapsed) {
        p.locked = false;
      }
    });
  }

  function executeExpand(panel: ResizablePanelState): void {
    const wasAutoCollapsed = panel.autoCollapsed ?? false;
    panel.collapsed = false;
    panel.autoCollapsed = undefined;

    const savedState = preCollapseStates.get(panel.id);

    if (savedState) {
      const viewportChangeRatio = Math.abs(containerSize.value - savedState.containerSize) / savedState.containerSize;
      const viewportChanged = viewportChangeRatio > 0.1;

      const shouldRestoreSizes = !viewportChanged || !wasAutoCollapsed;

      if (shouldRestoreSizes) {
        const savedPanelSize = savedState.sizes.get(panel.id);
        if (savedPanelSize !== undefined) {
          panel.pixelSize = savedPanelSize;
        }

        panels.value.forEach(p => {
          if (p.id === panel.id) return;

          const savedSize = savedState.sizes.get(p.id);
          const hadManualTargetBefore = savedState.manualTargets.get(p.id) !== undefined;
          const hasManualTargetNow = p.manualTargetSize !== undefined;

          if (!hadManualTargetBefore && !hasManualTargetNow && savedSize !== undefined) {
            p.pixelSize = savedSize;
          }
        });
      }

      preCollapseStates.delete(panel.id);
    } else {
      const initialSize = parseSizeToPixels(panel.initialSize ?? DEFAULT_PANEL_SIZE, containerSize.value);
      const constrainedSize = applyPanelPixelConstraints(panel, initialSize, containerSize.value, 'system');
      panel.pixelSize = constrainedSize;
    }
  }

  // ---- Panel Operations ----

  function resizePanel(panelId: string, newPixelSize: number) {
    const panel = panels.value.find(p => p.id === panelId);
    if (!panel || panel.collapsed) return;

    const constrainedSize = applyPanelPixelConstraints(panel, newPixelSize, containerSize.value);

    panel.pixelSize = constrainedSize;

    updateContainerSize();
    onPanelResize(panelId, constrainedSize);
    saveToStorage(panels.value);
  }

  /**
   */
  function collapsePanel(panelId: string, collapsed: boolean, options?: CollapseOptions) {
    const source: CollapseRequestSource = options?.isAutoCollapse ? 'system' : 'prop';

    processCollapseRequest({
      panelId,
      action: collapsed ? 'collapse' : 'expand',
      source,
    });
  }

  function lockPanel(panelId: string) {
    const panel = panels.value.find(p => p.id === panelId);
    if (!panel || panel.collapsed || panel.resizable === false) return;

    panel.locked = true;

    ensureAtLeastOneUnlocked(panels.value);
    saveToStorage(panels.value);
  }

  function unlockPanel(panelId: string) {
    const panel = panels.value.find(p => p.id === panelId);
    if (!panel || panel.collapsed || panel.resizable === false) return;

    panel.locked = false;
    saveToStorage(panels.value);
  }

  // ---- Panel Reset Operations ----

  function resetAdjacentPanels(beforePanel: ResizablePanelState, afterPanel: ResizablePanelState) {
    // Redistribute the combined space of both panels by their initial size ratio
    const combinedSpace = beforePanel.pixelSize + afterPanel.pixelSize;
    const beforeInitial = convertToPixelSize(beforePanel.initialSize || DEFAULT_PANEL_SIZE);
    const afterInitial = convertToPixelSize(afterPanel.initialSize || DEFAULT_PANEL_SIZE);
    const totalInitial = beforeInitial + afterInitial;

    const beforeSize = totalInitial > 0
      ? Math.round(combinedSpace * (beforeInitial / totalInitial))
      : Math.round(combinedSpace / 2);
    const afterSize = combinedSpace - beforeSize;

    beforePanel.pixelSize = beforeSize;
    afterPanel.pixelSize = afterSize;
    beforePanel.locked = false;
    afterPanel.locked = false;
    beforePanel.manualTargetSize = undefined;
    afterPanel.manualTargetSize = undefined;
    beforePanel.manualTargetRatio = undefined;
    afterPanel.manualTargetRatio = undefined;

    onPanelResize(beforePanel.id, beforePanel.pixelSize);
    onPanelResize(afterPanel.id, afterPanel.pixelSize);
  }

  function resetAllPanelPairs() {
    for (let i = 0; i < panels.value.length - 1; i++) {
      const currentPanel = panels.value[i];
      const nextPanel = panels.value[i + 1];

      if (canResetPanelPair(currentPanel, nextPanel)) {
        resetAdjacentPanels(currentPanel, nextPanel);
      }
    }
  }

  function resetSpecificPanelPair(beforePanelId?: string, afterPanelId?: string) {
    const beforePanel = beforePanelId ? panels.value.find(p => p.id === beforePanelId) : undefined;
    const afterPanel = afterPanelId ? panels.value.find(p => p.id === afterPanelId) : undefined;

    if (beforePanel && afterPanel && canResetPanelPair(beforePanel, afterPanel)) {
      resetAdjacentPanels(beforePanel, afterPanel);
    }
  }

  function resetPanels(
    beforePanelId?: string,
    afterPanelId?: string,
    behavior: 'both' | 'before' | 'after' | 'all' = 'all'
  ) {
    try {
      if (behavior === 'all') {
        resetAllPanelPairs();
      } else {
        resetSpecificPanelPair(beforePanelId, afterPanelId);
      }

      ensureAtLeastOneUnlocked(panels.value);
    } catch (error) {
      console.error('[resizable] Error in resetPanels:', error);
    }
  }

  // ---- Auto-Collapse/Expand ----

  function checkAutoCollapse(): string[] {
    const collapsedPanels: string[] = [];
    const currentContainerSize = containerSize.value;

    for (const panel of panels.value) {
      if (panel.collapsed || !panel.collapsible || !panel.collapseSizePixels) {
        continue;
      }

      if (currentContainerSize < panel.collapseSizePixels) {
        const result = processCollapseRequest({
          panelId: panel.id,
          action: 'collapse',
          source: 'system',
        });

        if (result.newState === 'collapsed') {
          collapsedPanels.push(panel.id);
        }
      }
    }

    return collapsedPanels;
  }

  function checkAutoExpand(): string[] {
    const expandedPanels: string[] = [];
    const currentContainerSize = containerSize.value;

    for (const panel of panels.value) {
      if (!panel.collapsed || !panel.autoCollapsed || !panel.collapseSizePixels) {
        continue;
      }

      if (currentContainerSize >= panel.collapseSizePixels) {
        const result = processCollapseRequest({
          panelId: panel.id,
          action: 'expand',
          source: 'system',
        });

        if (result.newState === 'expanded') {
          expandedPanels.push(panel.id);
        }
      }
    }

    return expandedPanels;
  }

  function processAutoCollapseExpand(): { collapsed: string[]; expanded: string[] } {
    const expanded = checkAutoExpand();
    const collapsed = checkAutoCollapse();

    return { collapsed, expanded };
  }

  // ---- Viewport Handling Helpers ----

  function calculateFlexiblePanelTarget(
    panel: ResizablePanelState,
    flexibleScaleFactor: number,
    newAvailableSpace: number,
    totalCurrentFlexible: number
  ): number {
    let targetSize: number;

    if (panel.manualTargetSize !== undefined) {
      const scaledSize = panel.pixelSize * flexibleScaleFactor;
      targetSize = Math.min(scaledSize, panel.manualTargetSize);
    } else {
      const proportion = totalCurrentFlexible > 0 ? panel.pixelSize / totalCurrentFlexible : 0;
      targetSize = newAvailableSpace * proportion;
    }

    return applySystemConstraints(panel, targetSize);
  }

  function applySystemConstraints(panel: ResizablePanelState, size: number): number {
    return clampSize(
      size,
      panel.systemMinSizePixels ?? panel.userMinSizePixels,
      panel.systemMaxSizePixels ?? panel.userMaxSizePixels,
    );
  }

  function compressPanelsToFit(
    activePanels: ResizablePanelState[],
    targetSizes: Map<string, number>,
    overflow: number
  ): void {
    const sorted = [...activePanels].sort(comparePanelsByMinSizePriority);

    let remaining = overflow;
    for (const panel of sorted) {
      if (remaining <= 0) break;
      if (!canPanelCompress(panel)) continue;

      remaining = applyPanelCompression(panel, targetSizes, remaining);
    }
  }

  function canPanelCompress(panel: ResizablePanelState): boolean {
    return !(panel.locked || panel.resizable === false);
  }

  function applyPanelCompression(
    panel: ResizablePanelState,
    targetSizes: Map<string, number>,
    remaining: number
  ): number {
    const currentTarget = targetSizes.get(panel.id) ?? 0;
    const minSize = panel.systemMinSizePixels ?? panel.userMinSizePixels ?? 0;
    const availableToCompress = currentTarget - minSize;

    if (availableToCompress <= 0) return remaining;

    const compression = Math.min(availableToCompress, remaining);
    targetSizes.set(panel.id, currentTarget - compression);
    return remaining - compression;
  }

  function comparePanelsByMinSizePriority(a: ResizablePanelState, b: ResizablePanelState): number {
    const aHasPercentageMin = hasPercentageMinSize(a);
    const bHasPercentageMin = hasPercentageMinSize(b);
    if (aHasPercentageMin && !bHasPercentageMin) return 1;
    if (!aHasPercentageMin && bHasPercentageMin) return -1;
    return 0;
  }

  function expandPanelsToFill(
    activePanels: ResizablePanelState[],
    targetSizes: Map<string, number>,
    extraSpace: number
  ): void {
    let remaining = extraSpace;
    const reversed = [...activePanels].reverse();

    for (const panel of reversed) {
      remaining = distributeExtraSpaceToPanel(panel, targetSizes, remaining);
      if (remaining <= 0) break;
    }
  }

  function getPanelGrowthCeiling(panel: ResizablePanelState): number {
    const maxSize = panel.systemMaxSizePixels ?? panel.userMaxSizePixels ?? Infinity;
    if (panel.manualTargetSize !== undefined) {
      return Math.min(maxSize, panel.manualTargetSize);
    }
    return maxSize;
  }

  function distributeExtraSpaceToPanel(
    panel: ResizablePanelState,
    targetSizes: Map<string, number>,
    remaining: number
  ): number {
    if (remaining <= 0) return remaining;
    if (panel.locked || panel.resizable === false) return remaining;

    const currentTarget = targetSizes.get(panel.id) ?? 0;
    const ceiling = getPanelGrowthCeiling(panel);
    const canGrow = ceiling - currentTarget;
    if (canGrow <= 0) return remaining;

    const growth = Math.min(canGrow, remaining);
    targetSizes.set(panel.id, currentTarget + growth);
    return remaining - growth;
  }

  // ---- Viewport Handling ----

  function handleViewportResize() {
    if (!panels.value || panels.value.length === 0) return;

    const previousContainerSize = containerSize.value;
    updateContainerSize();
    const newContainerSize = containerSize.value;

    if (Math.abs(newContainerSize - previousContainerSize) < 1) return;

    const activePanels = panels.value.filter(p => !p.collapsed);
    updateActivePanelConstraints(activePanels, newContainerSize);

    const { fixedPanels, flexiblePanels, newAvailableSpace, flexibleScaleFactor, totalCurrentFlexible } =
      calculateViewportMetrics(activePanels, previousContainerSize, newContainerSize);

    const targetSizes = calculateTargetSizes(
      fixedPanels,
      flexiblePanels,
      flexibleScaleFactor,
      newAvailableSpace,
      totalCurrentFlexible
    );

    const overflow = calculateOverflow(targetSizes, newContainerSize);
    redistributeIfNeeded(activePanels, targetSizes, overflow);

    applyFinalSizes(activePanels, targetSizes);
    updateCollapsedPanelConstraints(newContainerSize);

    processAutoCollapseExpand();

    if (!isInitializing.value) saveToStorage(panels.value);
  }

  function updateActivePanelConstraints(activePanels: ResizablePanelState[], newContainerSize: number): void {
    activePanels.forEach(panel => {
      applyPanelPixelConstraints(panel, panel.pixelSize, newContainerSize, 'system');
    });
  }

  function calculateViewportMetrics(
    activePanels: ResizablePanelState[],
    previousContainerSize: number,
    newContainerSize: number
  ): {
    fixedPanels: ResizablePanelState[];
    flexiblePanels: ResizablePanelState[];
    newAvailableSpace: number;
    flexibleScaleFactor: number;
    totalCurrentFlexible: number;
  } {
    const fixedPanels = activePanels.filter(p => p.locked || p.resizable === false);
    const flexiblePanels = activePanels.filter(p => !p.locked && p.resizable !== false);
    const totalFixedSpace = fixedPanels.reduce((sum, p) => sum + p.pixelSize, 0);
    const previousAvailableSpace = previousContainerSize - totalFixedSpace;
    const newAvailableSpace = newContainerSize - totalFixedSpace;
    const flexibleScaleFactor = previousAvailableSpace > 0 ? newAvailableSpace / previousAvailableSpace : 1;
    const totalCurrentFlexible = flexiblePanels.reduce((sum, p) => sum + p.pixelSize, 0);

    return {
      fixedPanels,
      flexiblePanels,
      newAvailableSpace,
      flexibleScaleFactor,
      totalCurrentFlexible,
    };
  }

  function calculateTargetSizes(
    fixedPanels: ResizablePanelState[],
    flexiblePanels: ResizablePanelState[],
    flexibleScaleFactor: number,
    newAvailableSpace: number,
    totalCurrentFlexible: number
  ): Map<string, number> {
    const targetSizes: Map<string, number> = new Map();
    fixedPanels.forEach(panel => targetSizes.set(panel.id, panel.pixelSize));
    flexiblePanels.forEach(panel => {
      const target = calculateFlexiblePanelTarget(panel, flexibleScaleFactor, newAvailableSpace, totalCurrentFlexible);
      targetSizes.set(panel.id, target);
    });
    return targetSizes;
  }

  function calculateOverflow(targetSizes: Map<string, number>, newContainerSize: number): number {
    const totalSize = Array.from(targetSizes.values()).reduce((sum, size) => sum + size, 0);
    return totalSize - newContainerSize;
  }

  function redistributeIfNeeded(
    activePanels: ResizablePanelState[],
    targetSizes: Map<string, number>,
    overflow: number
  ): void {
    if (overflow > 1) {
      compressPanelsToFit(activePanels, targetSizes, overflow);
    } else if (overflow < -1) {
      expandPanelsToFill(activePanels, targetSizes, Math.abs(overflow));
    }
  }

  function applyFinalSizes(activePanels: ResizablePanelState[], targetSizes: Map<string, number>): void {
    activePanels.forEach(panel => {
      const finalSize = targetSizes.get(panel.id);
      if (finalSize !== undefined) panel.pixelSize = finalSize;
    });
  }

  function updateCollapsedPanelConstraints(newContainerSize: number): void {
    panels.value
      .filter(p => p.collapsed)
      .forEach(panel => {
        applyPanelPixelConstraints(panel, panel.pixelSize, newContainerSize, 'system');
      });
  }

  return {
    resizePanel,
    collapsePanel,
    lockPanel,
    unlockPanel,
    resetPanels,
    handleViewportResize,
    processCollapseRequest,
    checkAutoCollapse,
    checkAutoExpand,
    processAutoCollapseExpand,
  };
}
