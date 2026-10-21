<template>
  <dtc-control-clearable-shell
    :label="label"
    :empty="false"
    :clearable="false"
    :disabled="disabled"
    align="center"
  >
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
      :key="configKey"
      class="d-w100p"
      :model-value="value"
      :min="sliderConfig.min"
      :max="sliderConfig.max"
      :step="sliderConfig.step"
      :suffix="sliderConfig.suffix"
      :label="label"
      :show-label="false"
      :disabled="disabled"
      @update:model-value="updateValue"
    />
    <dt-text
      v-else
      as="div"
      tone="secondary"
    >
      {{ String(value) }} — unavailable for this slider
    </dt-text>
  </dtc-control-clearable-shell>
</template>

<script setup>
import { computed } from 'vue';
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
});
const emit = defineEmits([VALUE_UPDATE_EVENT]);
const canEdit = computed(() => isSliderControlValue(props.value, props.sliderConfig, props.validator));
// Recreate on configuration changes so DtSlider cannot normalize its old internal value.
const configKey = computed(() => JSON.stringify(props.sliderConfig));

function updateValue (value) {
  if (props.disabled || !isSliderControlValue(value, props.sliderConfig, props.validator)) return;
  emit(VALUE_UPDATE_EVENT, value);
}
</script>

<script>
export default { name: 'DtcControlSlider' };
</script>
