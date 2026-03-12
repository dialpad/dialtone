<template>
  <dt-select-menu
    :model-value="value"
    :options="options"
    :disabled="disabled"
    size="xs"
    @input="onInput"
  >
    <template #label>
      <slot />
    </template>
  </dt-select-menu>
</template>

<script setup>
import { DtSelectMenu } from '@dialpad/dialtone-vue';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
  defaultValue: {
    type: undefined,
    default: undefined,
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
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

function onInput (e) {
  emit(VALUE_UPDATE_EVENT, e === 'null' ? null : e);
}

const options = computed(() => {
  const valueOptions = props.validValues?.map(selection => {
    return { value: selection, label: props.generateLabel(selection) };
  }) ?? [];

  if (props.defaultValue === null || props.defaultValue === undefined) {
    return [{ value: null, label: 'null' }, ...valueOptions];
  }
  return valueOptions;
});
</script>

<script>
/**
 * Control that is used to select any value from a list of values.
 */
export default {
  name: 'DtcControlSelection',
};
</script>
