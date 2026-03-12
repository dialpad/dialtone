<template>
  <dt-input
    :model-value="value"
    :disabled="disabled"
    spellcheck="false"
    size="xs"
    @input="updateValue"
  >
    <template #labelSlot>
      <dt-text
        kind="label"
        size="xs"
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
