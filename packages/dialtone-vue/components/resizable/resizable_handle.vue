<template>
  <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
  <div
    ref="handleElement"
    :class="[
      'd-resizable-handle',
      `d-resizable-handle--${direction}`,
      props.class,
      {
        'd-resizable-handle--active': isActive,
        'd-resizable-handle--disabled': isDisabled,
      },
    ]"
    :style="handleStyles"
    :data-handle-id="handleId"
    :tabindex="isDisabled ? '-1' : '0'"
    role="separator"
    :aria-orientation="direction === 'row' ? 'vertical' : 'horizontal'"
    :aria-label="computedAriaLabel"
    :aria-valuenow="ariaValueNow"
    :aria-valuemin="ariaValueMin"
    :aria-valuemax="ariaValueMax"
    :aria-controls="`dt-resizable-panel-${resolvedBeforePanelId}`"
    :aria-valuetext="ariaValueText"
    :aria-disabled="isDisabled || undefined"
    @mousedown="handleMouseDown"
    @touchstart="handleTouchStart"
    @dblclick="handleDoubleClick"
    @keydown="handleKeyDown"
    @focus="handleFocusEvent"
    @blur="handleBlurEvent"
  >
    <div class="d-resizable-handle__indicator" />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, getCurrentInstance, watch } from 'vue';
import { RESIZABLE_CONTEXT_KEY } from './resizable_constants';
import { pixelsToPercentage } from './resizable_utils';
import { useResizableKeyboard } from './composables/useResizableKeyboard';
import { useResizableOffset } from './composables/useResizableOffset';

const props = defineProps({
  /** ID of the panel before this handle. Auto-detected from layout order if not set. */
  beforePanelId: { type: String, default: null },
  /** ID of the panel after this handle. Auto-detected from layout order if not set. */
  afterPanelId: { type: String, default: null },
  /** Disable resize interaction for this handle. */
  disabled: { type: Boolean, default: false },
  /** Additional CSS classes applied to the handle element. */
  class: { type: [String, Object, Array], default: '' },
  /** Disable the double-click reset behavior. */
  disableResetOnDoubleClick: { type: Boolean, default: false },
  /**
   * Which panels to reset on double-click.
   * @values 'both', 'before', 'after', 'all'
   */
  resetBehavior: { type: String, default: 'both' },
  /** CSS selector for an element to offset the handle position from. */
  offsetElement: { type: String, default: undefined },
  /** Additional pixel offset added to the measured element offset. */
  offsetAmount: { type: Number, default: 0 },
  /**
   * Which edge(s) the offset applies to.
   * @values 'start', 'end', 'both'
   */
  offsetDirection: { type: String, default: 'both' },
  /** Override the default aria-label for i18n. */
  ariaLabel: { type: String, default: null },
});

// ── Injected context from DtResizable ────────────────────────────────────

const ctx = inject(RESIZABLE_CONTEXT_KEY, null);
const layoutRef = ctx?.layout ?? computed(() => ({ panels: new Map(), handles: [] }));
const panels = ctx?.panels ?? computed(() => []);
const directionRef = ctx?.direction ?? computed(() => 'row');
const containerSizeRef = ctx?.containerSize ?? computed(() => 1000);
const activeHandleId = ctx?.activeHandleId ?? computed(() => undefined);
const startResize = ctx?.startResize ?? (() => {});
const resetPanels = ctx?.resetPanels ?? (() => {});
const registerHandle = ctx?.registerHandle ?? (() => 0);
const unregisterHandle = ctx?.unregisterHandle ?? (() => {});
const saveToStorage = ctx?.saveToStorage ?? null;
const collapsePanel = ctx?.collapsePanel ?? null;
const updateSavedPanel = ctx?.updateSavedPanel ?? null;
const announce = ctx?.announce ?? null;
const injectedMessages = ctx?.messages ?? {};

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

  return {
    insetInlineStart: `${Math.max(0, pos.left)}px`,
    visibility: '',
    ...offset.handleStyles.value,
  };
});

// ── ARIA values ──────────────────────────────────────────────────────────────

const computedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel;
  const before = resolvedBeforePanelId.value || 'first';
  const after = resolvedAfterPanelId.value || 'second';
  const template = injectedMessages.handleAriaLabel
    ?? 'Resize handle between {before} and {after} panels';
  return template.replace('{before}', before).replace('{after}', after);
});

const ariaValueText = computed(() => {
  const panel = panels.value.find(p => p.id === resolvedBeforePanelId.value);
  if (!panel) return '';
  const template = injectedMessages.ariaValueText ?? '{panelId}: {pixels}px';
  return template
    .replace('{panelId}', resolvedBeforePanelId.value)
    .replace('{pixels}', String(Math.round(panel.pixelSize)));
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
  onResize (beforeId, beforeSize, afterId, afterSize) {
    if (updateSavedPanel) {
      const cSize = containerSizeRef.value;
      const beforeRatio = cSize > 0 ? beforeSize / cSize : undefined;
      const afterRatio = cSize > 0 ? afterSize / cSize : undefined;
      updateSavedPanel(beforeId, { pixelSize: beforeSize, manualTargetRatio: beforeRatio });
      updateSavedPanel(afterId, { pixelSize: afterSize, manualTargetRatio: afterRatio });
    } else {
      saveToStorage?.();
    }
  },
  onCollapse (panelId, collapsed) { collapsePanel?.(panelId, collapsed); },
  onReset (beforeId, afterId) { resetPanels?.(beforeId, afterId, 'both'); },
  onSizeAnnouncement (msg) { announce?.(msg); },
  messages: injectedMessages,
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
});

onUnmounted(() => {
  unregisterHandle(currentInstance);

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
