<template>
  <dt-toggle
    :checked="checked"
    :disabled="disabled"
    :size="size"
    :show-icon="showIcon"
    :label-class="labelClass"
    :label-child-props="labelChildProps"
    :toggle-on-click="toggleOnClick"
    @change="onChange"
  >
    <span
      v-if="defaultSlot"
      v-html="defaultSlot"
    />
  </dt-toggle>
</template>

<script>
import DtToggle from './toggle';

export default {
  name: 'ToggleDefault',
  components: { DtToggle },
};
</script>
