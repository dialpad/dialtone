<template>
  <dt-toggle
    :checked="checked"
    :disabled="disabled"
    :label-class="labelClass"
    :label-child-props="labelChildProps"
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
