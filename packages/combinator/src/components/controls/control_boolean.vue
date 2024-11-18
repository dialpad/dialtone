<template>
  <div class="dtc-control-boolean">
    <dt-checkbox
      label-class="dtc-control-boolean__label"
      :checked="value"
      :disabled="disabled"
      data-qa="dtc-control-boolean-input"
      @input="e => emit(VALUE_UPDATE_EVENT, e)"
    >
      <slot />
    </dt-checkbox>
  </div>
</template>

<script setup>
import { DtCheckbox } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';

defineProps({
  value: {
    type: Boolean,
    default: () => false,
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
 * Control that is used to set 'boolean' value.
 */
export default {
  name: 'DtcControlBoolean',
};
</script>

<style>
.dtc-control-boolean .d-checkbox__input {
  align-self: center;
}

.dtc-control-boolean__label {
  color: var(--base--text-color);
  font-size: var(--base--font-size);
}
</style>
