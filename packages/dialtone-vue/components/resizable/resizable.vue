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
import { RESIZABLE_CONTEXT_KEY, buildHandleId } from './resizable_constants';
import {
  useResizablePanelControls,
  useResizableGroup,
  useResizeHandling,
  checkAutoCollapseRules,
  useResizableAnnouncements,
  useResizableOffset,
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
  /** CSS selector for a fixed element to offset handles and panel content from. */
  offsetElement: { type: String, default: null },
  /** Explicit pixel offset. Overrides offsetElement measurement when both provided. */
  offsetAmount: { type: Number, default: null },
  /**
   * Which edge(s) the offset applies to.
   * @values 'start', 'end', 'both'
   */
  offsetDirection: { type: String, default: 'start' },
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

const currentDirection = computed(() => props.direction);

// Note: storageKey and storage are captured at mount time. If they need to
// change dynamically in the future, useResizableGroup should accept refs.
const group = useResizableGroup({
  storageKey: props.storageKey ?? null,
  direction: currentDirection,
  containerRef,
  storageAdapter: props.storage ?? undefined,
});

const isResizing = ref(false);
const activeHandleId = ref(undefined);

const resizeHandler = useResizeHandling(() => group.containerSize.value);

const isInitializing = group.isInitializing;
const registerPanel = (config) => group.registerPanel(config);
const unregisterPanel = (id) => group.unregisterPanel(id);
const saveToStorage = (panels) => group.saveCurrentLayout(panels);

const {
  commitPanelSize,
  resizePanel,
  collapsePanel,
  resetPanels: originalResetPanels,
  processAutoCollapseExpand,
} = useResizablePanelControls({
  panels: group.syncedPanels,
  containerSize: group.containerSize,
  containerRef,
  onPanelResize: (panelId, size) => emit('panel-resize', panelId, size),
  onPanelCollapse: (panelId, collapsed) => emit('panel-collapse', panelId, collapsed),
  updateSavedPanel: (panelId, updates) => group.updateSavedPanel(panelId, updates),
});

function resetPanels (beforePanelId, afterPanelId, behavior = 'all') {
  originalResetPanels(beforePanelId, afterPanelId, behavior);

  if (behavior === 'all') {
    group.syncedPanels.value.forEach(p => group.updateSavedPanel(p.id, { manualTargetRatio: undefined }));
    group.clearSavedState();
  } else {
    if (beforePanelId) group.updateSavedPanel(beforePanelId, { manualTargetRatio: undefined });
    if (afterPanelId) group.updateSavedPanel(afterPanelId, { manualTargetRatio: undefined });
  }
}

function processAutoCollapse () {
  processAutoCollapseExpand();
  if (!props.collapseRules?.length) return;
  const panels = group.syncedPanels.value;
  const panelsToCollapse = checkAutoCollapseRules(panels, props.collapseRules, group.containerSize.value);
  if (panelsToCollapse.length === 0) return;
  const panel = panels.find(p => p.id === panelsToCollapse[0]);
  if (panel && !panel.collapsed) collapsePanel(panelsToCollapse[0], true);
}

const { announce } = useResizableAnnouncements();

const offset = useResizableOffset({
  offsetElement: props.offsetElement,
  offsetAmount: props.offsetAmount,
  offsetDirection: props.offsetDirection,
  direction: currentDirection,
});

const handleInstances = new Set();
function registerHandle (inst) { handleInstances.add(inst); }
function unregisterHandle (inst) { handleInstances.delete(inst); }

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
    const handleId = drag.dragState.handleId ?? buildHandleId(beforePanelId, afterPanelId);
    isResizing.value = false;
    activeHandleId.value = undefined;

    if (sizesChanged) {
      commitPanelSize(beforePanelId, beforeSize);
      commitPanelSize(afterPanelId, afterSize);

      emit('resize-end', handleId);
      processAutoCollapse();
    }
  },
});

function startResize (handleId) { drag.startDrag(handleId); }
function stopResize () { drag.cancelDrag(); }
function savePanelsToStorage () { saveToStorage(group.syncedPanels.value); }
function emitPanelResize (panelId, size) { emit('panel-resize', panelId, size); }

watch(group.syncedPanels, (panels) => {
  if (panels.length > 0 && !isInitializing.value) {
    processAutoCollapse();
  }
}, { flush: 'post' });

onUnmounted(() => {
  group.disconnectObserver();
  drag.cancelDrag();
});

// Provide single context object for child components
provide(RESIZABLE_CONTEXT_KEY, {
  layout: group.layout,
  panels: group.syncedPanels,
  panelMap: group.panelMap,
  direction: currentDirection,
  containerSize: group.containerSize,
  containerElement: computed(() => containerRef.value),
  isResizing: computed(() => isResizing.value),
  activeHandleId: computed(() => activeHandleId.value),
  isInitializing: computed(() => isInitializing.value),
  messages: props.messages,
  startResize: (handleId) => startResize(handleId),
  resetPanels,
  registerHandle,
  unregisterHandle,
  registerPanel,
  unregisterPanel,
  saveToStorage: savePanelsToStorage,
  announce,
  offsetHandleStyles: offset.handleStyles,
  offsetContentStyles: offset.contentStyles,
  collapsePanel,
  emitPanelResize,
  commitPanelSize,
  updateSavedPanel: (panelId, updates) => group.updateSavedPanel(panelId, updates),
});

// Expose methods for programmatic control
defineExpose({
  resizePanel,
  collapsePanel,
  resetPanels,
  state: computed(() => ({
    direction: currentDirection.value,
    panels: group.syncedPanels.value,
    containerSize: group.containerSize.value,
    isResizing: isResizing.value,
    activeHandleId: activeHandleId.value,
  })),
  panelConfigs: computed(() => props.panels),
  allocationStrategy: computed(() => props.spaceAllocationStrategy),
});
</script>
