<template>
  <dt-slider-alt
    :model-value="$attrs.modelValue"
    :min="$attrs.min"
    :max="$attrs.max"
    :step="$attrs.step"
    :disabled="$attrs.disabled"
    :orientation="$attrs.orientation"
    :inverted="$attrs.inverted"
    :show-ticks="$attrs.showTicks"
    :tick-interval="$attrs.tickInterval"
    :min-steps-between-values="$attrs.minStepsBetweenValues"
    :size="$attrs.size"
    :label="$attrs.label"
    :label-hidden="$attrs.labelHidden"
    :name="$attrs.name"
    :large-step="$attrs.largeStep"
    :label-class="$attrs.labelClass"
    :start-class="$attrs.startClass"
    :end-class="$attrs.endClass"
    @update:model-value="$attrs['onUpdate:modelValue']"
    @change="$attrs.onChange"
    @focus="$attrs.onFocus"
    @blur="$attrs.onBlur"
  >
    <template
      v-if="$attrs.labelSlot"
      #label
    >
      <span v-html="$attrs.labelSlot" />
    </template>
    <template
      v-if="$attrs.startSlot"
      #start
    >
      <span v-html="$attrs.startSlot" />
    </template>
    <template
      v-if="$attrs.endSlot"
      #end
    >
      <span v-html="$attrs.endSlot" />
    </template>
  </dt-slider-alt>
</template>

<script>
import DtSliderAlt from './SliderAlt.vue';

export default {
  name: 'SliderAltDefault',
  components: { DtSliderAlt },
};
</script>
