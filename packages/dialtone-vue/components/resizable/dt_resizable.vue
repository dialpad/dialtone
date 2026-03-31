<template>
  <div
    ref="containerRef"
    :class="[
      'dt-resizable',
      `dt-resizable--${currentDirection}`,
      { 'dt-resizable--resizing': state.isResizing },
      props.class,
    ]"
    :data-storage-key="props.storageKey || undefined"
  >
    <slot
      :panels="state.panels"
      :direction="currentDirection"
      :is-resizing="state.isResizing"
      :resize-panel="resizePanel"
      :collapse-panel="collapsePanel"
      :start-resize="startResize"
      :stop-resize="stopResize"
    />
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  reactive,
  watch,
  onMounted,
  onUnmounted,
  provide,
  readonly,
} from 'vue';
import {
  RESIZABLE_LAYOUT_KEY,
  RESIZABLE_PANELS_KEY,
  RESIZABLE_DIRECTION_KEY,
  RESIZABLE_CONTAINER_SIZE_KEY,
  RESIZABLE_CONTAINER_ELEMENT_KEY,
  RESIZABLE_IS_RESIZING_KEY,
  RESIZABLE_ACTIVE_HANDLE_KEY,
  RESIZABLE_ACTIVE_CURSOR_POSITION_KEY,
  RESIZABLE_IS_EDIT_MODE_KEY,
  RESIZABLE_IS_INITIALIZING_KEY,
  RESIZABLE_START_RESIZE_KEY,
  RESIZABLE_RESET_PANELS_KEY,
  RESIZABLE_REGISTER_HANDLE_KEY,
  RESIZABLE_UNREGISTER_HANDLE_KEY,
  RESIZABLE_REGISTER_PANEL_KEY,
  RESIZABLE_UNREGISTER_PANEL_KEY,
  RESIZABLE_REGISTER_EDIT_HANDLE_KEY,
  RESIZABLE_UNREGISTER_EDIT_HANDLE_KEY,
  RESIZABLE_SAVE_TO_STORAGE_KEY,
  RESIZABLE_COLLAPSE_PANEL_KEY,
  RESIZABLE_EMIT_PANEL_RESIZE_KEY,
} from './resizable_constants';
import {
  useResizablePanelControls,
  useResizableGroup,
  useResizeHandling,
  checkAutoCollapseRules,
} from './composables';
import { useResizableDrag, findPanelsForHandle } from './composables/useResizableDrag';

const props = defineProps({
  /** @values 'row', 'column' */
  direction: {
    type: String,
    default: 'row',
  },
  storageKey: {
    type: String,
    default: null,
  },
  class: {
    type: [String, Object, Array],
    default: '',
  },
  /** Rules defining which panels collapse first when space is constrained */
  collapseRules: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  'panel-resize',
  'panel-collapse',
  'resize-start',
  'resize-end',
]);

const containerRef = ref(null);

// ── Reactive layout controller ──────────────────────────────────────────────
const currentDirection = computed(() => props.direction);

const group = useResizableGroup({
  storageKey: props.storageKey ?? null,
  direction: currentDirection,
  containerRef,
});

// ── Mutable group state (shared with drag/collapse/controls) ────────────────
const state = reactive({
  direction: props.direction,
  panels: [],
  containerSize: 0,
  isResizing: false,
  activeHandleId: undefined,
  activeCursorPosition: 0,
});

// Single resizeHandler instance for drag operations (shared with panel controls)
const resizeHandler = useResizeHandling(props.direction, () => state.containerSize);

// Keep state.panels and state.containerSize in sync with the computed values
// produced by useResizableGroup. Any layout recompute propagates here.
function panelsChanged (a, b) {
  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].pixelSize !== b[i].pixelSize ||
      a[i].collapsed !== b[i].collapsed ||
      a[i].locked !== b[i].locked
    )
      return true;
  }
  return false;
}

let lastPanels = [];
watch(
  group.syncedPanels,
  panels => {
    if (panelsChanged(panels, lastPanels)) {
      lastPanels = panels;
      state.panels = panels;
    }
  },
  { immediate: true, deep: false, flush: 'post' },
);
watch(
  group.containerSize,
  size => {
    state.containerSize = size;
  },
  { immediate: true },
);

const isInitializing = group.isInitializing;

// Delegates to the composable's panel registry
function registerPanel (config) {
  group.registerPanel(config);
}
function unregisterPanel (id) {
  group.unregisterPanel(id);
}

/**
 * Force-read the container element's current size.
 *
 * Kept for useResizablePanelControls, which calls this after imperative panel
 * mutations (resizePanel, collapsePanel). The ResizeObserver in useResizableGroup
 * also writes to the same ref, but it fires asynchronously after layout. This
 * synchronous write ensures the layout computed re-runs immediately.
 */
function updateContainerSize () {
  if (!containerRef.value) return;
  const size = props.direction === 'row' ? containerRef.value.clientWidth : containerRef.value.clientHeight;
  group.containerSize.value = size;
}

function saveToStorage (panels) {
  group.saveCurrentLayout(panels);
}

// Panel control operations - uses shared resizeHandler from Integration layer
const {
  resizePanel,
  collapsePanel,
  resetPanels: originalResetPanels,
  handleViewportResize,
  processAutoCollapseExpand,
  lockPanel,
  unlockPanel,
} = useResizablePanelControls({
  panels: computed(() => state.panels),
  containerSize: computed(() => state.containerSize),
  containerRef,
  resizeHandler,
  onPanelResize: (panelId, size) => emit('panel-resize', panelId, size),
  onPanelCollapse: (panelId, collapsed) => {
    emit('panel-collapse', panelId, collapsed);
  },
  updateContainerSize,
  saveToStorage,
  isInitializing,
});

// Wrapper for resetPanels that clears storage after reset
function resetPanels (beforePanelId, afterPanelId, behavior = 'all') {
  originalResetPanels(beforePanelId, afterPanelId, behavior);
  group.clearSavedState();
}

/**
 * Process auto-collapse/expand based on both container-width and panel-size triggers.
 */
function processAutoCollapse () {
  processAutoCollapseExpand();

  if (props.collapseRules && props.collapseRules.length > 0) {
    const panelsToCollapse = checkAutoCollapseRules(state.panels, props.collapseRules, state.containerSize);

    if (panelsToCollapse.length > 0) {
      const panelId = panelsToCollapse[0];
      const panel = state.panels.find(p => p.id === panelId);
      if (panel && !panel.collapsed) {
        collapsePanel(panelId, true);
      }
    }
  }
}

// ── Edit mode stub (V4 — keyboard accessibility) ────────────────────────────
// Provide a static false for isEditMode so child handles can inject it.
// V4 will replace this with useResizableEditMode().
const isEditMode = computed(() => false);
const editModeRegisterHandle = () => {};
const editModeUnregisterHandle = () => {};

/**
 * Handle registry — ordered list of handle instance references.
 */
const handleRegistryList = [];

function registerHandle (handleInstance) {
  handleRegistryList.push(handleInstance);
  return handleRegistryList.length - 1;
}

function unregisterHandle (handleInstance) {
  const index = handleRegistryList.indexOf(handleInstance);
  if (index !== -1) {
    handleRegistryList.splice(index, 1);
  }
}

// ── Per-group drag composable ─────────────────────────────────────────────────
const drag = useResizableDrag({
  direction: currentDirection,
  containerRef,
  panels: computed(() => state.panels),
  containerSize: computed(() => state.containerSize),
  resizeHandler,
  onDragStart (handleId) {
    state.isResizing = true;
    state.activeHandleId = handleId;
    emit('resize-start', handleId);
  },
  onDragEnd (beforePanelId, afterPanelId, beforeSize, afterSize, sizesChanged) {
    const beforePanel = state.panels.find(p => p.id === beforePanelId);
    const afterPanel = state.panels.find(p => p.id === afterPanelId);

    if (sizesChanged && beforePanel && afterPanel) {
      beforePanel.pixelSize = Math.round(beforeSize);
      afterPanel.pixelSize = Math.round(afterSize);

      if (state.containerSize > 0) {
        beforePanel.manualTargetRatio = beforePanel.pixelSize / state.containerSize;
        afterPanel.manualTargetRatio = afterPanel.pixelSize / state.containerSize;
        group.setManualTargetRatio(beforePanelId, beforePanel.manualTargetRatio);
        group.setManualTargetRatio(afterPanelId, afterPanel.manualTargetRatio);
      }

      beforePanel.manualTargetSize = beforePanel.pixelSize;
      afterPanel.manualTargetSize = afterPanel.pixelSize;
    }

    const handleId = drag.dragState.handleId ?? `${beforePanelId}:${afterPanelId}`;

    state.isResizing = false;
    state.activeHandleId = undefined;
    state.activeCursorPosition = 0;

    if (sizesChanged) {
      emit('resize-end', handleId);
      saveToStorage(state.panels);
      processAutoCollapse();
    }
  },
});

/**
 * Start a resize drag for the given handle.
 */
function startResize (handleId) {
  drag.startDrag(handleId);
}

/**
 * Cancel any active resize drag. Exposed via scoped slot for consumers.
 */
function stopResize () {
  drag.cancelDrag();
}

function savePanelsToStorage () {
  saveToStorage(state.panels);
}

function emitPanelResize (panelId, size) {
  emit('panel-resize', panelId, size);
}

// Viewport resize handling
watch(group.containerSize, () => {
  if (state.panels.length > 0 && !isInitializing.value) {
    handleViewportResize();
    processAutoCollapse();
  }
});

// ── Reset request listener (used by edit mode and programmatic control) ─────
let resetRequestHandler = null;

onMounted(() => {
  if (containerRef.value) {
    resetRequestHandler = (event) => {
      const customEvent = event;

      if (customEvent.detail.resetType === 'all') {
        resetPanels('', '', 'all');
      } else if (customEvent.detail.resetType === 'current' && customEvent.detail.handleElement) {
        const handleElement = customEvent.detail.handleElement;
        const handleId = handleElement.getAttribute('data-handle-id');

        if (handleId) {
          const { beforePanel, afterPanel } = findPanelsForHandle(handleId, state.panels);
          if (beforePanel && afterPanel) {
            resetPanels(beforePanel.id, afterPanel.id, 'both');
          }
        }
      }
    };

    containerRef.value.addEventListener('resizable-reset-request', resetRequestHandler);
  }
});

onUnmounted(() => {
  group.disconnectObserver();
  drag.cancelDrag();

  if (resetRequestHandler && containerRef.value) {
    containerRef.value.removeEventListener('resizable-reset-request', resetRequestHandler);
    resetRequestHandler = null;
  }
});

// Provide values for child components using typed InjectionKeys
provide(RESIZABLE_LAYOUT_KEY, group.layout);
provide(RESIZABLE_PANELS_KEY, computed(() => state.panels));
provide(RESIZABLE_DIRECTION_KEY, currentDirection);
provide(RESIZABLE_CONTAINER_SIZE_KEY, computed(() => state.containerSize));
provide(RESIZABLE_CONTAINER_ELEMENT_KEY, computed(() => containerRef.value));
provide(RESIZABLE_IS_RESIZING_KEY, computed(() => state.isResizing));
provide(RESIZABLE_ACTIVE_HANDLE_KEY, computed(() => state.activeHandleId));
provide(RESIZABLE_ACTIVE_CURSOR_POSITION_KEY, computed(() => state.activeCursorPosition ?? 0));
provide(RESIZABLE_IS_EDIT_MODE_KEY, isEditMode);
provide(RESIZABLE_IS_INITIALIZING_KEY, computed(() => isInitializing.value));
provide(RESIZABLE_START_RESIZE_KEY, (handleId) => startResize(handleId));
provide(RESIZABLE_RESET_PANELS_KEY, resetPanels);
provide(RESIZABLE_REGISTER_HANDLE_KEY, registerHandle);
provide(RESIZABLE_UNREGISTER_HANDLE_KEY, unregisterHandle);
provide(RESIZABLE_REGISTER_PANEL_KEY, registerPanel);
provide(RESIZABLE_UNREGISTER_PANEL_KEY, unregisterPanel);
provide(RESIZABLE_REGISTER_EDIT_HANDLE_KEY, editModeRegisterHandle);
provide(RESIZABLE_UNREGISTER_EDIT_HANDLE_KEY, editModeUnregisterHandle);
provide(RESIZABLE_SAVE_TO_STORAGE_KEY, savePanelsToStorage);
provide(RESIZABLE_COLLAPSE_PANEL_KEY, collapsePanel);
provide(RESIZABLE_EMIT_PANEL_RESIZE_KEY, emitPanelResize);

// Expose methods for programmatic control
defineExpose({
  resizePanel,
  collapsePanel,
  resetPanels,
  lockPanel,
  unlockPanel,
  state: readonly(state),
});
</script>

<style lang="less">
.dt-resizable {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;

  &--row {
    // Row direction is the default — panels positioned with left/right.
  }

  &--column {
    // Column direction — panels positioned with top/bottom instead.
  }

  &--resizing {
    // Applied during active drag — consumers can use this to disable
    // pointer events on iframes or text selection on children.
  }
}
</style>
