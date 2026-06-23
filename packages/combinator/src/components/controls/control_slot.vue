<template>
  <dtc-control-clearable-shell
    :empty="isEmpty"
    :expanded="expanded"
    :disabled="disabled"
    :required="required"
    :clearable="clearable"
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
      type="textarea"
      spellcheck="false"
      :size="100"
      input-class="comb-control-textarea d-hmx-200"
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
    </dt-input>
  </dtc-control-clearable-shell>
</template>

<script setup>
import { DtInput, DtText } from '@dialpad/dialtone-vue';
import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    default: () => null,
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
    default: () => null,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const expanded = ref(false);
const inputRef = ref(null);
const hasPendingValue = ref(false);

const inputValue = computed(() => props.value ?? '');

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '');

const clearDisabled = computed(() => !props.clearable || props.required || props.disabled || isEmpty.value);

function updateValue (e) {
  const value = e || null;
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
  if (isEmpty.value) expanded.value = false;
});
</script>

<script>
/**
 * Control that is used to set a string representing the slot content of a component.
 */
export default {
  name: 'DtcControlSlot',
};
</script>

<style lang="less">
.comb-control-textarea {
  field-sizing: content;
}
</style>
