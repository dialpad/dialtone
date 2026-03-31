/**
 * Constraint Resolver
 *
 * Pure functions for resolving the constraint hierarchy for resizable panels.
 * No DOM access, no Vue reactivity, no side effects.
 *
 * @see computeLayout.ts
 * @see ../resizable_constants.ts
 */

import type { ResizablePanelConfig } from '../resizable_constants';
import { parseSizeToPixels } from '../resizable_utils';

// ============================================================================
// TYPES
// ============================================================================

/**
 * Result of constraint hierarchy calculation.
 * User limits are absolute boundaries; system limits are the operating range within user limits.
 */
export interface ConstraintHierarchy {
  // User drag limits (absolute boundaries)
  userMinSizePixels?: number;
  userMaxSizePixels?: number;
  // System scaling limits (operating range within user limits)
  systemMinSizePixels?: number;
  systemMaxSizePixels?: number;
  // Auto-collapse threshold (container width, not panel width)
  collapseSizePixels?: number;
}

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

/**
 * Resolve user constraints (drag limits) from panel config.
 */
export function resolveUserConstraints(
  panelConfig: ResizablePanelConfig,
  containerSize: number
): { userMinSizePixels?: number; userMaxSizePixels?: number } {
  return {
    userMinSizePixels: panelConfig.userMinSize ? parseSizeToPixels(panelConfig.userMinSize, containerSize) : undefined,
    userMaxSizePixels: panelConfig.userMaxSize ? parseSizeToPixels(panelConfig.userMaxSize, containerSize) : undefined,
  };
}

/**
 * Clamp system min to be at least user min.
 * System constraints that exceed user boundaries are silently clamped
 * since this is expected behavior during constraint resolution.
 */
export function clampSystemMin(systemMin: number | undefined, userMin: number | undefined): number | undefined {
  if (systemMin === undefined || userMin === undefined) return systemMin;
  return Math.max(systemMin, userMin);
}

/**
 * Clamp system max to be at most user max.
 * System constraints that exceed user boundaries are silently clamped
 * since this is expected behavior during constraint resolution.
 */
export function clampSystemMax(systemMax: number | undefined, userMax: number | undefined): number | undefined {
  if (systemMax === undefined || userMax === undefined) return systemMax;
  return Math.min(systemMax, userMax);
}

/**
 * Resolve system constraints with fallback to user constraints.
 * System limits are silently clamped to stay within user limits.
 */
export function resolveSystemConstraints(
  panelConfig: ResizablePanelConfig,
  containerSize: number,
  userMinSizePixels?: number,
  userMaxSizePixels?: number
): { systemMinSizePixels?: number; systemMaxSizePixels?: number } {
  // Calculate system limits from props, or fall back to user limits
  const rawSystemMin = panelConfig.systemMinSize
    ? parseSizeToPixels(panelConfig.systemMinSize, containerSize)
    : userMinSizePixels;
  const rawSystemMax = panelConfig.systemMaxSize
    ? parseSizeToPixels(panelConfig.systemMaxSize, containerSize)
    : userMaxSizePixels;

  // Validate and clamp system limits within user limits
  const systemMinSizePixels = clampSystemMin(rawSystemMin, userMinSizePixels);
  const systemMaxSizePixels = clampSystemMax(rawSystemMax, userMaxSizePixels);

  return { systemMinSizePixels, systemMaxSizePixels };
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Calculate the complete constraint hierarchy for a panel.
 *
 * This separates user drag limits from system scaling limits:
 * - User limits (userMinSize/userMaxSize) are absolute boundaries for user dragging
 * - System limits (systemMinSize/systemMaxSize) are the operating range for viewport resize
 * - System limits must be within user limits (clamped silently if not)
 *
 * @param panelConfig - Panel configuration
 * @param containerSize - Current container size in pixels
 * @returns Complete constraint hierarchy with all pixel values
 */
export function calculateConstraintHierarchy(
  panelConfig: ResizablePanelConfig,
  containerSize: number
): ConstraintHierarchy {
  // Resolve user constraints (drag limits)
  const { userMinSizePixels, userMaxSizePixels } = resolveUserConstraints(panelConfig, containerSize);

  // Resolve system constraints (viewport resize limits) with fallback to user limits
  const { systemMinSizePixels, systemMaxSizePixels } = resolveSystemConstraints(
    panelConfig,
    containerSize,
    userMinSizePixels,
    userMaxSizePixels
  );

  // Calculate collapse threshold (container width trigger, NOT a panel size)
  // Don't clamp to container - this threshold is compared AGAINST the container width
  const collapseSizePixels = panelConfig.collapseSize
    ? parseSizeToPixels(panelConfig.collapseSize, containerSize, { clampToContainer: false })
    : undefined;

  return {
    userMinSizePixels,
    userMaxSizePixels,
    systemMinSizePixels,
    systemMaxSizePixels,
    collapseSizePixels,
  };
}
