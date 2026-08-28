<template>
  <dtc-control-clearable-shell
    :label="label"
    :empty="isEmpty"
    :expanded="expanded"
    :disabled="disabled"
    :required="required"
    :clearable="clearable"
    align="end"
    @add="addValue"
    @clear="clearValue"
  >
    <template #label>
      <slot />
    </template>
    <dt-input
      ref="inputRef"
      class="d-fl1"
      :model-value="inputValue"
      :disabled="disabled"
      :messages="messages"
      :size="100"
      @update:model-value="updateValue"
      @blur="collapseIfEmpty"
    >
      <template #label>
        <dt-text
          kind="label"
          :size="100"
          tone="secondary"
          class="d-mbe-50 d-c-default d-d-block"
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
  </dtc-control-clearable-shell>
</template>

<script setup>
import { DtInput, DtText, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';
import { useClearableInput } from '@/src/lib/utils_vue';

const props = defineProps({
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

const { expanded, inputRef, inputValue, isEmpty, updateValue, addValue, collapseIfEmpty, clearValue } =
  useClearableInput({ props, emit });

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
