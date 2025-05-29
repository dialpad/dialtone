<template>
  <dt-toggle
    :model-value="$attrs.modelValue"
    :disabled="$attrs.disabled"
    :size="$attrs.size"
    :show-icon="$attrs.showIcon"
    :label-class="$attrs.labelClass"
    :wrapper-class="$attrs.wrapperClass"
    :label-child-props="$attrs.labelChildProps"
    :toggle-on-click="$attrs.toggleOnClick"
    @change="$attrs.onChange"
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
