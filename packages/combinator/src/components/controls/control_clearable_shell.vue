<template>
  <dt-stack
    v-if="isCollapsed"
    direction="row"
    gap="50"
    align="center"
    justify="space-between"
  >
    <dt-text
      kind="label"
      :size="100"
      tone="secondary"
      class="d-input__label-text d-c-default d-mbe-0"
    >
      <slot name="label" />
    </dt-text>
    <dt-button
      v-dt-tooltip="`Add`"
      aria-label="Add value"
      importance="clear"
      :size="100"
      kind="muted"
      :disabled="addDisabled"
      @click="emit('add')"
    >
      <template #startIcon="{ iconSize }">
        <dt-icon-plus :size="iconSize" />
      </template>
    </dt-button>
  </dt-stack>
  <template v-else>
    <slot name="expanded-label" />
    <dt-stack
      direction="row"
      gap="50"
      :align="align"
    >
      <div class="d-fl1">
        <slot />
      </div>
      <dt-button
        v-dt-tooltip="`Remove`"
        aria-label="Remove value"
        importance="clear"
        :size="100"
        kind="muted"
        :disabled="removeDisabled"
        @click="emit('clear')"
      >
        <template #startIcon="{ iconSize }">
          <dt-icon-dash :size="iconSize" />
        </template>
      </dt-button>
    </dt-stack>
  </template>
</template>

<script setup>
import { DtButton, DtStack, DtText } from '@dialpad/dialtone-vue';
import { DtIconDash, DtIconPlus } from '@dialpad/dialtone-icons/vue';
import { computed } from 'vue';

const props = defineProps({
  empty: {
    type: Boolean,
    required: true,
  },
  expanded: {
    type: Boolean,
    default: false,
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
  align: {
    type: String,
    default: 'start',
  },
});

const emit = defineEmits(['add', 'clear']);

const baseDisabled = computed(() => !props.clearable || props.required || props.disabled);

const addDisabled = computed(() => baseDisabled.value || !props.empty);

const removeDisabled = computed(() => baseDisabled.value || props.empty);

const isCollapsed = computed(() => {
  return props.empty && !props.expanded && !props.required && (props.clearable || props.disabled);
});
</script>

<script>
export default {
  name: 'DtcControlClearableShell',
};
</script>
