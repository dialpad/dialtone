/**
 * Resizable Core Utilities
 *
 * Pure utility functions for collapse rules, space allocation, and auto-collapse.
 * Re-exports from Model and Controller layers for barrel convenience.
 */

import type {
  ResizablePanelState,
  CollapseRule,
  SpaceAllocationStrategy,
} from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';

// Re-export Model layer functions
export {
  applyPanelPixelConstraints,
  createPanelState,
  createBasicPanelStates,
  ensureAtLeastOneUnlocked,
  shouldSkipPanelPair,
  canResetPanelPair,
} from './useResizablePanelState';

// Re-export Controller layer composable
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
