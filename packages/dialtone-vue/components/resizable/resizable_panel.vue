<template>
  <div
    class="dt-resizable-panel"
    :class="[
      props.class,
      {
        'dt-resizable-panel--collapsed': panel && panel.collapsed === true,
        'dt-resizable-panel--fixed': panel && panel.resizable === false,
        'dt-resizable-panel--peeking': peek.isPeeking.value,
      },
    ]"
    :style="panelStyles"
    :data-panel-id="props.id"
    :data-locked="panel ? (panel.locked || panel.resizable === false).toString() : 'false'"
    data-qa="dt-resizable-panel"
    @mouseenter="peek.handlers.onMouseEnter"
    @mouseleave="peek.handlers.onMouseLeave"
    @keydown="peek.handlers.onKeyDown"
  >
    <div class="dt-resizable-panel__content">
      <!-- @slot Panel content. Provides panel state, collapsed/resizing/peeking flags. -->
      <slot
        :panel="panel"
        :is-collapsed="panel?.collapsed"
        :is-resizing="isResizing"
        :is-peeking="peek.isPeeking.value"
      />
    </div>
    <!-- @slot Custom trigger element for the peek overlay (e.g., a toggle button). -->
    <slot
      v-if="peek.canPeek.value && peek.showPeekButton.value"
      name="peek-trigger"
      :toggle-peek="peek.togglePeek"
      :is-peeking="peek.isPeeking.value"
    />
    <div
      v-if="peek.isPeeking.value"
      ref="peekOverlayRef"
      :class="peek.peekClasses.value"
      :style="peek.peekStyles.value"
      data-qa="dt-resizable-panel-peek"
      @mouseenter="peek.handlers.onMouseEnter"
      @mouseleave="peek.handlers.onMouseLeave"
    >
      <!-- @slot Custom content for the peek overlay. Falls back to the default slot content. -->
      <slot
        name="peek-content"
        :exit-peek="peek.exitPeek"
      >
        <slot
          :panel="panel"
          :is-collapsed="panel?.collapsed"
          :is-resizing="isResizing"
          :is-peeking="true"
        />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import {
  RESIZABLE_LAYOUT_KEY,
  RESIZABLE_PANELS_KEY,
  RESIZABLE_IS_RESIZING_KEY,
  RESIZABLE_CONTAINER_ELEMENT_KEY,
  RESIZABLE_DIRECTION_KEY,
  RESIZABLE_CONTAINER_SIZE_KEY,
  RESIZABLE_REGISTER_PANEL_KEY,
  RESIZABLE_UNREGISTER_PANEL_KEY,
  RESIZABLE_COLLAPSE_PANEL_KEY,
  RESIZABLE_IS_INITIALIZING_KEY,
} from './resizable_constants';
import { isValidSizing } from './resizable_utils';
import { useResizablePeek } from './composables/useResizablePeek';

const props = defineProps({
  /** Unique panel identifier. Must be unique within its DtResizable parent. */
  id: { type: String, required: true },
  /** Initial size as a percentage token (e.g., '25p' for 25%) or Dialtone size token. */
  initialSize: { type: String, default: undefined },
  /** Minimum size for user drag interactions (hard floor). */
  userMinSize: { type: String, default: undefined },
  /** Maximum size for user drag interactions (hard ceiling). */
  userMaxSize: { type: String, default: undefined },
  /** Minimum size for system viewport scaling. Falls back to userMinSize. */
  systemMinSize: { type: String, default: undefined },
  /** Maximum size for system viewport scaling. Falls back to userMaxSize. */
  systemMaxSize: { type: String, default: undefined },
  /** Container width threshold that triggers auto-collapse. */
  collapseSize: { type: String, default: undefined },
  /** Whether this panel can be resized by dragging. */
  resizable: { type: Boolean, default: true },
  /** Whether this panel can be collapsed to zero width. */
  collapsible: { type: Boolean, default: false },
  /** Initial collapsed state. */
  collapsed: { type: Boolean, default: false },
  /** Enable peek overlay when panel is collapsed. */
  peekEnabled: { type: Boolean, default: false },
  /**
   * What triggers the peek overlay to appear.
   * @values 'hover', 'button', 'both'
   */
  peekTrigger: {
    type: String, default: 'hover',
    validator: (val) => ['hover', 'button', 'both'].includes(val),
  },
  /** Allow peek even when the panel was manually collapsed (not auto-collapsed). */
  peekWhenManual: { type: Boolean, default: false },
  /** Width of the peek overlay. Uses initialSize if not set. */
  peekWidth: { type: String, default: undefined },
  /** Grace period in milliseconds before hiding peek on mouse leave. */
  peekGracePeriod: { type: Number, default: 150 },
  /** Additional CSS classes applied to the panel element. */
  class: { type: [String, Object, Array], default: '' },
});

const SIZE_PROPS = ['initialSize', 'userMinSize', 'userMaxSize', 'systemMinSize', 'systemMaxSize', 'collapseSize'];
watch(
  () => SIZE_PROPS.map(n => props[n]),
  vals => vals.forEach((v, i) => {
    if (v !== undefined && !isValidSizing(v)) {
      console.error(`[DtResizablePanel] Invalid ${SIZE_PROPS[i]}: "${v}".`);
    }
  }),
  { immediate: true },
);

const layoutRef = inject(
  RESIZABLE_LAYOUT_KEY,
  computed(() => ({ panels: new Map(), handles: [] })),
);
const panels = inject(
  RESIZABLE_PANELS_KEY,
  computed(() => []),
);
const isResizing = inject(
  RESIZABLE_IS_RESIZING_KEY,
  computed(() => false),
);

const containerElement = inject(RESIZABLE_CONTAINER_ELEMENT_KEY, computed(() => null));
const directionRef = inject(RESIZABLE_DIRECTION_KEY, computed(() => 'row'));
const containerSizeRef = inject(RESIZABLE_CONTAINER_SIZE_KEY, computed(() => 1000));
const registerPanel = inject(RESIZABLE_REGISTER_PANEL_KEY);
const unregisterPanel = inject(RESIZABLE_UNREGISTER_PANEL_KEY);

const panelConfig = computed(() => ({
  id: props.id,
  initialSize: props.initialSize,
  userMinSize: props.userMinSize,
  userMaxSize: props.userMaxSize,
  systemMinSize: props.systemMinSize,
  systemMaxSize: props.systemMaxSize,
  collapseSize: props.collapseSize,
  resizable: props.resizable ?? true,
  collapsible: props.collapsible ?? false,
  collapsed: props.collapsed ?? false,
  peekEnabled: props.peekEnabled,
  peekTrigger: props.peekTrigger,
  peekWhenManual: props.peekWhenManual,
  peekWidth: props.peekWidth,
  peekGracePeriod: props.peekGracePeriod,
}));

onMounted(() => {
  if (registerPanel) {
    registerPanel(panelConfig.value);
  }
});

onUnmounted(() => {
  if (unregisterPanel) {
    unregisterPanel(props.id);
  }
});

// Re-register on config change (stringified to avoid infinite loop from object identity)
watch(
  () => JSON.stringify(panelConfig.value),
  () => {
    if (registerPanel) {
      registerPanel(panelConfig.value);
    }
  },
);

const collapsePanel = inject(RESIZABLE_COLLAPSE_PANEL_KEY);
const isInitializing = inject(
  RESIZABLE_IS_INITIALIZING_KEY,
  computed(() => false),
);

watch(
  () => props.collapsed,
  newCollapsed => {
    // Skip during init — let storage restoration handle collapsed state
    if (isInitializing.value) {
      return;
    }

    if (collapsePanel && newCollapsed !== undefined) {
      collapsePanel(props.id, newCollapsed);
    }
  },
  { immediate: true },
);

const panel = computed(() => {
  return panels.value.find(p => p.id === props.id);
});

const panelStyles = computed(() => {
  const position = layoutRef.value.panels.get(props.id);

  if (!position) {
    return { insetInlineStart: '0px', inlineSize: '0px', pointerEvents: 'none' };
  }

  if (position.collapsed) {
    return {
      insetInlineStart: `${position.left}px`,
      inlineSize: '0px',
      overflow: 'hidden',
      pointerEvents: 'none',
    };
  }

  return {
    insetInlineStart: `${position.left}px`,
    insetInlineEnd: `${position.right}px`,
  };
});

// ── Peek overlay composable ──────────────────────────────────────────────

const emit = defineEmits(['panel-peek-start', 'panel-peek-end']);
const peekOverlayRef = ref(null);

const panelPosition = computed(() => {
  const allPanels = panels.value;
  if (!allPanels.length) return 'middle';
  const idx = allPanels.findIndex(p => p.id === props.id);
  if (idx === 0) return 'first';
  if (idx === allPanels.length - 1) return 'last';
  return 'middle';
});

const panelOffset = computed(() => {
  const position = layoutRef.value.panels.get(props.id);
  return position?.left ?? 0;
});

const peek = useResizablePeek({
  panel: computed(() => panel.value),
  containerElement,
  direction: directionRef,
  containerSize: containerSizeRef,
  panelPosition,
  panelOffset,
  onPeekChange (isPeeking) {
    if (isPeeking) emit('panel-peek-start', props.id);
    else emit('panel-peek-end', props.id);
  },
});

defineExpose({
  enterPeek: peek.enterPeek,
  exitPeek: peek.exitPeek,
  exitPeekWithGracePeriod: peek.exitPeekWithGracePeriod,
  togglePeek: peek.togglePeek,
});
</script>

<style lang="less">
.dt-resizable-panel {
  position: absolute;
  inset-block: 0;
  overflow: hidden;

  &--collapsed {
    pointer-events: none;
  }

  &--peeking {
    pointer-events: auto;
  }
}

.dt-resizable-panel__content {
  display: flex;
  align-items: start;
  flex: 1;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  writing-mode: horizontal-tb;
}

.dt-resizable-panel__peek-overlay {
  position: absolute;
  z-index: calc(var(--zi-navigation-fixed) + var(--zi-base2));
  background-color: var(--dt-color-surface-primary);
  box-shadow: var(--dt-shadow-large);
  overflow: auto;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 150ms ease;

  &--visible {
    opacity: 1;
  }
}
</style>
