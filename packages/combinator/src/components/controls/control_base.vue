<template>
  <dtc-control-string
    :label="label"
    :value="value?.toString()"
    :disabled="disabled"
    :required="required"
    :clearable="clearable"
    :default-value="defaultValue"
    @update:value="e => emit(VALUE_UPDATE_EVENT, e)"
  >
    <slot />
  </dtc-control-string>
</template>

<script setup>
import DtcControlString from './control_string.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';

defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: undefined,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  defaultValue: {
    type: undefined,
    default: '',
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);
</script>

<script>
/**
 * Control that is used when no other controls are valid.
 */
export default {
  name: 'DtcControlBase',
};
</script>
