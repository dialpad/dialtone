<template>
  <dt-input
    :model-value="value"
    :disabled="disabled"
    type="number"
    :size="100"
    @input="e => emit(VALUE_UPDATE_EVENT, e === '' ? undefined : parseInt(e))"
  >
    <template #label>
      <dt-text
        kind="label"
        :size="100"
        tone="secondary"
        class="d-input__label-text"
      >
        <slot />
      </dt-text>
    </template>
  </dt-input>
</template>

<script setup>
import { DtInput, DtText } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';

defineProps({
  value: {
    type: Number,
    default: () => Number(),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);
</script>

<script>
/**
 * Control that is used to set 'number' value.
 */
export default {
  name: 'DtcControlNumber',
};
</script>
