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
      type="number"
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
    </dt-input>
  </dtc-control-clearable-shell>
</template>

<script setup>
import { DtInput, DtText } from '@dialpad/dialtone-vue';
import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { useClearableInput } from '@/src/lib/utils_vue';

const props = defineProps({
  value: {
    type: undefined,
    default: 0,
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
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const { expanded, inputRef, inputValue, isEmpty, updateValue, addValue, collapseIfEmpty, clearValue } =
  useClearableInput({ props, emit, parse: (e) => (e === '' ? null : parseInt(e)) });
</script>

<script>
/**
 * Control that is used to set 'number' value.
 */
export default {
  name: 'DtcControlNumber',
};
</script>
