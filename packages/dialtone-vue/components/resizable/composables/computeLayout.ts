/**
 * computeLayout — Pure Layout Engine
 *
 * Takes panel configs + container size and returns positions for every panel
 * and handle. Constraints are applied WITHIN the computation, not after.
 *
 * This is a pure function: no DOM access, no Vue reactivity, no localStorage,
 * no side effects. It takes data in and returns data out.
 *
 * Key design: proportional scaling
 * - Panels with manualTargetRatio scale to their stored ratio each render
 * - Panels without a ratio distribute remaining space proportionally
 * - Fixed panels (resizable: false) keep their exact pixel size
 * - Min/max constraints clamp results; overflow is redistributed in the same pass
 *
 * @see constraintResolver.ts
 */

import { DEFAULT_PANEL_SIZE } from '../resizable_constants';
import type { ResizablePanelConfig } from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';
import { calculateConstraintHierarchy, clampToTier, type ConstraintHierarchy } from './constraintResolver';

// ============================================================================
// SAVED STATE TYPE (inlined from useResizableStorage — ported in Task #2)
// ============================================================================

/**
 * Data shape for a single panel's saved state in localStorage.
 * Defined here so computeLayout stays self-contained without depending
 * on the storage composable. useResizableStorage will re-export this
 * type when it is ported.
 */
export interface SavedPanelData {
  id: string;
  pixelSize: number;
  locked?: boolean;
  collapsed?: boolean;
  /** Whether this panel was auto-collapsed by the system (vs manually by user) */
  autoCollapsed?: boolean;
  /** Proportion of container this panel should occupy (set by drag, used for viewport scaling) */
  manualTargetRatio?: number;
}

// ============================================================================
// INPUT / OUTPUT TYPES
// ============================================================================

/**
 * Input to the layout computation.
 * All values must be resolved before calling (no lazy-loading, no Vue refs).
 */
export interface LayoutInput {
  /** Registered panel configurations, in render order */
  panels: ResizablePanelConfig[];
  /** Current container width (row direction) or height (column direction), in pixels */
  containerSize: number;
  /**
   * Saved state from localStorage (optional).
   * When provided, sizes and collapsed state are restored from here.
   * IDs that do not match current panels are ignored.
   * Values that fail validation fall back to initialSize.
   */
  savedState?: SavedPanelData[];
}

/**
 * Computed position for a single panel.
 * All values are in pixels, relative to the container's top-left corner.
 */
export interface PanelPosition {
  id: string;
  /** Distance from the container's left edge to this panel's left edge */
  left: number;
  /** Distance from this panel's right edge to the container's right edge */
  right: number;
  /** Rendered width of the panel (0 when collapsed) */
  width: number;
  /** Whether the panel is currently collapsed */
  collapsed: boolean;
  /** Resolved constraints for this panel at the current container size */
  constraints: ConstraintHierarchy;
}

/**
 * Computed position for a single drag handle.
 * Handles sit between adjacent visible panels.
 */
export interface HandlePosition {
  /** Handle identifier: "{beforePanelId}:{afterPanelId}" */
  id: string;
  beforePanelId: string;
  afterPanelId: string;
  /** Pixel offset from the container's left edge to the handle's left edge */
  left: number;
  /**
   * True when the handle should be non-interactive.
   * Set when either adjacent panel is collapsed or resizable: false.
   */
  disabled: boolean;
}

/**
 * Output of computeLayout.
 * Immutable — create a new layout by calling computeLayout again.
 */
export interface LayoutResult {
  panels: Map<string, PanelPosition>;
  handles: HandlePosition[];
}

// ============================================================================
// INTERNAL WORKING STATE
// ============================================================================

/**
 * Internal representation while computing sizes before positions are finalized.
 */
interface WorkingPanel {
  config: ResizablePanelConfig;
  constraints: ConstraintHierarchy;
  width: number;
  collapsed: boolean;
  /** True when resizable: false — panel keeps its exact initial pixel size */
  isFixed: boolean;
  /**
   * The manual ratio stored from a previous drag (0–1, fraction of container).
   * When present, this panel's target width = manualTargetRatio * containerSize,
   * still subject to constraints.
   */
  manualTargetRatio?: number;
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Resolve initial pixel size for a panel from saved state or initialSize config.
 * Returns the raw size before constraint clamping.
 */
function resolveRawSize(
  config: ResizablePanelConfig,
  containerSize: number,
  savedPanel: SavedPanelData | undefined
): number {
  if (savedPanel !== undefined) {
    const saved = savedPanel.pixelSize;
    // Reject corrupted saved values
    if (!isFinite(saved) || saved < 0 || (containerSize > 0 && saved > containerSize * 2)) {
      return parseSizeToPixels(config.initialSize ?? DEFAULT_PANEL_SIZE, containerSize);
    }
    return saved;
  }

  return parseSizeToPixels(config.initialSize ?? DEFAULT_PANEL_SIZE, containerSize);
}

/**
 * Determine whether a panel should be collapsed for a given input.
 * Priority: savedState.collapsed > config.collapsed
 */
function resolveCollapsed(config: ResizablePanelConfig, savedPanel: SavedPanelData | undefined): boolean {
  if (savedPanel !== undefined && savedPanel.collapsed !== undefined) {
    return savedPanel.collapsed;
  }
  return Boolean(config.collapsed);
}

/**
 * Clamp a width to the constraint window.
 * Returns the clamped value and the amount of overflow/underflow.
 *
 * @param tier - Which constraints to apply:
 *   'user'   — user-min/max (for ratio panels, user-dragged sizes)
 *   'system' — system-min/max falling back to user (for proportional panels,
 *              viewport-driven redistribution)
 */
function clampToConstraints(
  width: number,
  constraints: ConstraintHierarchy,
  tier: 'user' | 'system' = 'system'
): { clamped: number; delta: number } {
  const clamped = clampToTier(width, constraints, tier);
  return { clamped, delta: clamped - width };
}

/**
 * Build the index of saved state for O(1) lookup during panel iteration.
 * Returns undefined if saved state is structurally incompatible with current panels.
 *
 * Incompatible = current panel IDs have entries NOT present in saved state.
 * (Panel IDs that exist in saved state but not current panels are simply ignored.)
 */
function buildSavedIndex(
  panels: ResizablePanelConfig[],
  savedState: SavedPanelData[] | undefined
): Map<string, SavedPanelData> | undefined {
  if (!savedState) return undefined;

  const savedMap = new Map<string, SavedPanelData>(savedState.map(s => [s.id, s]));

  // If any current panel is missing from saved state, saved state is incompatible
  const hasNewPanel = panels.some(p => !savedMap.has(p.id));
  if (hasNewPanel) return undefined;

  return savedMap;
}

// ============================================================================
// ALGORITHM
// ============================================================================

/**
 * Step 1: Build working panels with constraints and raw sizes.
 */
function buildWorkingPanels(
  panels: ResizablePanelConfig[],
  containerSize: number,
  savedIndex: Map<string, SavedPanelData> | undefined
): WorkingPanel[] {
  return panels.map(config => {
    const constraints = calculateConstraintHierarchy(config, containerSize);
    const savedPanel = savedIndex?.get(config.id);
    const collapsed = resolveCollapsed(config, savedPanel);
    const isFixed = config.resizable === false;

    const savedRatio = savedPanel?.manualTargetRatio;

    let rawWidth: number;
    if (collapsed) {
      rawWidth = 0;
    } else if (savedRatio !== undefined && containerSize > 0) {
      // Scale from ratio — the panel wants (ratio * container) pixels
      rawWidth = savedRatio * containerSize;
    } else {
      rawWidth = resolveRawSize(config, containerSize, savedPanel);
    }

    return {
      config,
      constraints,
      width: rawWidth,
      collapsed,
      isFixed,
      manualTargetRatio: savedRatio,
    };
  });
}

/**
 * Allocate space for Tier 1 (fixed) and Tier 2 (ratio) panels.
 * Mutates panel widths in place. Returns the total reserved space.
 */
function allocateReservedPanels(visiblePanels: WorkingPanel[], containerSize: number): number {
  // Tier 1: Fixed panels (resizable: false)
  let reservedTotal = 0;
  for (const p of visiblePanels) {
    if (p.isFixed) {
      const { clamped } = clampToConstraints(p.width, p.constraints);
      p.width = clamped;
      reservedTotal += clamped;
    }
  }

  // Tier 2: Ratio panels (manualTargetRatio) — user constraints only.
  // These panels were explicitly sized by the user via drag, so system
  // constraints (meant for viewport-driven redistribution) don't apply.
  const ratioPanels = visiblePanels.filter(p => !p.isFixed && p.manualTargetRatio !== undefined);
  for (const p of ratioPanels) {
    const targetWidth = (p.manualTargetRatio ?? 0) * containerSize;
    const { clamped } = clampToConstraints(targetWidth, p.constraints, 'user');
    p.width = clamped;
    reservedTotal += clamped;
  }

  return reservedTotal;
}

/**
 * Iteratively clamp proportional panels to their constraint windows and
 * redistribute overflow/underflow to unclamped panels. Applies a final
 * clamp pass to catch floating-point drift.
 */
function constrainAndRedistribute(propPanels: WorkingPanel[]): void {
  const maxPasses = propPanels.length + 1;

  for (let pass = 0; pass < maxPasses; pass++) {
    let totalDelta = 0;
    const clampedIds = new Set<string>();

    for (const p of propPanels) {
      const { clamped, delta } = clampToConstraints(p.width, p.constraints);
      if (delta !== 0) {
        p.width = clamped;
        clampedIds.add(p.config.id);
        totalDelta += delta;
      }
    }

    if (totalDelta === 0) break;

    const freePanels = propPanels.filter(p => !clampedIds.has(p.config.id));
    if (freePanels.length === 0) break;

    const changePerPanel = -totalDelta / freePanels.length;
    for (const p of freePanels) {
      p.width += changePerPanel;
    }
  }

  // Final clamp to catch any floating-point drift
  for (const p of propPanels) {
    const { clamped } = clampToConstraints(p.width, p.constraints);
    p.width = clamped;
  }
}

/**
 * If total allocated width < containerSize (all proportional panels hit max),
 * expand the last non-fixed visible panel to absorb the gap.
 */
function applyFillGuarantee(visiblePanels: WorkingPanel[], propPanels: WorkingPanel[], containerSize: number): void {
  const allocatedTotal = visiblePanels.reduce((sum, p) => sum + p.width, 0);
  const gap = containerSize - allocatedTotal;
  if (gap > 1) {
    const lastFlexible = [...propPanels].reverse().find(p => !p.isFixed);
    if (lastFlexible) {
      lastFlexible.width += gap;
    }
  }
}

/**
 * Step 2: Distribute container space among non-collapsed panels.
 *
 * Distribution order (priority, highest first):
 *   1. Fixed panels (`resizable: false`) — keep exact initial pixel size
 *   2. Ratio panels (`manualTargetRatio`) — target (ratio × container), constrained
 *   3. Proportional panels — share remaining space using raw widths as weights
 *
 * After initial allocation, constraints are applied.
 * When a panel is min-clamped (forced larger), the extra space it consumed is
 * taken from unclamped proportional panels. When a panel is max-clamped (forced
 * smaller), the freed space is given back to unclamped proportional panels.
 * This redistribution iterates until stable (all panels within constraints) or
 * until no unclamped panels remain.
 */
function distributeSpace(working: WorkingPanel[], containerSize: number): void {
  // Early exit for zero container
  if (containerSize <= 0) {
    working.forEach(p => {
      if (!p.collapsed) p.width = 0;
    });
    return;
  }

  const visiblePanels = working.filter(p => !p.collapsed);
  if (visiblePanels.length === 0) return;

  // ── Tier 1 + 2: Fixed and ratio panels ────────────────────────────────────
  const reservedTotal = allocateReservedPanels(visiblePanels, containerSize);

  // ── Tier 3: Proportional panels ───────────────────────────────────────────
  const propPanels = visiblePanels.filter(p => !p.isFixed && p.manualTargetRatio === undefined);
  const remainingSpace = Math.max(0, containerSize - reservedTotal);

  if (propPanels.length === 0) return;

  // Use current raw widths as proportional weights
  const totalPropWeight = propPanels.reduce((sum, p) => sum + Math.max(0, p.width), 0);

  // Initial allocation: proportional share of remaining space
  for (const p of propPanels) {
    if (totalPropWeight > 0) {
      p.width = (p.width / totalPropWeight) * remainingSpace;
    } else {
      // All weights are zero — distribute equally
      p.width = remainingSpace / propPanels.length;
    }
  }

  // ── Constraint pass with overflow redistribution ──────────────────────────
  constrainAndRedistribute(propPanels);

  // ── Fill guarantee ──────────────────────────────────────────────────────
  applyFillGuarantee(visiblePanels, propPanels, containerSize);
}

/**
 * Distribute +1px to panels with the largest fractional remainders,
 * skipping panels that are at their max constraint or fixed.
 */
function distributeShortfall(remainders: { panel: WorkingPanel; remainder: number }[], shortfall: number): void {
  remainders.sort((a, b) => b.remainder - a.remainder);
  let remaining = shortfall;
  for (const { panel } of remainders) {
    if (remaining <= 0) break;
    const max = panel.constraints.systemMaxSizePixels ?? panel.constraints.userMaxSizePixels ?? Infinity;
    if (panel.width < max && !panel.isFixed) {
      panel.width += 1;
      remaining -= 1;
    }
  }
}

/**
 * Step 3: Round widths to integers and fix up rounding error.
 *
 * After distributing floating-point widths, some panels get ceil'd and some
 * floor'd. We use a "largest remainder" approach so the total always equals
 * the container size exactly (when not fully clamped by constraints).
 */
function roundWidths(working: WorkingPanel[], containerSize: number): void {
  if (containerSize <= 0) return;

  const visiblePanels = working.filter(p => !p.collapsed);
  if (visiblePanels.length === 0) return;

  // Floor all widths first, collect remainders
  const remainders: { panel: WorkingPanel; remainder: number }[] = [];

  for (const p of visiblePanels) {
    const floored = Math.floor(p.width);
    remainders.push({ panel: p, remainder: p.width - floored });
    p.width = floored;
  }

  const currentTotal = visiblePanels.reduce((s, p) => s + p.width, 0);
  const shortfall = containerSize - currentTotal;

  distributeShortfall(remainders, shortfall);
}

/**
 * Step 4: Compute absolute left/right positions for each panel.
 */
function computePositions(working: WorkingPanel[], containerSize: number): Map<string, PanelPosition> {
  const result = new Map<string, PanelPosition>();
  let cursor = 0;

  for (const p of working) {
    const width = p.collapsed ? 0 : p.width;
    const left = cursor;
    const right = Math.max(0, containerSize - left - width);

    result.set(p.config.id, {
      id: p.config.id,
      left,
      right,
      width,
      collapsed: p.collapsed,
      constraints: p.constraints,
    });

    cursor += width;
  }

  return result;
}

/**
 * Step 5: Compute handle positions.
 *
 * A handle is only generated for pairs of adjacent panels where BOTH panels
 * are resizable (resizable !== false). Pairs involving a fixed panel are
 * skipped entirely — no ResizableHandle component exists between them, and
 * including them in the array would shift the autoIndex values that handle
 * components use to look up their own position.
 *
 * Its left position equals the right edge of the before-panel.
 * It is disabled when either adjacent panel is collapsed.
 */
function computeHandles(panels: ResizablePanelConfig[], positions: Map<string, PanelPosition>): HandlePosition[] {
  const handles: HandlePosition[] = [];

  for (let i = 0; i < panels.length - 1; i++) {
    const before = panels[i];
    const after = panels[i + 1];

    // Skip pairs that involve a fixed (non-resizable) panel.
    // No ResizableHandle component is placed between fixed panels, so
    // generating an entry would misalign autoIndex → handles[] lookups.
    if (before.resizable === false || after.resizable === false) continue;

    const beforePos = positions.get(before.id);
    const afterPos = positions.get(after.id);

    if (!beforePos || !afterPos) continue;

    const disabled = beforePos.collapsed || afterPos.collapsed;

    handles.push({
      id: `${before.id}:${after.id}`,
      beforePanelId: before.id,
      afterPanelId: after.id,
      left: beforePos.left + beforePos.width,
      disabled,
    });
  }

  return handles;
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Compute the complete layout for a group of resizable panels.
 *
 * This is a pure function — it has no side effects and does not read from
 * or write to the DOM, Vue reactivity, or localStorage.
 *
 * @param input - Panel configs, container size, and optional saved state
 * @returns Immutable layout result with panel positions and handle positions
 *
 * @example
 * const layout = computeLayout({
 *   panels: registeredPanels,
 *   containerSize: containerWidth,
 *   savedState: loadFromStorage(),
 * });
 * const feedPos = layout.panels.get('feed-panel');
 * // feedPos.left, feedPos.width, feedPos.right, feedPos.collapsed
 */
export function computeLayout(input: LayoutInput): LayoutResult {
  const { panels, containerSize, savedState } = input;

  // Degenerate cases
  if (panels.length === 0) {
    return { panels: new Map(), handles: [] };
  }

  // Build saved-state lookup (returns undefined if incompatible with current panels)
  const savedIndex = buildSavedIndex(panels, savedState);

  const working = buildWorkingPanels(panels, containerSize, savedIndex);
  distributeSpace(working, containerSize);
  roundWidths(working, containerSize);
  const positions = computePositions(working, containerSize);
  const handles = computeHandles(panels, positions);

  return { panels: positions, handles };
}
