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
    @pointerdown="handlePointerDown"
    @dblclick="handleDoubleClick"
    @keydown="handleKeyDown"
    @focus="handleFocusEvent"
    @blur="handleBlurEvent"
  >
    <div class="d-resizable-handle__indicator" />
  </div>
</template>

<script setup>
import { computed, inject, onMounted, onUnmounted, ref, getCurrentInstance } from 'vue';
import { RESIZABLE_CONTEXT_KEY, buildHandleId } from './ResizableConstants';
import { pixelsToPercentage } from './ResizableUtils';
import { useResizableKeyboard } from './composables/useResizableKeyboard';

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
const commitPanelSize = ctx?.commitPanelSize ?? null;
const announce = ctx?.announce ?? null;
const panelMap = ctx?.panelMap ?? computed(() => new Map());
const injectedMessages = ctx?.messages ?? {};

// ── Handle registration ──────────────────────────────────────────────────────

const currentInstance = getCurrentInstance();

// ── Layout-driven position ───────────────────────────────────────────────────

// DOM index resolved once at mount time to avoid repeated querySelectorAll calls
const resolvedDomIndex = ref(0);

const handlePosition = computed(() => {
  const layout = layoutRef.value;
  if (layout.handles.length === 0) return null;

  if (props.beforePanelId && props.afterPanelId) {
    const id = buildHandleId(props.beforePanelId, props.afterPanelId);
    return layout.handles.find(h => h.id === id) ?? null;
  }

  return layout.handles[resolvedDomIndex.value] ?? null;
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
    ...offsetHandleStyles.value,
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
  const p = panelMap.value.get(resolvedBeforePanelId.value);
  if (!p) return '';
  const template = injectedMessages.ariaValueText ?? '{panelId}: {pixels}px';
  return template
    .replace('{panelId}', resolvedBeforePanelId.value)
    .replace('{pixels}', String(Math.round(p.pixelSize)));
});

const ariaValueNow = computed(() => {
  const p = panelMap.value.get(resolvedBeforePanelId.value);
  const cs = containerSizeRef.value;
  if (!p || !cs) return 0;
  return Math.floor(pixelsToPercentage(p.collapsed ? 0 : p.pixelSize || 0, cs));
});

const ariaValueMin = computed(() => {
  const p = panelMap.value.get(resolvedBeforePanelId.value);
  const cs = containerSizeRef.value;
  if (!p || !cs) return 0;
  return Math.floor(pixelsToPercentage(p.userMinSizePixels || 0, cs));
});

const ariaValueMax = computed(() => {
  const p = panelMap.value.get(resolvedBeforePanelId.value);
  const cs = containerSizeRef.value;
  if (!p || !cs) return 100;
  return Math.floor(pixelsToPercentage(p.userMaxSizePixels || cs, cs));
});

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
    if (commitPanelSize) {
      commitPanelSize(beforeId, beforeSize);
      commitPanelSize(afterId, afterSize);
    } else {
      saveToStorage?.();
    }
  },
  onCollapse (panelId, collapsed) { collapsePanel?.(panelId, collapsed); },
  onReset (beforeId, afterId) { resetPanels?.(beforeId, afterId, 'both'); },
  onSizeAnnouncement (msg) { announce?.(msg); },
  messages: injectedMessages,
});

// ── Offset (from parent context) ──────────────────────────────────────────
const offsetHandleStyles = ctx?.offsetHandleStyles ?? computed(() => ({}));

// ── Lifecycle ────────────────────────────────────────────────────────────────

onMounted(() => {
  registerHandle(currentInstance);

  const el = handleElement.value;
  if (el?.parentElement) {
    const allHandles = Array.from(el.parentElement.querySelectorAll('.d-resizable-handle'));
    const idx = allHandles.indexOf(el);
    if (idx >= 0) resolvedDomIndex.value = idx;
  }
});

onUnmounted(() => {
  unregisterHandle(currentInstance);
});

// ── Event handlers ───────────────────────────────────────────────────────────

function handlePointerDown (event) {
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
