<template>
  <dt-input
    :model-value="value"
    :disabled="disabled"
    type="textarea"
    input-class="d-pie-400"
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
    <template #endIcon>
      <dt-button
        v-if="isModified"
        kind="muted"
        importance="clear"
        size="xs"
        class="d-p-25 d-mie-n200"
        @click.stop="onReset"
      >
        <template #icon>
          <dt-icon-close size="100" />
        </template>
      </dt-button>
    </template>
  </dt-input>
</template>

<script setup>
import { DtButton, DtInput, DtText } from '@dialpad/dialtone-vue';
import { DtIconClose } from '@dialpad/dialtone-icons/vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    default: () => null,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  defaultValue: {
    type: undefined,
    default: () => null,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const isModified = computed(() => props.value !== props.defaultValue);

function updateValue (e) {
  const value = e || null;
  emit(VALUE_UPDATE_EVENT, value);
}

function onReset () {
  emit(VALUE_UPDATE_EVENT, props.defaultValue);
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
