// Resizable Composables - Three-Layer Architecture
// Integration Layer (orchestration, storage, initialization)
export {
  useResizableGroupSetup,
  useResizablePanelControls,
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

// Controller Layer (panel operations) - also re-exported from useResizableCore
export type {
  ResizablePanelControlsOptions,
  CollapseOptions,
  PreCollapseState,
  CollapseRequestSource,
  CollapseRequest,
  CollapseRequestResult,
} from './useResizablePanelControls';

// Calculations (resize handling, panel sizing)
export { useResizeHandling, useResizablePanelSizing, type ResizeHandler } from './useResizableCalculations';

// Supporting composables
export { useResizableStorage } from './useResizableStorage';
export { useResizableDrag, type DragState, type UseResizableDragOptions } from './useResizableDrag';

// Pure engine
export { computeLayout } from './computeLayout';
export { calculateConstraintHierarchy } from './constraintResolver';

// Keyboard accessibility
export { useResizableKeyboard, KEYBOARD_INCREMENTS } from './useResizableKeyboard';
export type { ResizableKeyboardOptions } from './useResizableKeyboard';

// Edit mode + announcements
export { useResizableEditMode } from './useResizableEditMode';

// Peek overlay
export { useResizablePeek } from './useResizablePeek';
export type { UseResizablePeekOptions, UseResizablePeekReturn } from './useResizablePeek';

// Re-export types for convenience
export type * from '../resizable_constants';
