<template>
  <dt-stack
    class="d-segmented-control"
    :direction="stackDirection"
    :gap="gap"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <dt-button
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => setButtonRef(index, el)"
      class="d-segmented-control__item"
      role="radio"
      :aria-checked="String(modelValue === option.value)"
      :tabindex="getTabIndex(index)"
      :active="modelValue === option.value"
      :disabled="disabled || option.disabled"
      :aria-disabled="(disabled || option.disabled) ? 'true' : undefined"
      :label-class="`d-segmented-control__item-label ${labelClass}`"
      kind="muted"
      importance="clear"
      :size="buttonSize"
      :aria-label="option.iconOnly ? option.label : undefined"
      data-qa="dt-segmented-control__option"
      @click="handleClick(option)"
      @keydown="handleKeyDown($event, index)"
    >
      <template
        v-if="option.icon"
        #startIcon="{ iconSize }"
      >
        <component
          :is="option.icon"
          :size="iconSize"
        />
      </template>
      <template
        v-if="option.leading"
        #leading
      >
        <component :is="option.leading" />
      </template>
      <template
        v-if="option.trailing"
        #trailing
      >
        <component :is="option.trailing" />
      </template>
      <template v-if="!option.iconOnly">
        {{ option.label }}
      </template>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { DtStack } from '@/components/stack';
import { DtButton } from '@/components/button';
import {
  SEGMENTED_CONTROL_SIZES,
  SEGMENTED_CONTROL_ORIENTATIONS,
  SEGMENTED_CONTROL_ACTIVATION_MODES,
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
   * Array of { value, label, icon?, leading?, trailing?, disabled? } options.
   */
  options: {
    type: Array,
    required: true,
  },

  /**
   * Accessible label for the group.
   */
  ariaLabel: {
    type: String,
    default: undefined,
  },

  /**
   * DtStack gap between options.
   */
  gap: {
    type: String,
    default: '300',
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
   * DtButton size for all options.
   * @values default, xs, sm, lg, xl
   */
  size: {
    type: String,
    default: 'default',
    validator: (v) => SEGMENTED_CONTROL_SIZES.includes(v),
  },

  /**
   * Controls whether options are selected on focus (auto) or on click/Space/Enter (manual).
   * @values auto, manual
   */
  activationMode: {
    type: String,
    default: 'manual',
    validator: (v) => SEGMENTED_CONTROL_ACTIVATION_MODES.includes(v),
  },

  /**
   * Disables all options in the group.
   * Per-option disabled is set via option.disabled in the options array.
   */
  disabled: {
    type: Boolean,
    default: false,
  },

  /**
   * Pass-through class for DtButton's label container.
   */
  labelClass: {
    type: [String, Array, Object],
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const buttonRefs = ref([]);
const focusedIndex = ref(0);

const stackDirection = computed(() => props.orientation === 'vertical' ? 'column' : 'row');

const buttonSize = computed(() => props.size === 'default' ? undefined : props.size);

const selectedIndex = computed(() => {
  const index = props.options.findIndex(opt => opt.value === props.modelValue);
  return index >= 0 ? index : 0;
});

watch(selectedIndex, (newIndex) => {
  focusedIndex.value = newIndex;
});

onMounted(() => {
  focusedIndex.value = selectedIndex.value;
});

function setButtonRef (index, el) {
  if (el) {
    buttonRefs.value[index] = el.$el || el;
  } else {
    buttonRefs.value[index] = null;
  }
}

function getTabIndex (index) {
  return index === selectedIndex.value ? 0 : -1;
}

function handleClick (option) {
  if (props.disabled || option.disabled) return;
  emit('update:modelValue', option.value);
}

function findNextEnabledIndex (startIndex, direction) {
  const len = props.options.length;
  let index = startIndex;
  for (let i = 0; i < len; i++) {
    index = (index + direction + len) % len;
    if (!props.options[index].disabled) return index;
  }
  return startIndex;
}

function handleKeyDown (event, currentIndex) {
  const isHorizontal = props.orientation === 'horizontal';
  const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
  const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

  let newIndex = currentIndex;
  let handled = false;

  switch (event.key) {
    case nextKey:
      newIndex = findNextEnabledIndex(currentIndex, 1);
      handled = true;
      break;

    case prevKey:
      newIndex = findNextEnabledIndex(currentIndex, -1);
      handled = true;
      break;

    case 'Home':
      newIndex = 0;
      handled = true;
      break;

    case 'End':
      newIndex = props.options.length - 1;
      handled = true;
      break;

    case 'Enter':
    case ' ':
      handleClick(props.options[currentIndex]);
      handled = true;
      break;
  }

  if (handled) {
    event.preventDefault();
    event.stopPropagation();

    if (event.key !== 'Enter' && event.key !== ' ') {
      focusedIndex.value = newIndex;
      const buttonEl = buttonRefs.value[newIndex];
      if (buttonEl && typeof buttonEl.focus === 'function') {
        buttonEl.focus();
      }

      if (props.activationMode === 'auto') {
        handleClick(props.options[newIndex]);
      }
    }
  }
}
</script>
