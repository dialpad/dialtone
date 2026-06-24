<template>
  <div class="dtc-control-boolean">
    <dt-stack
      direction="row"
      gap="50"
      align="center"
    >
      <dt-toggle
        :model-value="toggleValue"
        :disabled="disabled"
        label-class="d-label--sm d-fc-secondary"
        :size="200"
        class="d-jc-space-between d-fl1"
        data-qa="dtc-control-boolean-input"
        @update:model-value="e => emit(VALUE_UPDATE_EVENT, e)"
      >
        <dt-text
          kind="label"
          :size="100"
          tone="secondary"
          class="d-input__label-text d-mbe-0"
        >
          <slot />
        </dt-text>
      </dt-toggle>
      <!--
      KEEP THIS HERE SHOULD WE DECIDE TO USE IT LATER.
      <dt-button
        v-dt-tooltip="`Remove`"
        aria-label="Remove value"
        importance="clear"
        :size="100"
        kind="muted"
        disabled
      >
        <template #startIcon="{ iconSize }">
          <dt-icon-minus :size="iconSize" />
        </template>
      </dt-button>
      -->
    </dt-stack>
  </div>
</template>

<script setup>
import { DtStack, DtText, DtToggle } from '@dialpad/dialtone-vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: [Boolean, null],
    default: () => false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const toggleValue = computed(() => props.value ?? false);
</script>

<script>
/**
 * Control that is used to set 'boolean' value.
 */
export default {
  name: 'DtcControlBoolean',
};
</script>

<style>
.dtc-control-boolean .d-checkbox__input {
  align-self: center;
}

.dtc-control-boolean__label {
  color: var(--base--text-color);
  font-size: var(--base--font-size);
}
</style>
