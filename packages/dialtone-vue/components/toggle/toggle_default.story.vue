<template>
  <dt-toggle
    :model-value="$attrs.modelValue"
    :disabled="$attrs.disabled"
    :size="$attrs.size"
    :show-icon="$attrs.showIcon"
    :label-class="$attrs.labelClass"
    :class="$attrs.class"
    :label-child-props="$attrs.labelChildProps"
    :toggle-on-click="$attrs.toggleOnClick"
    @update:model-value="$attrs['onUpdate:modelValue']"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
  </dt-toggle>
</template>

<script>
import DtToggle from './toggle.vue';

export default {
  name: 'ToggleDefault',
  components: { DtToggle },
};
</script>
