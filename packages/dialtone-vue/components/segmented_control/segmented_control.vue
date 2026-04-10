<template>
  <dt-stack
    :id="id"
    ref="container"
    align="stretch"
    :class="containerClasses"
    :direction="stackDirection"
    role="radiogroup"
    :aria-label="ariaLabel"
    :aria-orientation="orientation"
    data-qa="dt-segmented-control"
    @keydown="handleKeyDown"
  >
    <!-- @slot DtSegmentedControlItem children -->
    <slot />
  </dt-stack>
</template>

<script setup>
import { ref, computed, reactive, watchEffect, watch, provide, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { getUniqueString } from '@/common/utils';
import { DtStack } from '@/components/stack';
import {
  cacheIndicatorConfig,
  cancelIndicatorAnimations,
  animateIndicator,
} from '@/common/utils/indicatorAnimation';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_SPREAD_DEFAULT,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_ITEM_SELECTOR,
  SEGMENTED_CONTROL_DATA_VALUE_ATTR,
} from './segmented_control_constants.js';

defineOptions({ name: 'DtSegmentedControl' });

const props = defineProps({
  /**
   * Element ID for the radiogroup container.
   * Auto-generated if not provided.
   */
  id: {
    type: String,
    default () { return getUniqueString(); },
  },

  /**
   * The currently selected value (v-model).
   */
  modelValue: {
    type: String,
    required: true,
  },

  /**
   * Accessible label for the radiogroup.
   */
  ariaLabel: {
    type: String,
    default: undefined,
  },

  /**
   * Orientation of the segmented control.
   * Maps to DtStack direction: horizontal -> row, vertical -> column.
   * @values horizontal, vertical
   */
  orientation: {
    type: String,
    default: SEGMENTED_CONTROL_ORIENTATION_DEFAULT,
    validator: (v) => SEGMENTED_CONTROL_ORIENTATIONS.includes(v),
  },

  /**
   * DtButton size for all items. Inherited by children via provide.
   * @values 100, 200, 300, 400, 500
   */
  size: {
    type: [String, Number],
    default: SEGMENTED_CONTROL_SIZE_DEFAULT,
    validator: (v) => SEGMENTED_CONTROL_SIZES.includes(String(v)),
  },

  /**
   * Controls whether items are selected on focus (auto) or on click/Space/Enter (manual).
   * @values auto, manual
   */
  activationMode: {
    type: String,
    default: SEGMENTED_CONTROL_ACTIVATION_MODE_DEFAULT,
    validator: (v) => SEGMENTED_CONTROL_ACTIVATION_MODES.includes(v),
  },

  /**
   * Disables all items in the group.
   * Per-item disabled is set via the disabled prop on DtSegmentedControlItem.
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Hides the dividers between items.
   */
  hideDivider: {
    type: Boolean,
    default: false,
  },

  /**
   * Removes the border and padding from the container.
   */
  borderless: {
    type: Boolean,
    default: false,
  },

  /**
   * Controls how items distribute space.
   * 'grow' (default): items size to their content.
   * 'evenly': items share space equally.
   * @values grow, evenly
   */
  spread: {
    type: String,
    default: SEGMENTED_CONTROL_SPREAD_DEFAULT,
    validator: (v) => SEGMENTED_CONTROL_SPREADS.includes(v),
  },

  /**
   * Default label class for all items. Items can override with their own labelClass prop.
   */
  labelClass: {
    type: [String, Array, Object],
    default: '',
  },

  /**
   * If true, the selection indicator animates between items on click.
   * @values true, false
   */
  showIndicatorTransition: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  /**
   * v-model event. Emitted when the selected value changes.
   * @event update:modelValue
   * @type {String}
   */
  'update:modelValue',

  /**
   * Emitted when the user selects an item (click, Enter, Space, or arrow in auto mode).
   * Not emitted for programmatic modelValue changes.
   * @event change
   * @type {String}
   */
  'change',

  /**
   * Emitted before a selection change. Call event.preventDefault() to cancel the change.
   * @event before-change
   * @type {Event}
   */
  'before-change',
]);

const container = ref(null);
const focusedValue = ref(null);

const stackDirection = computed(() => props.orientation === 'vertical' ? 'column' : 'row');

const containerClasses = computed(() => [
  'd-segmented-control',
  SEGMENTED_CONTROL_SIZE_MODIFIERS[String(props.size)],
  props.hideDivider ? 'd-segmented-control--hide-divider' : null,
  props.borderless ? 'd-segmented-control--borderless' : null,
  props.orientation === 'vertical' ? 'd-segmented-control--vertical' : null,
  props.spread === 'evenly' && props.orientation === 'horizontal'
    ? 'd-segmented-control--spread-evenly'
    : null,
]);

// Reactive context provided to children
const groupContext = reactive({
  selected: props.modelValue,
  disabled: props.disabled,
  size: props.size,
  labelClass: props.labelClass,
});

watchEffect(() => {
  groupContext.selected = props.modelValue;
  groupContext.disabled = props.disabled;
  groupContext.size = props.size;
  groupContext.labelClass = props.labelClass;
});

provide(SEGMENTED_CONTROL_CONTEXT_KEY, groupContext);
provide(SEGMENTED_CONTROL_SELECT_KEY, selectValue);
provide(SEGMENTED_CONTROL_FOCUS_KEY, setFocus);

// Ensures at least one enabled item is tabbable (WAI-ARIA radiogroup requirement).
// Items set tabindex based on isSelected && !isDisabled. If the selected item is disabled
// or modelValue doesn't match any item, no item has tabindex="0". This fallback sets
// tabindex="0" on the first enabled item so keyboard users can reach the control.
function ensureTabbable () {
  const items = getItems();
  if (!items.length) return;
  const hasTabbable = items.some(el => el.getAttribute('tabindex') === '0');
  if (hasTabbable) return;
  const firstEnabled = items.find(el => !isItemDisabled(el));
  if (firstEnabled) firstEnabled.setAttribute('tabindex', '0');
}

let _animConfig = null;
let _animState = { indicator: null, hideNative: null };

onMounted(() => {
  ensureTabbable();
  const el = container.value?.$el || container.value;
  if (el) {
    _animConfig = cacheIndicatorConfig(
      el, '--segmented-indicator-duration', '--segmented-indicator-easing',
    );
  }
});

onBeforeUnmount(() => {
  cancelIndicatorAnimations(_animState);
});

watch(() => [props.modelValue, props.disabled], ensureTabbable, { flush: 'post' });

function getItems () {
  const el = container.value?.$el || container.value;
  return el ? Array.from(el.querySelectorAll(SEGMENTED_CONTROL_ITEM_SELECTOR)) : [];
}

function setFocus (value) {
  focusedValue.value = value;
}

function selectValue (value, { animate: shouldAnimate = true } = {}) {
  if (props.disabled) return;
  if (value === props.modelValue) return;
  const beforeChangeEvent = new Event('before-change', { cancelable: true });
  emit('before-change', beforeChangeEvent);
  if (beforeChangeEvent.defaultPrevented) return;

  const containerEl = container.value?.$el || container.value;
  const canAnimate = shouldAnimate && props.showIndicatorTransition &&
    _animConfig && !_animConfig.prefersReducedMotion;

  let oldRect = null;
  let oldBg = null;
  if (canAnimate && containerEl) {
    const oldEl = containerEl.querySelector('[aria-checked="true"]');
    oldRect = oldEl?.getBoundingClientRect();
    if (oldEl) {
      oldBg = getComputedStyle(oldEl).backgroundColor;
    }
  }

  emit('update:modelValue', value);
  emit('change', value);

  if (!oldRect || !canAnimate) return;

  nextTick(() => {
    const newEl = containerEl.querySelector(`[${SEGMENTED_CONTROL_DATA_VALUE_ATTR}="${value}"]`);
    if (!newEl || typeof newEl.animate !== 'function') return;

    animateIndicator(_animState, {
      oldRect,
      newEl,
      orientation: props.orientation,
      duration: _animConfig.duration,
      easing: _animConfig.easing,
      hideProps: { backgroundColor: 'transparent' },
      indicatorExtra: { backgroundColor: oldBg },
      pseudoElement: '::after',
    });
  });
}

function getFocusedIndex (items, event) {
  // First check event.target — the element that actually has focus
  if (event) {
    const target = event.target.closest(SEGMENTED_CONTROL_ITEM_SELECTOR);
    if (target) {
      const targetIdx = items.indexOf(target);
      if (targetIdx !== -1) return targetIdx;
    }
  }
  // Fall back to tracked focusedValue, then aria-checked
  const idx = items.findIndex(el => {
    const value = el.getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR);
    return focusedValue.value ? value === focusedValue.value : el.getAttribute('aria-checked') === 'true';
  });
  return idx === -1 ? 0 : idx;
}

function activateItem (item) {
  if (isItemDisabled(item)) return;
  selectValue(item.getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR));
}

function isItemDisabled (item) {
  return item.getAttribute('aria-disabled') === 'true';
}

function findNextEnabled (items, fromIndex, direction) {
  const len = items.length;
  for (let i = 1; i <= len; i++) {
    const index = (fromIndex + i * direction + len) % len;
    if (!isItemDisabled(items[index])) return index;
  }
  return fromIndex;
}

function getNavigationIndex (key, currentIndex, items) {
  const isHorizontal = props.orientation === 'horizontal';
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

  switch (key) {
    case nextKey: return findNextEnabled(items, currentIndex, 1);
    case prevKey: return findNextEnabled(items, currentIndex, -1);
    case 'Home': return findNextEnabled(items, items.length - 1, 1);
    case 'End': return findNextEnabled(items, 0, -1);
    default: return -1;
  }
}

function handleKeyDown (event) {
  const items = getItems();
  if (!items.length) return;

  const focusedIndex = getFocusedIndex(items, event);

  if (event.key === 'Enter' || event.key === ' ') {
    activateItem(items[focusedIndex]);
    event.preventDefault();
    event.stopPropagation();
    return;
  }

  const newIndex = getNavigationIndex(event.key, focusedIndex, items);
  if (newIndex === -1) return;

  event.preventDefault();
  event.stopPropagation();
  items[newIndex].focus();

  if (props.activationMode === 'auto') {
    cancelIndicatorAnimations(_animState);
    const value = items[newIndex].getAttribute(SEGMENTED_CONTROL_DATA_VALUE_ATTR);
    if (!isItemDisabled(items[newIndex])) {
      selectValue(value, { animate: false });
    }
  }
}
</script>
