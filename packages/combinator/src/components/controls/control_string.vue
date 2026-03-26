<template>
  <dt-input
    :model-value="value"
    :disabled="disabled"
    :messages="messages"
    :size="100"
    @input="e => emit(VALUE_UPDATE_EVENT, e)"
  >
    <template #labelSlot>
      <dt-text
        kind="label"
        :size="100"
        tone="secondary"
        class="d-input__label-text"
      >
        <slot />
      </dt-text>
    </template>
    <template #endIcon="{ iconSize }">
      <dt-button
        v-if="isModified && !$slots.icon"
        kind="muted"
        importance="clear"
        :size="100"
        class="d-p2"
        @click.stop="onReset"
      >
        <template #icon>
          <dt-icon-close size="100" />
        </template>
      </dt-button>
      <slot
        v-else
        name="icon"
        :icon-size="iconSize"
      />
    </template>
  </dt-input>
</template>

<script setup>
import { DtButton, DtInput, DtText, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
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
  defaultValue: {
    type: String,
    default: () => String(),
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const isModified = computed(() => props.value !== props.defaultValue);

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

function onReset () {
  emit(VALUE_UPDATE_EVENT, props.defaultValue);
}
</script>

<script>
/**
 * Control that is used to set 'string' value.
 */
export default {
  name: 'DtcControlString',
};
</script>
