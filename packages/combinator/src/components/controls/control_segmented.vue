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
    <template #expanded-label>
      <dt-text
        kind="label"
        :size="100"
        tone="secondary"
        class="d-input__label-text d-c-default"
      >
        <slot />
      </dt-text>
    </template>
    <dt-segmented-control
      ref="segmentedRef"
      class="d-fl1"
      :model-value="selectedValue"
      :size="100"
      :disabled="disabled"
      @change="onInput"
      @focusout="collapseIfEmpty"
    >
      <dt-segmented-control-item
        v-for="option in options"
        :key="option.value"
        v-dt-tooltip="option.resolved ?? undefined"
        :value="String(option.value)"
      >
        {{ option.label }}
      </dt-segmented-control-item>
    </dt-segmented-control>
  </dtc-control-clearable-shell>
</template>

<script setup>
import { DtSegmentedControl, DtSegmentedControlItem, DtText } from '@dialpad/dialtone-vue';

import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { resolveTokenValue } from '@/src/lib/tokens';
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  value: {
    type: undefined,
    required: true,
  },
  validValues: {
    type: Array,
    default: undefined,
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
});

const emit = defineEmits([VALUE_UPDATE_EVENT]);

const expanded = ref(false);
const segmentedRef = ref(null);
const hasPendingValue = ref(false);

const options = computed(() => {
  return props.validValues?.map(v => ({
    value: v,
    label: props.generateLabel(v),
    resolved: props.tokenCategory
      ? resolveTokenValue(props.tokenCategory, v, props.propValues)
      : null,
  })) ?? [];
});

// DtSegmentedControl coerces values to strings — map back to original types on selection
const valueMap = computed(() => {
  const map = {};
  props.validValues?.forEach(v => {
    map[String(v)] = v;
  });
  return map;
});

const isEmpty = computed(() => props.value === null || props.value === undefined || props.value === '');

const selectedValue = computed(() => isEmpty.value ? '' : String(props.value));

const clearDisabled = computed(() => !props.clearable || props.required || props.disabled || isEmpty.value);

function onInput (stringValue) {
  hasPendingValue.value = true;
  emit(VALUE_UPDATE_EVENT, valueMap.value[stringValue]);
}

async function addValue () {
  expanded.value = true;
  await nextTick();
  segmentedRef.value?.$el?.querySelector('[data-qa="dt-segmented-control-item"]')?.focus();
}

function collapseIfEmpty (event) {
  const nextTarget = event?.relatedTarget;
  if (nextTarget && segmentedRef.value?.$el?.contains(nextTarget)) return;
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
});
</script>

<script>
/**
 * Control that renders a segmented control for enum props with few, short options.
 */
export default {
  name: 'DtcControlSegmented',
};
</script>
