/**
 * Panel State Model
 *
 * Pure functions for panel state creation, constraint calculation, and validation.
 * Single source of truth for all constraint-related logic.
 *
 * Constraint math has been extracted to constraintResolver.ts.
 */

import type { ResizablePanelConfig, ResizablePanelState } from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';

import { calculateConstraintHierarchy } from './constraintResolver';

// Re-export constraint types and functions from constraintResolver
export type { ConstraintHierarchy } from './constraintResolver';
export { calculateConstraintHierarchy } from './constraintResolver';

/**
 * Apply constraints to a pixel size for a panel.
 *
 * Updates panel's constraint pixel values and returns the constrained size.
 *
 * @param panel - Panel state to update constraints on
 * @param pixelSize - Desired pixel size before constraints
 * @param containerSize - Current container size in pixels
 * @param constraintType - Which constraints to apply: 'user' (default) or 'system'
 * @returns Constrained pixel size respecting bounds
 */
export function applyPanelPixelConstraints(
  panel: ResizablePanelState,
  pixelSize: number,
  containerSize: number,
  constraintType: 'user' | 'system' = 'user'
): number {
  const constraints = calculateConstraintHierarchy(panel, containerSize);

  panel.userMinSizePixels = constraints.userMinSizePixels;
  panel.userMaxSizePixels = constraints.userMaxSizePixels;
  panel.systemMinSizePixels = constraints.systemMinSizePixels;
  panel.systemMaxSizePixels = constraints.systemMaxSizePixels;
  panel.collapseSizePixels = constraints.collapseSizePixels;

  const minPixels =
    constraintType === 'system'
      ? (constraints.systemMinSizePixels ?? constraints.userMinSizePixels)
      : constraints.userMinSizePixels;
  const maxPixels =
    constraintType === 'system'
      ? (constraints.systemMaxSizePixels ?? constraints.userMaxSizePixels)
      : constraints.userMaxSizePixels;

  let constrainedSize = pixelSize;
  if (minPixels !== undefined) {
    constrainedSize = Math.max(constrainedSize, minPixels);
  }
  if (maxPixels !== undefined) {
    constrainedSize = Math.min(constrainedSize, maxPixels);
  }

  return constrainedSize;
}

// ============================================================================
// PANEL STATE CREATION
// ============================================================================

function applyConstraintsToSize(pixelSize: number, minSizePixels?: number, maxSizePixels?: number): number {
  let constrained = pixelSize;
  if (minSizePixels !== undefined) {
    constrained = Math.max(constrained, minSizePixels);
  }
  if (maxSizePixels !== undefined) {
    constrained = Math.min(constrained, maxSizePixels);
  }
  return constrained;
}

function derivePanelBehavioralState(
  panelConfig: ResizablePanelConfig,
  existingPanel?: ResizablePanelState
): { locked: boolean; collapsed: boolean; manualTargetSize: number | undefined } {
  return {
    locked: existingPanel?.locked ?? panelConfig.resizable === false,
    collapsed: existingPanel?.collapsed ?? Boolean(panelConfig.collapsed),
    manualTargetSize: existingPanel?.manualTargetSize,
  };
}

/**
 * Create initial panel state from configuration.
 */
export function createPanelState(
  panelConfig: ResizablePanelConfig,
  containerSize: number,
  existingPanel?: ResizablePanelState
): ResizablePanelState {
  const constraints = calculateConstraintHierarchy(panelConfig, containerSize);

  const rawPixelSize = parseSizeToPixels(panelConfig.initialSize ?? '50p', containerSize);
  const pixelSize = applyConstraintsToSize(rawPixelSize, constraints.userMinSizePixels, constraints.userMaxSizePixels);

  const behavioralState = derivePanelBehavioralState(panelConfig, existingPanel);
  const autoCollapsed = existingPanel?.autoCollapsed;

  return {
    ...panelConfig,
    pixelSize,
    ...behavioralState,
    userMinSizePixels: constraints.userMinSizePixels,
    userMaxSizePixels: constraints.userMaxSizePixels,
    systemMinSizePixels: constraints.systemMinSizePixels,
    systemMaxSizePixels: constraints.systemMaxSizePixels,
    collapseSizePixels: constraints.collapseSizePixels,
    autoCollapsed,
  };
}

/**
 * Create panel states for all panels in a configuration array.
 */
export function createBasicPanelStates(
  allPanels: ResizablePanelConfig[],
  containerSize: number,
  existingPanels?: ResizablePanelState[]
): ResizablePanelState[] {
  return allPanels.map(panelConfig => {
    const existingPanel = existingPanels?.find(p => p.id === panelConfig.id);
    return createPanelState(panelConfig, containerSize, existingPanel);
  });
}

// ============================================================================
// PANEL STATE VALIDATION
// ============================================================================

/**
 * Ensure at least one resizable panel remains unlocked.
 */
export function ensureAtLeastOneUnlocked(panels: ResizablePanelState[]): void {
  const resizablePanels = panels.filter(p => !p.collapsed && p.resizable !== false);
  const unlockedCount = resizablePanels.filter(p => !p.locked).length;

  if (unlockedCount === 0 && resizablePanels.length > 0) {
    const lastResizable = resizablePanels[resizablePanels.length - 1];
    lastResizable.locked = false;
  }
}

/**
 * Check if a panel pair should be skipped during constraint processing.
 */
export function shouldSkipPanelPair(beforePanel: ResizablePanelState, afterPanel: ResizablePanelState): boolean {
  return (
    beforePanel.resizable === false ||
    !!beforePanel.collapsed ||
    afterPanel.resizable === false ||
    !!afterPanel.collapsed
  );
}

/**
 * Check if a panel pair can be reset to initial sizes.
 */
export function canResetPanelPair(beforePanel: ResizablePanelState, afterPanel: ResizablePanelState): boolean {
  return (
    beforePanel.resizable !== false && !beforePanel.collapsed && afterPanel.resizable !== false && !afterPanel.collapsed
  );
}
