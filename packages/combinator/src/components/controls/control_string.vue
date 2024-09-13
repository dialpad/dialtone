<template>
  <dt-input
    :value="value"
    :disabled="disabled"
    :messages="messages"
    size="sm"
    @input="e => emit(VALUE_UPDATE_EVENT, e)"
  >
    <template #labelSlot>
      <span>
        <slot />
      </span>
    </template>
    <template #rightIcon>
      <slot name="icon" />
    </template>
  </dt-input>
</template>

<script setup>
import { DtInput, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: String,
    default: () => String(),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  warning: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const messages = computed(() => {
  const messages = [];
  if (props.warning) {
    messages.push({
      message: props.warning,
      type: VALIDATION_MESSAGE_TYPES.WARNING,
    });
  }
  return messages;
});
</script>

<script>
/**
 * Control that is used to set 'string' value.
 */
export default {
  name: 'DtcControlString',
};
</script>
