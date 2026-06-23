<template>
  <dt-stack
    direction="row"
    gap="50"
    align="end"
  >
    <dt-input
      class="d-fl1"
      :model-value="inputValue"
      :disabled="disabled"
      :messages="messages"
      :size="100"
      @update:model-value="e => emit(VALUE_UPDATE_EVENT, e)"
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
      <template
        v-if="$slots.icon"
        #endIcon="{ iconSize }"
      >
        <slot
          name="icon"
          :icon-size="iconSize"
        />
      </template>
    </dt-input>
    <dt-button
      v-dt-tooltip="`Remove`"
      aria-label="Remove value"
      importance="clear"
      :size="100"
      kind="muted"
      :disabled="clearDisabled"
      :class="{ 'd-o0': clearDisabled }"
      @click="clearValue"
    >
      <template #startIcon="{ iconSize }">
        <dt-icon-dash :size="iconSize" />
      </template>
    </dt-button>
  </dt-stack>
</template>

<script setup>
import { DtButton, DtInput, DtStack, DtText, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
import { DtIconDash } from '@dialpad/dialtone-icons/vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
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
  warning: {
    type: String,
    default: undefined,
  },
  defaultValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const inputValue = computed(() => props.value ?? '');

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '');

const clearDisabled = computed(() => !props.clearable || props.required || props.disabled || isEmpty.value);

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

function clearValue () {
  if (clearDisabled.value) return;
  emit(VALUE_UPDATE_EVENT, null);
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
