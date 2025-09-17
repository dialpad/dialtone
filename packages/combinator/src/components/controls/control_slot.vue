<template>
  <dt-input
    :value="value"
    :disabled="disabled"
    spellcheck="false"
    size="sm"
    @input="updateValue"
  >
    <template #labelSlot>
      <span class="d-input__label-text d-label--sm">
        <slot />
      </span>
    </template>
  </dt-input>
</template>

<script setup>
import { DtInput } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';

defineProps({
  value: {
    type: undefined,
    default: () => null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

function updateValue (e) {
  const value = e || null;
  emit(VALUE_UPDATE_EVENT, value);
}
</script>

<script>
/**
 * Control that is used to set a string representing the slot content of a component.
 */
export default {
  name: 'DtcControlSlot',
};
</script>
