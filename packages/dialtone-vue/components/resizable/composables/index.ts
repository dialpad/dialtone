// Resizable Composables - Three-Layer Architecture

// Controller Layer (panel operations)
export { useResizablePanelControls } from './useResizablePanelControls';
export type {
  ResizablePanelControlsOptions,
  CollapseOptions,
  PreCollapseState,
  CollapseRequestSource,
  CollapseRequest,
  CollapseRequestResult,
} from './useResizablePanelControls';

// Core utilities (collapse rules, space allocation)
export {
  sortCollapseRules,
  allocateSpaceOnPanelOpen,
  checkAutoCollapseRules,
} from './useResizableCore';

// Reactive layout controller
export { useResizableGroup, type UseResizableGroupOptions } from './useResizableGroup';

// Model Layer (pure functions for state creation and constraints)
export {
  applyPanelPixelConstraints,
  createPanelState,
  createBasicPanelStates,
  ensureAtLeastOneUnlocked,
  shouldSkipPanelPair,
  canResetPanelPair,
} from './useResizablePanelState';

// Calculations (resize handling, panel sizing)
export { useResizeHandling, useResizablePanelSizing, type ResizeHandler } from './useResizableCalculations';

// Supporting composables
export { useResizableStorage, localStorageAdapter, validateStoredPanelSize } from './useResizableStorage';
export { useResizableDrag, type DragState, type UseResizableDragOptions } from './useResizableDrag';

// Pure engine
export { computeLayout } from './computeLayout';
export { calculateConstraintHierarchy, clampSize, clampToTier } from './constraintResolver';

// Keyboard accessibility
export { useResizableKeyboard, KEYBOARD_INCREMENTS } from './useResizableKeyboard';
export type { ResizableKeyboardOptions } from './useResizableKeyboard';

// Edit mode + announcements
export { useResizableEditMode } from './useResizableEditMode';

// Peek overlay
export { useResizablePeek } from './useResizablePeek';
export type { UseResizablePeekOptions, UseResizablePeekReturn } from './useResizablePeek';

// Offset positioning
export { useResizableOffset } from './useResizableOffset';
export type { ResizableOffsetOptions, ResizableOffsetResult } from './useResizableOffset';

// Re-export types for convenience
export type * from '../resizable_constants';
