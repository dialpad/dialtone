<template>
  <div
    ref="containerRef"
    :class="[
      'd-resizable',
      `d-resizable--${currentDirection}`,
      { 'd-resizable--resizing': isResizing },
      props.class,
    ]"
    :data-storage-key="props.storageKey || undefined"
  >
    <!-- @slot Container for panels and handles. -->
    <slot
      :panels="group.syncedPanels.value"
      :direction="currentDirection"
      :is-resizing="isResizing"
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
  watch,
  onUnmounted,
  provide,
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
  RESIZABLE_UPDATE_SAVED_PANEL_KEY,
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

// ── Transient drag state ──────────────────────────────────────────────────────
const isResizing = ref(false);
const activeHandleId = ref(undefined);
const activeCursorPosition = ref(0);

// Single resizeHandler instance for drag operations
const resizeHandler = useResizeHandling(props.direction, () => group.containerSize.value);

const isInitializing = group.isInitializing;
const registerPanel = (config) => group.registerPanel(config);
const unregisterPanel = (id) => group.unregisterPanel(id);
const saveToStorage = (panels) => group.saveCurrentLayout(panels);

// Panel control operations
const {
  resizePanel,
  collapsePanel,
  resetPanels: originalResetPanels,
  processAutoCollapseExpand,
  lockPanel,
  unlockPanel,
} = useResizablePanelControls({
  panels: group.syncedPanels,
  containerSize: group.containerSize,
  containerRef,
  onPanelResize: (panelId, size) => emit('panel-resize', panelId, size),
  onPanelCollapse: (panelId, collapsed) => emit('panel-collapse', panelId, collapsed),
  updateSavedPanel: (panelId, updates) => group.updateSavedPanel(panelId, updates),
});

// Wrapper for resetPanels that clears runtime ratios and updates storage
function resetPanels (beforePanelId, afterPanelId, behavior = 'all') {
  originalResetPanels(beforePanelId, afterPanelId, behavior);

  if (behavior === 'all') {
    group.syncedPanels.value.forEach(p => group.setManualTargetRatio(p.id, undefined));
    group.clearSavedState();
  } else {
    if (beforePanelId) group.setManualTargetRatio(beforePanelId, undefined);
    if (afterPanelId) group.setManualTargetRatio(afterPanelId, undefined);
  }
}

// Process auto-collapse/expand based on both container-width and panel-size triggers.
function processAutoCollapse () {
  processAutoCollapseExpand();
  if (!props.collapseRules?.length) return;
  const panels = group.syncedPanels.value;
  const panelsToCollapse = checkAutoCollapseRules(panels, props.collapseRules, group.containerSize.value);
  if (panelsToCollapse.length === 0) return;
  const panel = panels.find(p => p.id === panelsToCollapse[0]);
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
  panels: group.syncedPanels,
  containerSize: group.containerSize,
  resizeHandler,
  onDragStart (handleId) {
    isResizing.value = true;
    activeHandleId.value = handleId;
    emit('resize-start', handleId);
  },
  onDragEnd (beforePanelId, afterPanelId, beforeSize, afterSize, sizesChanged) {
    const handleId = drag.dragState.handleId ?? `${beforePanelId}:${afterPanelId}`;
    isResizing.value = false; activeHandleId.value = undefined; activeCursorPosition.value = 0;

    if (sizesChanged) {
      const roundedBefore = Math.round(beforeSize);
      const roundedAfter = Math.round(afterSize);
      const cSize = group.containerSize.value;
      const beforeRatio = cSize > 0 ? roundedBefore / cSize : undefined;
      const afterRatio = cSize > 0 ? roundedAfter / cSize : undefined;

      group.setManualTargetRatio(beforePanelId, beforeRatio);
      group.setManualTargetRatio(afterPanelId, afterRatio);
      group.updateSavedPanel(beforePanelId, { pixelSize: roundedBefore, manualTargetRatio: beforeRatio });
      group.updateSavedPanel(afterPanelId, { pixelSize: roundedAfter, manualTargetRatio: afterRatio });

      emit('resize-end', handleId);
      processAutoCollapse();
    }
  },
});

function startResize (handleId) { drag.startDrag(handleId); }
function stopResize () { drag.cancelDrag(); }
function savePanelsToStorage () { saveToStorage(group.syncedPanels.value); }
function emitPanelResize (panelId, size) { emit('panel-resize', panelId, size); }

// Auto-collapse triggered by layout changes (replaces viewport resize handler)
watch(group.syncedPanels, (panels) => {
  if (panels.length > 0 && !isInitializing.value) {
    processAutoCollapse();
  }
}, { flush: 'post' });

onUnmounted(() => {
  group.disconnectObserver();
  drag.cancelDrag();
});

// Provide/inject wiring for child components
const provideMap = [
  [RESIZABLE_LAYOUT_KEY, group.layout],
  [RESIZABLE_PANELS_KEY, group.syncedPanels],
  [RESIZABLE_DIRECTION_KEY, currentDirection],
  [RESIZABLE_CONTAINER_SIZE_KEY, group.containerSize],
  [RESIZABLE_CONTAINER_ELEMENT_KEY, computed(() => containerRef.value)],
  [RESIZABLE_IS_RESIZING_KEY, computed(() => isResizing.value)],
  [RESIZABLE_ACTIVE_HANDLE_KEY, computed(() => activeHandleId.value)],
  [RESIZABLE_ACTIVE_CURSOR_POSITION_KEY, computed(() => activeCursorPosition.value ?? 0)],
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
  [RESIZABLE_UPDATE_SAVED_PANEL_KEY, (panelId, updates) => group.updateSavedPanel(panelId, updates)],
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
  state: computed(() => ({
    direction: currentDirection.value,
    panels: group.syncedPanels.value,
    containerSize: group.containerSize.value,
    isResizing: isResizing.value,
    activeHandleId: activeHandleId.value,
    activeCursorPosition: activeCursorPosition.value,
  })),
  panelConfigs: computed(() => props.panels),
  allocationStrategy: computed(() => props.spaceAllocationStrategy),
});
</script>
