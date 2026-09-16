// Resizable Composables - Three-Layer Architecture

// Controller Layer (panel operations + collapse rule utilities)
export {
  useResizablePanelControls,
  sortCollapseRules,
  checkAutoCollapseRules,
} from './UseResizablePanelControls';
export type {
  ResizablePanelControlsOptions,
  CollapseOptions,
  PreCollapseState,
  CollapseRequestSource,
  CollapseRequest,
  CollapseRequestResult,
} from './UseResizablePanelControls';

// Reactive layout controller
export { useResizableGroup, type UseResizableGroupOptions } from './UseResizableGroup';

// Model Layer (pure functions for state creation and constraints)
export {
  applyPanelPixelConstraints,
  createPanelState,
  createBasicPanelStates,
  shouldSkipPanelPair,
  canResetPanelPair,
} from './UseResizablePanelState';

// Calculations (resize handling)
export { useResizeHandling, type ResizeHandler } from './UseResizableCalculations';

// Supporting composables
export { useResizableStorage, localStorageAdapter, validateStoredPanelSize } from './UseResizableStorage';
export { useResizableDrag, type DragState, type UseResizableDragOptions } from './UseResizableDrag';

// Pure engine
export { computeLayout } from './ComputeLayout';
export { calculateConstraintHierarchy, clampSize, clampToTier } from './ConstraintResolver';

// Keyboard accessibility
export { useResizableKeyboard, KEYBOARD_INCREMENTS } from './UseResizableKeyboard';
export type { ResizableKeyboardOptions, ResizableKeyboardMessages } from './UseResizableKeyboard';

// Announcements (aria-live region)
export { useResizableAnnouncements } from './UseResizableAnnouncements';

// Offset positioning
export { useResizableOffset } from './UseResizableOffset';
export type { ResizableOffsetOptions, ResizableOffsetResult } from './UseResizableOffset';

// Re-export types for convenience
export type * from '../ResizableConstants';
