<template>
  <dt-stack
    ref="container"
    :class="containerClasses"
    :direction="stackDirection"
    :gap="gap"
    role="radiogroup"
    :aria-label="ariaLabel"
    @keydown="handleKeyDown"
  >
    <!-- @slot DtSegmentedControlItem children -->
    <slot />
  </dt-stack>
</template>

<script setup>
import { ref, computed, reactive, watch, provide } from 'vue';
import { DtStack } from '@/components/stack';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_SIZE_MODIFIERS,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
  SEGMENTED_CONTROL_SPREADS,
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
} from './segmented_control_constants.js';

defineOptions({ name: 'DtSegmentedControl' });

const props = defineProps({
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
   * DtStack gap between items.
   */
  gap: {
    type: String,
    default: '100',
  },

  /**
   * Orientation of the segmented control.
   * Maps to DtStack direction: horizontal -> row, vertical -> column.
   * @values horizontal, vertical
   */
  orientation: {
    type: String,
    default: 'horizontal',
    validator: (v) => SEGMENTED_CONTROL_ORIENTATIONS.includes(v),
  },

  /**
   * DtButton size for all items. Inherited by children via provide.
   * @values default, xs, sm, lg, xl
   */
  size: {
    type: String,
    default: 'default',
    validator: (v) => SEGMENTED_CONTROL_SIZES.includes(v),
  },

  /**
   * Controls whether items are selected on focus (auto) or on click/Space/Enter (manual).
   * @values auto, manual
   */
  activationMode: {
    type: String,
    default: 'manual',
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
   * Controls how items distribute space.
   * 'grow' (default): items size to their content.
   * 'evenly': items share space equally.
   * @values grow, evenly
   */
  spread: {
    type: String,
    default: 'grow',
    validator: (v) => SEGMENTED_CONTROL_SPREADS.includes(v),
  },

  /**
   * Default label class for all items. Items can override with their own labelClass prop.
   */
  labelClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const container = ref(null);
const focusedValue = ref(null);

const stackDirection = computed(() => props.orientation === 'vertical' ? 'column' : 'row');

const containerClasses = computed(() => [
  'd-segmented-control',
  SEGMENTED_CONTROL_SIZE_MODIFIERS[props.size],
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

watch(() => props.modelValue, (v) => { groupContext.selected = v; });
watch(() => props.disabled, (v) => { groupContext.disabled = v; });
watch(() => props.size, (v) => { groupContext.size = v; });
watch(() => props.labelClass, (v) => { groupContext.labelClass = v; });

provide(SEGMENTED_CONTROL_CONTEXT_KEY, groupContext);
provide(SEGMENTED_CONTROL_SELECT_KEY, selectValue);
provide(SEGMENTED_CONTROL_FOCUS_KEY, setFocus);

function getItems () {
  const el = container.value?.$el || container.value;
  return el ? Array.from(el.querySelectorAll('[role="radio"]')) : [];
}

function setFocus (value) {
  focusedValue.value = value;
}

function selectValue (value) {
  if (props.disabled) return;
  emit('update:modelValue', value);
}

function getFocusedIndex (items, event) {
  // First check event.target — the element that actually has focus
  if (event) {
    const target = event.target.closest('[role="radio"]');
    if (target) {
      const targetIdx = items.indexOf(target);
      if (targetIdx !== -1) return targetIdx;
    }
  }
  // Fall back to tracked focusedValue, then aria-checked
  const idx = items.findIndex(el => {
    const value = el.getAttribute('data-value');
    return focusedValue.value ? value === focusedValue.value : el.getAttribute('aria-checked') === 'true';
  });
  return idx === -1 ? 0 : idx;
}

function activateItem (item) {
  if (isItemDisabled(item)) return;
  selectValue(item.getAttribute('data-value'));
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
    activateItem(items[newIndex]);
  }
}
</script>
