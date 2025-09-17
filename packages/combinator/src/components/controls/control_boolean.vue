<template>
  <div class="dtc-control-boolean">
    <dt-toggle
      :value="value"
      :disabled="disabled"
      label-class="d-label--sm d-fc-secondary"
      size="sm"
      wrapper-class="d-jc-space-between"
      data-qa="dtc-control-boolean-input"
      @change="e => emit(VALUE_UPDATE_EVENT, e)"
    >
      <slot />
    </dt-toggle>
  </div>
</template>

<script setup>
import { DtToggle } from '@dialpad/dialtone-vue';
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
