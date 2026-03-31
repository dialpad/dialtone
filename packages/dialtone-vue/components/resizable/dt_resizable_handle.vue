<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="handleElement"
    :class="[
      'dt-resizable-handle',
      `dt-resizable-handle--${direction}`,
      props.class,
      {
        'dt-resizable-handle--active': isActive,
        'dt-resizable-handle--disabled': isDisabled,
        'dt-resizable-handle--edit-mode': isEditMode,
      },
    ]"
    :style="handleStyles"
    :data-handle-id="handleId"
    :tabindex="isEditMode ? '0' : '-1'"
    role="separator"
    :aria-orientation="direction === 'row' ? 'vertical' : 'horizontal'"
    :aria-label="ariaLabel"
    :aria-valuenow="ariaValueNow"
    :aria-valuemin="ariaValueMin"
    :aria-valuemax="ariaValueMax"
    :aria-describedby="isEditMode ? 'dt-resize-instructions' : undefined"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    @dblclick="handleDoubleClick"
    @keydown="handleKeyDown"
    @focus="handleFocusEvent"
    @blur="handleBlurEvent"
  >
    <div class="dt-resizable-handle__indicator" />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, getCurrentInstance, watch } from 'vue';
import {
  RESIZABLE_LAYOUT_KEY,
  RESIZABLE_PANELS_KEY,
  RESIZABLE_DIRECTION_KEY,
  RESIZABLE_CONTAINER_SIZE_KEY,
  RESIZABLE_ACTIVE_HANDLE_KEY,
  RESIZABLE_IS_EDIT_MODE_KEY,
  RESIZABLE_START_RESIZE_KEY,
  RESIZABLE_RESET_PANELS_KEY,
  RESIZABLE_REGISTER_HANDLE_KEY,
  RESIZABLE_UNREGISTER_HANDLE_KEY,
  RESIZABLE_REGISTER_EDIT_HANDLE_KEY,
  RESIZABLE_UNREGISTER_EDIT_HANDLE_KEY,
} from './resizable_constants';
import { pixelsToPercentage } from './resizable_utils';
import { useResizableKeyboard } from './composables/useResizableKeyboard';
import { useResizableOffset } from './composables/useResizableOffset';

const props = defineProps({
  beforePanelId: { type: String, default: null },
  afterPanelId: { type: String, default: null },
  disabled: { type: Boolean, default: false },
  class: { type: String, default: '' },
  disableResetOnDoubleClick: { type: Boolean, default: false },
  /** @values 'both', 'before', 'after', 'all' */
  resetBehavior: { type: String, default: 'both' },
  offsetElement: { type: String, default: undefined },
  offsetAmount: { type: Number, default: 0 },
  /** @values 'start', 'end', 'both' */
  offsetDirection: { type: String, default: 'both' },
});

// ── Injected state from DtResizable ──────────────────────────────────────

const layoutRef = inject(
  RESIZABLE_LAYOUT_KEY,
  computed(() => ({ panels: new Map(), handles: [] })),
);
const panels = inject(
  RESIZABLE_PANELS_KEY,
  computed(() => []),
);
const directionRef = inject(
  RESIZABLE_DIRECTION_KEY,
  computed(() => 'row'),
);
const containerSizeRef = inject(
  RESIZABLE_CONTAINER_SIZE_KEY,
  computed(() => 1000),
);
const activeHandleId = inject(
  RESIZABLE_ACTIVE_HANDLE_KEY,
  computed(() => undefined),
);
const isEditMode = inject(
  RESIZABLE_IS_EDIT_MODE_KEY,
  computed(() => false),
);
const startResize = inject(RESIZABLE_START_RESIZE_KEY, () => {});
const resetPanels = inject(RESIZABLE_RESET_PANELS_KEY, () => {});
const registerHandle = inject(RESIZABLE_REGISTER_HANDLE_KEY, () => 0);
const unregisterHandle = inject(RESIZABLE_UNREGISTER_HANDLE_KEY, () => {});
const registerEditHandle = inject(RESIZABLE_REGISTER_EDIT_HANDLE_KEY, () => {});
const unregisterEditHandle = inject(RESIZABLE_UNREGISTER_EDIT_HANDLE_KEY, () => {});

// ── Handle registration ──────────────────────────────────────────────────────

const currentInstance = getCurrentInstance();
const autoIndex = ref(0);

// ── Layout-driven position ───────────────────────────────────────────────────

/**
 * Find this handle's position in the layout result.
 *
 * Priority:
 * 1. If explicit beforePanelId + afterPanelId props are provided, look up by
 *    the composite key "{beforePanelId}:{afterPanelId}".
 * 2. Otherwise use autoIndex to pick handles[autoIndex] from the layout.
 */
const handlePosition = computed(() => {
  const layout = layoutRef.value;
  if (layout.handles.length === 0) return null;

  if (props.beforePanelId && props.afterPanelId) {
    const id = `${props.beforePanelId}:${props.afterPanelId}`;
    return layout.handles.find(h => h.id === id) ?? null;
  }

  return layout.handles[autoIndex.value] ?? null;
});

/** The composite handle identifier used by the drag system */
const handleId = computed(() => handlePosition.value?.id ?? '');

/** Panel ID before this handle (from layout result) */
const resolvedBeforePanelId = computed(() => handlePosition.value?.beforePanelId ?? props.beforePanelId ?? '');

/** Panel ID after this handle (from layout result) */
const resolvedAfterPanelId = computed(() => handlePosition.value?.afterPanelId ?? props.afterPanelId ?? '');

/** Whether this handle is currently the active drag handle */
const isActive = computed(() => !!(handleId.value && activeHandleId.value === handleId.value));

/**
 * Handle is disabled when:
 * - props.disabled is set, OR
 * - the layout marks this handle as disabled (adjacent collapsed/non-resizable panel)
 */
const isDisabled = computed(() => props.disabled || (handlePosition.value?.disabled ?? false));

/** Reactive layout direction */
const direction = directionRef;

// ── Position styles from layout ──────────────────────────────────────────────

const handleStyles = computed(() => {
  const pos = handlePosition.value;

  if (!pos) {
    return { visibility: 'hidden' };
  }

  const positionProp = direction.value === 'row' ? 'left' : 'top';
  return {
    [positionProp]: `${Math.max(0, pos.left)}px`,
    visibility: '',
    ...offset.handleStyles.value,
  };
});

// ── ARIA values ──────────────────────────────────────────────────────────────

const ariaLabel = computed(() => {
  const before = resolvedBeforePanelId.value || 'first';
  const after = resolvedAfterPanelId.value || 'second';
  return `Resize handle between ${before} and ${after} panels`;
});

const ariaValueNow = ref(50);
const ariaValueMin = ref(0);
const ariaValueMax = ref(100);

let ariaUpdateTimeout = null;

function calculateAriaValues () {
  const containerSize = containerSizeRef.value;
  if (!containerSize || containerSize <= 0) return;

  const beforeId = resolvedBeforePanelId.value;
  const panelState = panels.value.find(p => p.id === beforeId);
  if (!panelState) return;

  const position = panelState.collapsed ? 0 : panelState.pixelSize || 0;
  const min = panelState.userMinSizePixels || 0;
  const max = panelState.userMaxSizePixels || containerSize;

  ariaValueNow.value = Math.floor(pixelsToPercentage(position, containerSize));
  ariaValueMin.value = Math.floor(pixelsToPercentage(min, containerSize));
  ariaValueMax.value = Math.floor(pixelsToPercentage(max, containerSize));
}

const updateAriaValues = () => {
  if (ariaUpdateTimeout) {
    clearTimeout(ariaUpdateTimeout);
  }
  ariaUpdateTimeout = setTimeout(calculateAriaValues, 100);
};

watch(
  [resolvedBeforePanelId, () => containerSizeRef.value],
  () => {
    updateAriaValues();
  },
  { flush: 'post' },
);

// ── Handle DOM element ───────────────────────────────────────────────────────

const handleElement = ref(null);

// ── Keyboard resize composable ─────────────────────────────────────────────

const keyboard = useResizableKeyboard({
  panels,
  direction: directionRef,
  containerSize: containerSizeRef,
  beforePanelId: resolvedBeforePanelId,
  afterPanelId: resolvedAfterPanelId,
  handleElement,
  onResize () {
    // Keyboard resize updates panel state in-place; storage save
    // deferred to exit-edit-mode.
  },
});

// ── Offset composable ──────────────────────────────────────────────────────

const offset = useResizableOffset({
  offsetElement: props.offsetElement,
  offsetAmount: props.offsetAmount,
  offsetDirection: props.offsetDirection,
  direction: directionRef,
});

// ── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  autoIndex.value = registerHandle(currentInstance);
  updateAriaValues();

  // Register this handle's DOM element for edit mode focus management
  if (handleElement.value) {
    registerEditHandle(handleElement.value);
  }
});

onUnmounted(() => {
  unregisterHandle(currentInstance);

  if (handleElement.value) {
    unregisterEditHandle(handleElement.value);
  }

  if (ariaUpdateTimeout) {
    clearTimeout(ariaUpdateTimeout);
  }
});

// ── Event handlers ───────────────────────────────────────────────────────────

function handleMouseDown (event) {
  if (isDisabled.value) return;
  event.preventDefault();
  startResize(handleId.value);
}

function handleTouchStart (event) {
  if (isDisabled.value) return;
  event.preventDefault();
  startResize(handleId.value);
}

function handleDoubleClick () {
  if (props.disableResetOnDoubleClick) return;
  if (isDisabled.value) return;

  const beforeId = resolvedBeforePanelId.value;
  const afterId = resolvedAfterPanelId.value;

  if (!beforeId || !afterId) return;

  resetPanels(beforeId, afterId, props.resetBehavior);
}

function handleKeyDown (event) {
  keyboard.handleKeyDown(event);
}

function handleFocusEvent () {
  keyboard.handleFocus();
}

function handleBlurEvent () {
  keyboard.handleBlur();
}
</script>

<style lang="less">
// ─── Resize Handle ───
// Positioned absolutely between panels. The layout engine sets inline `left`
// (or `top` for column). The hit area extends beyond the visible bar via ::before.
.dt-resizable-handle {
  position: absolute;
  background-color: transparent;
  border-radius: var(--dt-size-radius-pill);
  z-index: calc(var(--zi-navigation-fixed) + var(--zi-base1));

  // Invisible hit area for easier grabbing
  &::before {
    content: '';
    position: absolute;
    top: var(--dt-size-400-negative);
    left: var(--dt-size-400-negative);
    right: var(--dt-size-400-negative);
    bottom: var(--dt-size-400-negative);
  }

  // ─── Direction Modifiers ───
  &--row {
    top: var(--dt-size-200);
    bottom: var(--dt-size-200);
    width: var(--dt-size-300);
    cursor: ew-resize;
  }

  &--column {
    left: var(--dt-size-200);
    right: var(--dt-size-200);
    height: var(--dt-size-300);
    cursor: ns-resize;
  }

  // ─── State Modifiers ───
  &--active {
    background-color: var(--dt-color-focus-ring);
  }

  &--disabled {
    cursor: default;
    opacity: 0.3;
    pointer-events: none;
    background-color: transparent !important;
  }

  // ─── Hover ───
  &:hover:not(&--disabled),
  .dt-resizable--resizing > & {
    background-color: var(--dt-color-focus-ring);
  }

  // Remove browser default focus outline — custom indicators handle it
  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: 2px solid var(--dt-color-focus-ring);
    outline-offset: 2px;
    background-color: var(--dt-color-focus-ring);
    box-shadow:
      0 0 0 2px var(--dt-color-surface-primary),
      0 0 0 4px var(--dt-color-focus-ring);
  }
}
</style>
