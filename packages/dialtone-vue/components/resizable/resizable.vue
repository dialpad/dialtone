<template>
  <div
    ref="containerRef"
    :class="[
      'd-resizable',
      `d-resizable--${currentDirection}`,
      { 'd-resizable--resizing': state.isResizing },
      props.class,
    ]"
    :data-storage-key="props.storageKey || undefined"
  >
    <!-- @slot Container for panels and handles. -->
    <slot
      :panels="state.panels"
      :direction="currentDirection"
      :is-resizing="state.isResizing"
      :space-allocation-strategy="props.spaceAllocationStrategy"
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
  RESIZABLE_IS_INITIALIZING_KEY,
  RESIZABLE_START_RESIZE_KEY,
  RESIZABLE_RESET_PANELS_KEY,
  RESIZABLE_REGISTER_HANDLE_KEY,
  RESIZABLE_UNREGISTER_HANDLE_KEY,
  RESIZABLE_REGISTER_PANEL_KEY,
  RESIZABLE_UNREGISTER_PANEL_KEY,
  RESIZABLE_SAVE_TO_STORAGE_KEY,
  RESIZABLE_COLLAPSE_PANEL_KEY,
  RESIZABLE_EMIT_PANEL_RESIZE_KEY,
  RESIZABLE_MESSAGES_KEY,
  RESIZABLE_ANNOUNCE_KEY,
} from './resizable_constants';
import {
  useResizablePanelControls,
  useResizableGroup,
  useResizeHandling,
  checkAutoCollapseRules,
  useResizableAnnouncements,
} from './composables';
import { useResizableDrag } from './composables/useResizableDrag';

const props = defineProps({
  /**
   * Layout direction. 'row' for horizontal, 'column' for vertical.
   * @values 'row', 'column'
   */
  direction: {
    type: String,
    default: 'row',
  },
  /** localStorage key for persisting panel sizes across page loads. */
  storageKey: {
    type: String,
    default: null,
  },
  /** Additional CSS classes applied to the container element. */
  class: {
    type: [String, Object, Array],
    default: '',
  },
  /**
   * Panel configurations array. When provided, panels are initialized
   * from this array instead of registering via child DtResizablePanel components.
   */
  panels: {
    type: Array,
    default: () => [],
  },
  /**
   * Strategy for redistributing space when panels open/close.
   * @values 'proportional', 'preserve-manual'
   */
  spaceAllocationStrategy: {
    type: String,
    default: 'proportional',
    validator: (val) => ['proportional', 'preserve-manual'].includes(val),
  },
  /** Rules defining which panels collapse first when space is constrained */
  collapseRules: {
    type: Array,
    default: () => [],
  },
  /** Custom storage adapter. Overrides storageKey when both are provided. */
  storage: {
    type: Object,
    default: null,
  },
  /**
   * i18n message overrides for screen reader announcements.
   * Accepts keys from ResizableKeyboardMessages.
   */
  messages: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(
  /**
   * @event panel-resize - Emitted when a panel is resized. Payload: (panelId, size).
   * @event panel-collapse - Emitted when a panel collapses or expands. Payload: (panelId, collapsed).
   * @event resize-start - Emitted when a resize drag begins. Payload: (handleId).
   * @event resize-end - Emitted when a resize drag ends. Payload: (handleId).
   */
  ['panel-resize', 'panel-collapse', 'resize-start', 'resize-end'],
);

const containerRef = ref(null);

// ── Reactive layout controller ──────────────────────────────────────────────
const currentDirection = computed(() => props.direction);

// Note: storageKey and storage are captured at mount time. If they need to
// change dynamically in the future, useResizableGroup should accept refs.
const group = useResizableGroup({
  storageKey: props.storageKey ?? null,
  direction: currentDirection,
  containerRef,
  storageAdapter: props.storage ?? undefined,
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

// Sync state.panels / containerSize with useResizableGroup's computed values.
// Custom comparator avoids deep: true watch — panel objects change identity on
// every computeLayout recompute, but we only propagate when layout-affecting
// fields actually change. This prevents unnecessary downstream re-renders.
function panelsChanged (a, b) {
  if (a.length !== b.length) return true;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i]; const bi = b[i];
    if (ai.id !== bi.id || ai.pixelSize !== bi.pixelSize || ai.collapsed !== bi.collapsed || ai.locked !== bi.locked) {
      return true;
    }
  }
  return false;
}

let lastPanels = [];
watch(group.syncedPanels, panels => {
  if (panelsChanged(panels, lastPanels)) { lastPanels = panels; state.panels = panels; }
}, { immediate: true, deep: false, flush: 'post' });
watch(group.containerSize, size => { state.containerSize = size; }, { immediate: true });

const isInitializing = group.isInitializing;
const registerPanel = (config) => group.registerPanel(config);
const unregisterPanel = (id) => group.unregisterPanel(id);
const saveToStorage = (panels) => group.saveCurrentLayout(panels);

// Force-read container size synchronously (for imperative mutations)
function updateContainerSize () {
  if (!containerRef.value) return;
  group.containerSize.value = props.direction === 'row'
    ? containerRef.value.clientWidth : containerRef.value.clientHeight;
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
  onPanelCollapse: (panelId, collapsed) => emit('panel-collapse', panelId, collapsed),
  updateContainerSize,
  saveToStorage,
  isInitializing,
});

// Wrapper for resetPanels that clears runtime ratios and updates storage
function resetPanels (beforePanelId, afterPanelId, behavior = 'all') {
  originalResetPanels(beforePanelId, afterPanelId, behavior);

  if (behavior === 'all') {
    // Clear all runtime ratios and saved state
    state.panels.forEach(p => group.setManualTargetRatio(p.id, undefined));
    group.clearSavedState();
  } else {
    // Clear runtime ratios for the affected panels only
    if (beforePanelId) group.setManualTargetRatio(beforePanelId, undefined);
    if (afterPanelId) group.setManualTargetRatio(afterPanelId, undefined);
    saveToStorage(state.panels);
  }
}

// Process auto-collapse/expand based on both container-width and panel-size triggers.
function processAutoCollapse () {
  processAutoCollapseExpand();
  if (!props.collapseRules?.length) return;
  const panelsToCollapse = checkAutoCollapseRules(state.panels, props.collapseRules, state.containerSize);
  if (panelsToCollapse.length === 0) return;
  const panel = state.panels.find(p => p.id === panelsToCollapse[0]);
  if (panel && !panel.collapsed) collapsePanel(panelsToCollapse[0], true);
}

// ── Announcements (aria-live region for screen readers) ─────────────────
const { announce } = useResizableAnnouncements();

// Handle registry
const handleRegistryList = [];
function registerHandle (inst) { handleRegistryList.push(inst); return handleRegistryList.length - 1; }
function unregisterHandle (inst) {
  const idx = handleRegistryList.indexOf(inst);
  if (idx !== -1) handleRegistryList.splice(idx, 1);
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
    const bp = state.panels.find(p => p.id === beforePanelId);
    const ap = state.panels.find(p => p.id === afterPanelId);
    if (sizesChanged && bp && ap) {
      bp.pixelSize = Math.round(beforeSize);
      ap.pixelSize = Math.round(afterSize);
      if (state.containerSize > 0) {
        bp.manualTargetRatio = bp.pixelSize / state.containerSize;
        ap.manualTargetRatio = ap.pixelSize / state.containerSize;
        group.setManualTargetRatio(beforePanelId, bp.manualTargetRatio);
        group.setManualTargetRatio(afterPanelId, ap.manualTargetRatio);
      }
      bp.manualTargetSize = bp.pixelSize;
      ap.manualTargetSize = ap.pixelSize;
    }
    const handleId = drag.dragState.handleId ?? `${beforePanelId}:${afterPanelId}`;
    state.isResizing = false; state.activeHandleId = undefined; state.activeCursorPosition = 0;
    if (sizesChanged) { emit('resize-end', handleId); saveToStorage(state.panels); processAutoCollapse(); }
  },
});

function startResize (handleId) { drag.startDrag(handleId); }
function stopResize () { drag.cancelDrag(); }
function savePanelsToStorage () { saveToStorage(state.panels); }
function emitPanelResize (panelId, size) { emit('panel-resize', panelId, size); }

// Viewport resize handling
watch(group.containerSize, () => {
  if (state.panels.length > 0 && !isInitializing.value) {
    handleViewportResize();
    processAutoCollapse();
  }
});

onUnmounted(() => {
  group.disconnectObserver();
  drag.cancelDrag();
});

// Provide/inject wiring for child components
const provideMap = [
  [RESIZABLE_LAYOUT_KEY, group.layout],
  [RESIZABLE_PANELS_KEY, computed(() => state.panels)],
  [RESIZABLE_DIRECTION_KEY, currentDirection],
  [RESIZABLE_CONTAINER_SIZE_KEY, computed(() => state.containerSize)],
  [RESIZABLE_CONTAINER_ELEMENT_KEY, computed(() => containerRef.value)],
  [RESIZABLE_IS_RESIZING_KEY, computed(() => state.isResizing)],
  [RESIZABLE_ACTIVE_HANDLE_KEY, computed(() => state.activeHandleId)],
  [RESIZABLE_ACTIVE_CURSOR_POSITION_KEY, computed(() => state.activeCursorPosition ?? 0)],
  [RESIZABLE_IS_INITIALIZING_KEY, computed(() => isInitializing.value)],
  [RESIZABLE_START_RESIZE_KEY, (handleId) => startResize(handleId)],
  [RESIZABLE_RESET_PANELS_KEY, resetPanels],
  [RESIZABLE_REGISTER_HANDLE_KEY, registerHandle],
  [RESIZABLE_UNREGISTER_HANDLE_KEY, unregisterHandle],
  [RESIZABLE_REGISTER_PANEL_KEY, registerPanel],
  [RESIZABLE_UNREGISTER_PANEL_KEY, unregisterPanel],
  [RESIZABLE_SAVE_TO_STORAGE_KEY, savePanelsToStorage],
  [RESIZABLE_ANNOUNCE_KEY, announce],
  [RESIZABLE_COLLAPSE_PANEL_KEY, collapsePanel],
  [RESIZABLE_EMIT_PANEL_RESIZE_KEY, emitPanelResize],
  [RESIZABLE_MESSAGES_KEY, props.messages],
];
provideMap.forEach(([key, val]) => provide(key, val));

// Expose methods for programmatic control
defineExpose({
  resizePanel,
  collapsePanel,
  resetPanels,
  lockPanel,
  unlockPanel,
  state: readonly(state),
  panelConfigs: computed(() => props.panels),
  allocationStrategy: computed(() => props.spaceAllocationStrategy),
});
</script>
