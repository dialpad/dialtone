/**
 * Panel Controls Controller
 *
 * Operations for manipulating panel state: resize, collapse, reset.
 * Receives resizeHandler from Integration layer (single instance pattern).
 */

import type { Ref } from 'vue';
import { DEFAULT_PANEL_SIZE } from '../resizable_constants';
import type {
  ResizablePanelState,
  ResizableSizeValue,
  CollapseRule,
} from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';
import { applyPanelPixelConstraints, canResetPanelPair } from './useResizablePanelState';

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
  onPanelResize: (panelId: string, pixelSize: number) => void;
  onPanelCollapse: (panelId: string, collapsed: boolean) => void;
  updateSavedPanel: (panelId: string, updates: Partial<import('./useResizableStorage').SavedPanelData>) => void;
}

// ============================================================================
// MAIN COMPOSABLE
// ============================================================================

export function useResizablePanelControls(options: ResizablePanelControlsOptions) {
  const {
    panels,
    containerSize,
    containerRef,
    onPanelResize,
    onPanelCollapse,
    updateSavedPanel,
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

    onPanelCollapse(panelId, isCollapse);
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

    updateSavedPanel(panel.id, { collapsed: true, autoCollapsed: source === 'system' });

    // Clear manual ratios so remaining panels fill the freed space
    panels.value.forEach(p => {
      if (p.id !== panel.id && !p.collapsed) {
        updateSavedPanel(p.id, { manualTargetRatio: undefined });
      }
    });
  }

  function executeExpand(panel: ResizablePanelState): void {
    const wasAutoCollapsed = panel.autoCollapsed ?? false;

    const preCollapse = preCollapseStates.get(panel.id);

    if (preCollapse) {
      const viewportChangeRatio = Math.abs(containerSize.value - preCollapse.containerSize)
        / preCollapse.containerSize;
      const viewportChanged = viewportChangeRatio > 0.1;
      const shouldRestoreSizes = !viewportChanged || !wasAutoCollapsed;

      if (shouldRestoreSizes) {
        const savedPanelSize = preCollapse.sizes.get(panel.id);
        if (savedPanelSize !== undefined) {
          updateSavedPanel(panel.id, { pixelSize: savedPanelSize, collapsed: false, autoCollapsed: undefined });
        } else {
          updateSavedPanel(panel.id, { collapsed: false, autoCollapsed: undefined });
        }

        panels.value.forEach(p => {
          if (p.id === panel.id) return;
          const savedSize = preCollapse.sizes.get(p.id);
          const hadManualTargetBefore = preCollapse.manualTargets.get(p.id) !== undefined;
          const hasManualTargetNow = p.manualTargetSize !== undefined;

          if (!hadManualTargetBefore && !hasManualTargetNow && savedSize !== undefined) {
            updateSavedPanel(p.id, { pixelSize: savedSize });
          }
        });
      } else {
        updateSavedPanel(panel.id, { collapsed: false, autoCollapsed: undefined });
      }

      preCollapseStates.delete(panel.id);
    } else {
      const initialSize = parseSizeToPixels(panel.initialSize ?? DEFAULT_PANEL_SIZE, containerSize.value);
      const constrainedSize = applyPanelPixelConstraints(panel, initialSize, containerSize.value, 'system');
      updateSavedPanel(panel.id, { pixelSize: constrainedSize, collapsed: false, autoCollapsed: undefined });
    }
  }

  // ---- Panel Operations ----

  function commitPanelSize(panelId: string, pixels: number): void {
    const rounded = Math.round(pixels);
    const cSize = containerSize.value;
    const ratio = cSize > 0 ? rounded / cSize : undefined;
    updateSavedPanel(panelId, { pixelSize: rounded, manualTargetRatio: ratio });
  }

  function resizePanel(panelId: string, newPixelSize: number) {
    const panel = panels.value.find(p => p.id === panelId);
    if (!panel || panel.collapsed) return;

    const constrainedSize = applyPanelPixelConstraints(panel, newPixelSize, containerSize.value);
    commitPanelSize(panelId, constrainedSize);

    onPanelResize(panelId, constrainedSize);
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

  // ---- Panel Reset Operations ----

  function resetAdjacentPanels(beforePanel: ResizablePanelState, afterPanel: ResizablePanelState) {
    const combinedSpace = beforePanel.pixelSize + afterPanel.pixelSize;
    const beforeInitial = convertToPixelSize(beforePanel.initialSize || DEFAULT_PANEL_SIZE);
    const afterInitial = convertToPixelSize(afterPanel.initialSize || DEFAULT_PANEL_SIZE);
    const totalInitial = beforeInitial + afterInitial;

    const beforeSize = totalInitial > 0
      ? Math.round(combinedSpace * (beforeInitial / totalInitial))
      : Math.round(combinedSpace / 2);
    const afterSize = combinedSpace - beforeSize;

    updateSavedPanel(beforePanel.id, {
      pixelSize: beforeSize, manualTargetRatio: undefined,
    });
    updateSavedPanel(afterPanel.id, {
      pixelSize: afterSize, manualTargetRatio: undefined,
    });

    onPanelResize(beforePanel.id, beforeSize);
    onPanelResize(afterPanel.id, afterSize);
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

  function resetSinglePanel(panelId?: string) {
    if (!panelId) return;
    const panel = panels.value.find(p => p.id === panelId);
    if (!panel || panel.collapsed || panel.resizable === false) return;

    const initialSize = convertToPixelSize(panel.initialSize || DEFAULT_PANEL_SIZE);
    const delta = initialSize - panel.pixelSize;

    const panelIndex = panels.value.indexOf(panel);
    const adjacentPanel = panels.value.find((p, i) =>
      i !== panelIndex && !p.collapsed && p.resizable !== false
    );

    if (!adjacentPanel) return;

    const newAdjacentSize = adjacentPanel.pixelSize - delta;

    updateSavedPanel(panel.id, {
      pixelSize: initialSize, manualTargetRatio: undefined,
    });
    updateSavedPanel(adjacentPanel.id, { pixelSize: newAdjacentSize });

    onPanelResize(panel.id, initialSize);
    onPanelResize(adjacentPanel.id, newAdjacentSize);
  }

  function resetPanels(
    beforePanelId?: string,
    afterPanelId?: string,
    behavior: 'both' | 'before' | 'after' | 'all' = 'all'
  ) {
    try {
      if (behavior === 'all') {
        resetAllPanelPairs();
      } else if (behavior === 'before') {
        resetSinglePanel(beforePanelId);
      } else if (behavior === 'after') {
        resetSinglePanel(afterPanelId);
      } else {
        resetSpecificPanelPair(beforePanelId, afterPanelId);
      }
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

  return {
    commitPanelSize,
    resizePanel,
    collapsePanel,
    resetPanels,
    processCollapseRequest,
    checkAutoCollapse,
    checkAutoExpand,
    processAutoCollapseExpand,
  };
}

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

  if (!panel || panel.collapsed) {
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
