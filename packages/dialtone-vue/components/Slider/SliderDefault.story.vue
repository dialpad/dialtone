<template>
  <dt-slider
    :model-value="$attrs.modelValue"
    :min="$attrs.min"
    :max="$attrs.max"
    :step="$attrs.step"
    :disabled="$attrs.disabled"
    :orientation="$attrs.orientation"
    :show-ticks="$attrs.showTicks"
    :min-gap-steps="$attrs.minGapSteps"
    :label="$attrs.label"
    :show-label="$attrs.showLabel"
    :label-size="$attrs.labelSize"
    :label-strength="$attrs.labelStrength"
    :name="$attrs.name"
    :large-step="$attrs.largeStep"
    :snap-points="$attrs.snapPoints"
    :fill-origin="$attrs.fillOrigin"
    :readout="$attrs.readout"
    :prefix="$attrs.prefix"
    :suffix="$attrs.suffix"
    :show-marks="$attrs.showMarks"
    :get-value-text="$attrs.getValueText"
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
  </dt-slider>
</template>

<script>
import DtSlider from './Slider.vue';

export default {
  name: 'SliderDefault',
  components: { DtSlider },
};
</script>
