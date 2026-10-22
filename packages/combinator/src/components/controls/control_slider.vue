<template>
  <dtc-control-clearable-shell
    :label="label"
    :empty="isEmpty"
    :clearable="clearable"
    :required="required"
    :disabled="disabled || (isEmpty && !canAdd)"
    align="center"
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
        class="d-d-block"
      >
        <slot />
      </dt-text>
    </template>
    <dt-slider
      v-if="canEdit"
      ref="sliderRef"
      :key="configKey"
      class="d-w100p"
      :model-value="value"
      :min="sliderConfig.min"
      :max="sliderConfig.max"
      :step="sliderConfig.step"
      :suffix="sliderConfig.suffix"
      :label="label"
      :show-label="false"
      show-marks
      :show-ticks="sliderConfig.showTicks"
      readout="always"
      :disabled="disabled"
      @update:model-value="updateValue"
    />
    <dt-text
      v-else
      as="div"
      tone="secondary"
    >
      {{ String(value) }} — {{ unavailableReason }}
    </dt-text>
  </dtc-control-clearable-shell>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import { useClearableState } from '@/src/lib/utils_vue';
import { DtSlider, DtText } from '@dialpad/dialtone-vue';
import DtcControlClearableShell from './control_clearable_shell.vue';
import { VALUE_UPDATE_EVENT } from '@/src/lib/constants';
import { isSliderControlValue } from '@/src/lib/slider_control';

const props = defineProps({
  value: { type: undefined, default: undefined },
  sliderConfig: { type: Object, default: null },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  validator: { type: Function, default: undefined },
  defaultValue: { type: Number, default: undefined },
  clearable: { type: Boolean, default: true },
  required: { type: Boolean, default: false },
});
const emit = defineEmits([VALUE_UPDATE_EVENT]);
const sliderRef = ref(null);
const { isEmpty, clearDisabled } = useClearableState(props);
const addValueCandidate = computed(() => props.defaultValue ?? props.sliderConfig?.min);
const canAdd = computed(() => isSliderControlValue(addValueCandidate.value, props.sliderConfig, props.validator));
const canEdit = computed(() => props.sliderConfig?.max > props.sliderConfig?.min &&
  isSliderControlValue(props.value, props.sliderConfig, props.validator));
const unavailableReason = computed(() =>
  props.sliderConfig && props.value === props.sliderConfig.min && props.sliderConfig.min === props.sliderConfig.max
    ? 'only available value'
    : 'unavailable for this slider');
// Recreate on configuration changes so DtSlider cannot normalize its old internal value.
const configKey = computed(() => JSON.stringify(props.sliderConfig));

async function addValue () {
  emit(VALUE_UPDATE_EVENT, addValueCandidate.value);
  await nextTick();
  sliderRef.value?.focus();
}

function clearValue () {
  if (clearDisabled.value) return;
  emit(VALUE_UPDATE_EVENT, undefined);
}

function updateValue (value) {
  if (props.disabled || !isSliderControlValue(value, props.sliderConfig, props.validator)) return;
  emit(VALUE_UPDATE_EVENT, value);
}
</script>

<script>
export default { name: 'DtcControlSlider' };
</script>
