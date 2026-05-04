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
    data-qa="d-resizable-panel"
  >
    <div
      :class="['d-resizable-panel__content', contentClass]"
      :style="offsetContentStyles"
    >
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
import { RESIZABLE_CONTEXT_KEY } from './ResizableConstants';
import { isValidSizing } from './ResizableUtils';

const props = defineProps({
  /** Unique panel identifier. Must be unique within its DtResizable parent. */
  id: { type: String, required: true },
  /**
   * Initial size as a Dialtone layout token (maps to `--dt-layout-*`, matching
   * DtBox and the `d-w-*` / `d-h-*` utility classes) or a percentage with 'p'
   * suffix (e.g. '25p' for 25% of the container).
   * @values 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  initialSize: { type: String, default: undefined },
  /**
   * Minimum size for user drag interactions (hard floor). Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  userMinSize: { type: String, default: undefined },
  /**
   * Maximum size for user drag interactions (hard ceiling). Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   * @values 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  userMaxSize: { type: String, default: undefined },
  /**
   * Minimum size for system viewport scaling. Falls back to userMinSize.
   * Accepts a layout token or percentage; see `initialSize` for the value set.
   * @values 0, 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  systemMinSize: { type: String, default: undefined },
  /**
   * Maximum size for system viewport scaling. Falls back to userMaxSize.
   * Accepts a layout token or percentage; see `initialSize` for the value set.
   * @values 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  systemMaxSize: { type: String, default: undefined },
  /**
   * Container width threshold that triggers auto-collapse. Accepts a layout
   * token or percentage; see `initialSize` for the value set.
   * @values 1px, 2px, 8px, 25, 20px, 24px, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200, 1300, 1400, 1500, 1600, 10p, 20p, 25p, 30p, 33p, 40p, 50p, 60p, 66p, 70p, 75p, 80p, 90p, 95p, 100p
   */
  collapseSize: { type: String, default: undefined },
  /** Whether this panel can be resized by dragging. */
  resizable: { type: Boolean, default: true },
  /** Whether this panel can be collapsed to zero width. */
  collapsible: { type: Boolean, default: false },
  /** Initial collapsed state. */
  collapsed: { type: Boolean, default: false },
  /** Additional CSS classes applied to the panel element. */
  class: { type: [String, Object, Array], default: '' },
  /** Additional CSS classes applied to the inner content wrapper element. */
  contentClass: { type: [String, Object, Array], default: '' },
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

const ctx = inject(RESIZABLE_CONTEXT_KEY, null);
const layoutRef = ctx?.layout ?? computed(() => ({ panels: new Map(), handles: [] }));
const isResizing = ctx?.isResizing ?? computed(() => false);
const offsetContentStyles = ctx?.offsetContentStyles ?? computed(() => ({}));

const registerPanel = ctx?.registerPanel ?? null;
const unregisterPanel = ctx?.unregisterPanel ?? null;

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

// Re-register on config change (watch each config field explicitly)
watch(panelConfig, () => {
  if (registerPanel) registerPanel(panelConfig.value);
}, { deep: true });

const collapsePanel = ctx?.collapsePanel ?? null;
const isInitializing = ctx?.isInitializing ?? computed(() => false);

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

const panelMap = ctx?.panelMap ?? computed(() => new Map());
const panel = computed(() => panelMap.value.get(props.id));

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
