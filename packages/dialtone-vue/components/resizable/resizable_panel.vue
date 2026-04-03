<template>
  <div
    :id="`dt-resizable-panel-${props.id}`"
    class="d-resizable-panel"
    :class="[
      props.class,
      {
        'd-resizable-panel--collapsed': panel && panel.collapsed === true,
        'd-resizable-panel--fixed': panel && panel.resizable === false,
      },
    ]"
    :style="panelStyles"
    :data-panel-id="props.id"
    :data-locked="panel ? (panel.locked || panel.resizable === false).toString() : 'false'"
    data-qa="d-resizable-panel"
  >
    <div class="d-resizable-panel__content">
      <!-- @slot Panel content. Provides panel state and collapsed/resizing flags. -->
      <slot
        :panel="panel"
        :is-collapsed="panel?.collapsed"
        :is-resizing="isResizing"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, watch } from 'vue';
import {
  RESIZABLE_LAYOUT_KEY,
  RESIZABLE_PANELS_KEY,
  RESIZABLE_IS_RESIZING_KEY,
  RESIZABLE_REGISTER_PANEL_KEY,
  RESIZABLE_UNREGISTER_PANEL_KEY,
  RESIZABLE_COLLAPSE_PANEL_KEY,
  RESIZABLE_IS_INITIALIZING_KEY,
} from './resizable_constants';
import { isValidSizing } from './resizable_utils';

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

// Re-register on config change
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
    if (isInitializing.value) return;
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
</script>
