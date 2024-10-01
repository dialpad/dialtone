<template>
  <dt-select-menu
    label-class="d-fs16 d-fw-normal d-mb0"
    :value="value"
    :options="options"
    :disabled="disabled"
    size="xs"
    @input="e => emit(VALUE_UPDATE_EVENT, e)"
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

const options = computed(() => {
  return props.validValues?.map(selection => {
    return { value: selection, label: props.generateLabel(selection) };
  });
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
