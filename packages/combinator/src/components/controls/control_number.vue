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
      type="number"
      :size="100"
      @update:model-value="updateValue"
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
import { DtButton, DtInput, DtStack, DtText } from '@dialpad/dialtone-vue';
import { DtIconDash } from '@dialpad/dialtone-icons/vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

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

const inputValue = computed(() => props.value ?? '');

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '');

const clearDisabled = computed(() => !props.clearable || props.required || props.disabled || isEmpty.value);

function updateValue (e) {
  emit(VALUE_UPDATE_EVENT, e === '' ? null : parseInt(e));
}

function clearValue () {
  if (clearDisabled.value) return;
  emit(VALUE_UPDATE_EVENT, null);
}
</script>

<script>
/**
 * Control that is used to set 'number' value.
 */
export default {
  name: 'DtcControlNumber',
};
</script>
