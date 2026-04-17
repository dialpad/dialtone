<template>
  <dt-text
    kind="label"
    :size="100"
    tone="secondary"
    class="d-input__label-text d-c-default"
  >
    <slot />
  </dt-text>
  <dt-segmented-control
    :model-value="String(value)"
    :size="100"
    :disabled="disabled"
    @change="onInput"
  >
    <dt-segmented-control-item
      v-for="option in options"
      :key="option.value"
      v-dt-tooltip="option.resolved ?? undefined"
      :value="String(option.value)"
    >
      {{ option.label }}
    </dt-segmented-control-item>
  </dt-segmented-control>
</template>

<script setup>
import { DtSegmentedControl, DtSegmentedControlItem, DtText } from '@dialpad/dialtone-vue';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { resolveTokenValue } from '@/src/lib/tokens';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
  validValues: {
    type: Array,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  generateLabel: {
    type: Function,
    default: (value) => value.toString(),
  },
  tokenCategory: {
    type: String,
    default: undefined,
  },
  propValues: {
    type: Object,
    default: undefined,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const options = computed(() => {
  return props.validValues?.map(v => ({
    value: v,
    label: props.generateLabel(v),
    resolved: props.tokenCategory
      ? resolveTokenValue(props.tokenCategory, v, props.propValues)
      : null,
  })) ?? [];
});

// DtSegmentedControl coerces values to strings — map back to original types on selection
const valueMap = computed(() => {
  const map = {};
  props.validValues?.forEach(v => {
    map[String(v)] = v;
  });
  return map;
});

function onInput (stringValue) {
  emit(VALUE_UPDATE_EVENT, valueMap.value[stringValue]);
}
</script>

<script>
/**
 * Control that renders a segmented control for enum props with few, short options.
 */
export default {
  name: 'DtcControlSegmented',
};
</script>
