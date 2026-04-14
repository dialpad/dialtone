<template>
  <dt-text
    kind="label"
    :size="100"
    tone="secondary"
    class="d-input__label-text d-c-default"
  >
    <slot />
  </dt-text>
  <dt-dropdown
    navigation-type="arrow-keys"
    placement="bottom-start"
    content-class="d-w-250 d-hmx-350"
  >
    <template #anchor="{ attrs }">
      <dt-button
        v-bind="attrs"
        importance="outlined"
        kind="muted"
        :size="100"
        :disabled="disabled"
        class="d-w100p"
        label-class="d-jc-space-between d-fw-normal"
      >
        {{ selectedLabel }}
        <span aria-hidden="true">&thinsp;<!-- hold the space --></span>
        <dt-text
          v-if="selectedOption?.resolved"
          v-dt-tooltip="selectedOption.resolved.includes('/') ? 'Font Size / Line Height' : undefined"
          kind="body"
          :size="100"
          tone="muted"
        >
          {{ selectedOption.resolved }}
        </dt-text>
        <template #endIcon="{ iconSize }">
          <dt-icon-chevrons-up-down
            class="d-fc-muted"
            :size="iconSize"
          />
        </template>
      </dt-button>
    </template>
    <template #list="{ close }">
      <dt-list-item
        v-for="option in options"
        :key="option.value"
        role="menuitem"
        navigation-type="arrow-keys"
        :class="{ 'd-o50 d-pe-none': option.disabled }"
        :aria-disabled="option.disabled || undefined"
        @click="!option.disabled && (onInput(option.value), close())"
      >
        <dt-stack
          direction="row"
          gap="200"
          align="baseline"
          class="d-w100p"
        >
          <span>{{ option.label }}</span>
          <dt-text
            v-if="option.resolved"
            kind="body"
            :size="100"
            tone="muted"
            class="d-mis-auto"
          >
            {{ option.resolved }}
          </dt-text>
        </dt-stack>
        <template #end>
          <dt-icon-check
            size="200"
            :class="option.value === value ? 'd-o100' : 'd-o0'"
          />
        </template>
      </dt-list-item>
    </template>
  </dt-dropdown>
</template>

<script setup>
import { DtButton, DtStack, DtText } from '@dialpad/dialtone-vue';
import { DtIconChevronsUpDown, DtIconCheck } from '@dialpad/dialtone-icons/vue';

import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { resolveTokenValue } from '@/src/lib/tokens';
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
  defaultValue: {
    type: undefined,
    default: undefined,
  },
  validValues: {
    type: Array,
    default: undefined,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  generateLabel: {
    type: Function,
    default: (value) => value.toString(),
  },
  tokenCategory: {
    type: String,
    default: undefined,
  },
  propValues: {
    type: Object,
    default: undefined,
  },
  disabledValues: {
    type: Set,
    default: undefined,
  },
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

function onInput (e) {
  emit(VALUE_UPDATE_EVENT, e === 'null' ? null : e);
}

const options = computed(() => {
  const valueOptions = props.validValues?.map(selection => {
    const optionDisabled = props.disabledValues?.has(String(selection)) ?? false;
    const resolved = !optionDisabled && props.tokenCategory
      ? resolveTokenValue(props.tokenCategory, selection, props.propValues)
      : null;
    return { value: selection, label: props.generateLabel(selection), resolved, disabled: optionDisabled };
  }) ?? [];

  if (props.defaultValue === null || props.defaultValue === undefined) {
    return [{ value: null, label: 'null' }, ...valueOptions];
  }
  return valueOptions;
});

const selectedOption = computed(() => {
  return options.value.find(o => String(o.value) === String(props.value));
});

const selectedLabel = computed(() => selectedOption.value?.label ?? '');
</script>

<script>
/**
 * Control that is used to select any value from a list of values.
 */
export default {
  name: 'DtcControlSelection',
};
</script>
