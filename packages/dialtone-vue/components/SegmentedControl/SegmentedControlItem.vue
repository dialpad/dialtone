<template>
  <dt-button
    class="d-segmented-control__item"
    role="radio"
    :aria-checked="String(isSelected)"
    :tabindex="isSelected && !isDisabled ? '0' : '-1'"
    :active="isSelected"
    :disabled="isDisabled"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-label="label"
    :label-class="resolvedLabelClass"
    :data-value="value"
    kind="muted"
    importance="clear"
    :size="buttonSize"
    data-qa="dt-segmented-control-item"
    v-bind="$attrs"
    @click="handleClick"
    @focus="handleFocus"
  >
    <template
      v-if="$slots.startIcon"
      #startIcon="{ iconSize }"
    >
      <!-- @slot Icon displayed at the inline-start of the label. Provides { iconSize } scoped binding. -->
      <slot
        name="startIcon"
        :icon-size="iconSize"
      />
    </template>
    <template
      v-if="$slots.endIcon"
      #endIcon="{ iconSize }"
    >
      <!-- @slot Icon displayed at the inline-end of the label. Provides { iconSize } scoped binding. -->
      <slot
        name="endIcon"
        :icon-size="iconSize"
      />
    </template>
    <template
      v-if="$slots.leading"
      #leading
    >
      <!-- @slot Content rendered before the label (e.g. badges, indicators). -->
      <slot name="leading" />
    </template>
    <template
      v-if="$slots.trailing"
      #trailing
    >
      <!-- @slot Content rendered after the label (e.g. badges, counts). -->
      <slot name="trailing" />
    </template>
    <!-- @slot Label text content -->
    <slot />
  </dt-button>
</template>

<script setup>
import { computed, inject } from 'vue';
import { DtButton } from '@/components/button';
import {
  SEGMENTED_CONTROL_CONTEXT_KEY,
  SEGMENTED_CONTROL_SELECT_KEY,
  SEGMENTED_CONTROL_FOCUS_KEY,
  SEGMENTED_CONTROL_SIZE_DEFAULT,
} from './SegmentedControlConstants.js';

defineOptions({
  name: 'DtSegmentedControlItem',
  inheritAttrs: false,
});

const props = defineProps({
  /**
   * Unique value for this item, used for selection matching with v-model.
   */
  value: {
    type: String,
    required: true,
  },

  /**
   * Accessible label for the button (aria-label).
   * Visible text comes from the default slot, not this prop.
   * Required for icon-only items.
   */
  label: {
    type: String,
    default: undefined,
  },

  /**
   * Disables this individual item.
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Custom class for this item's label container.
   * Overrides the parent's labelClass when provided.
   */
  labelClass: {
    type: [String, Array, Object],
    default: undefined,
  },
});

const emit = defineEmits([
  /**
   * Native button click event.
   * @event click
   * @type {PointerEvent | KeyboardEvent}
   */
  'click',

  /**
   * Native button focus event.
   * @event focus
   * @type {FocusEvent}
   */
  'focus',
]);

const groupContext = inject(SEGMENTED_CONTROL_CONTEXT_KEY, { selected: '', disabled: false, size: SEGMENTED_CONTROL_SIZE_DEFAULT, labelClass: '' });
const selectValue = inject(SEGMENTED_CONTROL_SELECT_KEY, () => {});
const setFocus = inject(SEGMENTED_CONTROL_FOCUS_KEY, () => {});

const isSelected = computed(() => groupContext.selected === props.value);
const isDisabled = computed(() => groupContext.disabled || props.disabled);

const buttonSize = computed(() => groupContext.size);

const resolvedLabelClass = computed(() => {
  return ['d-segmented-control__item-label', props.labelClass ?? groupContext.labelClass].filter(Boolean);
});

function handleClick (event) {
  emit('click', event);
  if (isDisabled.value) return;
  selectValue(props.value);
}

function handleFocus (event) {
  emit('focus', event);
  setFocus(props.value);
}
</script>
