<template>
  <dt-toggle
    :checked="$attrs.checked"
    :disabled="$attrs.disabled"
    :size="$attrs.size"
    :show-icon="$attrs.showIcon"
    :label-class="$attrs.labelClass"
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
