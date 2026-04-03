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

// Calculations (resize handling)
export { useResizeHandling, type ResizeHandler } from './useResizableCalculations';

// Supporting composables
export { useResizableStorage, localStorageAdapter, validateStoredPanelSize } from './useResizableStorage';
export { useResizableDrag, type DragState, type UseResizableDragOptions } from './useResizableDrag';

// Pure engine
export { computeLayout } from './computeLayout';
export { calculateConstraintHierarchy, clampSize, clampToTier } from './constraintResolver';

// Keyboard accessibility
export { useResizableKeyboard, KEYBOARD_INCREMENTS } from './useResizableKeyboard';
export type { ResizableKeyboardOptions, ResizableKeyboardMessages } from './useResizableKeyboard';

// Announcements (aria-live region)
export { useResizableAnnouncements } from './useResizableAnnouncements';

// Offset positioning
export { useResizableOffset } from './useResizableOffset';
export type { ResizableOffsetOptions, ResizableOffsetResult } from './useResizableOffset';

// Re-export types for convenience
export type * from '../resizable_constants';
