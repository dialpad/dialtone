<template>
  <dtc-control-clearable-shell
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
  </dtc-control-clearable-shell>
</template>

<script setup>
import { DtInput, DtText, VALIDATION_MESSAGE_TYPES } from '@dialpad/dialtone-vue';
import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, nextTick, ref, watch } from 'vue';

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

const expanded = ref(false);
const inputRef = ref(null);
const hasPendingValue = ref(false);
const hasInternalUpdate = ref(false);

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

function updateValue (value) {
  expanded.value = true;
  hasInternalUpdate.value = true;
  hasPendingValue.value = value !== null && value !== undefined && value !== '';
  emit(VALUE_UPDATE_EVENT, value);
}

async function addValue () {
  expanded.value = true;
  await nextTick();
  inputRef.value?.focus();
}

function collapseIfEmpty () {
  if (!isEmpty.value || hasPendingValue.value) return;
  expanded.value = false;
}

function clearValue () {
  if (clearDisabled.value) return;
  expanded.value = false;
  hasPendingValue.value = false;
  emit(VALUE_UPDATE_EVENT, null);
}

watch(() => props.value, () => {
  hasPendingValue.value = false;
  if (hasInternalUpdate.value) {
    hasInternalUpdate.value = false;
    return;
  }
  if (isEmpty.value) expanded.value = false;
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
