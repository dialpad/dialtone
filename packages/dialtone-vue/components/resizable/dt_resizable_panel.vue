<template>
  <div
    class="dt-resizable-panel"
    :class="[
      props.class,
      {
        'dt-resizable-panel--collapsed': panel && panel.collapsed === true,
        'dt-resizable-panel--fixed': panel && panel.resizable === false,
      },
    ]"
    :style="panelStyles"
    :data-panel-id="props.id"
    :data-locked="panel ? (panel.locked || panel.resizable === false).toString() : 'false'"
    data-qa="dt-resizable-panel"
  >
    <div class="dt-resizable-panel__content">
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

function validateSizeProp (value, propName) {
  if (value !== undefined && !isValidSizing(value)) {
    console.error(`[DtResizablePanel] Invalid ${propName}: "${value}". Use a Dialtone token ('300') or percentage ('20p').`);
  }
}

const props = defineProps({
  /** Panel identifier — must be unique within its DtResizable parent. */
  id: {
    type: String,
    required: true,
  },
  initialSize: {
    type: String,
    default: undefined,
  },
  userMinSize: {
    type: String,
    default: undefined,
  },
  userMaxSize: {
    type: String,
    default: undefined,
  },
  systemMinSize: {
    type: String,
    default: undefined,
  },
  systemMaxSize: {
    type: String,
    default: undefined,
  },
  collapseSize: {
    type: String,
    default: undefined,
  },
  resizable: {
    type: Boolean,
    default: true,
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  class: {
    type: [String, Object, Array],
    default: '',
  },
});

// Runtime size prop validation (dev-only, tree-shaken in production by Vite)
const SIZE_PROP_NAMES = [
  'initialSize',
  'userMinSize',
  'userMaxSize',
  'systemMinSize',
  'systemMaxSize',
  'collapseSize',
];

watch(
  () => SIZE_PROP_NAMES.map(name => props[name]),
  values => SIZE_PROP_NAMES.forEach((name, i) => validateSizeProp(values[i], name)),
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
    return { left: '0px', width: '0px', pointerEvents: 'none' };
  }

  if (position.collapsed) {
    return {
      left: `${position.left}px`,
      width: '0px',
      overflow: 'hidden',
      pointerEvents: 'none',
    };
  }

  return {
    left: `${position.left}px`,
    right: `${position.right}px`,
  };
});
</script>

<style lang="less">
.dt-resizable-panel {
  position: absolute;
  top: 0;
  bottom: 0;
  overflow: hidden;

  &--collapsed {
    pointer-events: none;
  }
}

.dt-resizable-panel__content {
  display: flex;
  align-items: start;
  flex: 1;
  width: 100%;
  height: 100%;
  pointer-events: auto;
}
</style>
