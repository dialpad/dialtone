<template>
  <dt-toggle
    :checked="$attrs.checked"
    :disabled="$attrs.disabled"
    :label-class="$attrs.labelClass"
    :label-child-props="$attrs.labelChildProps"
    @change="$attrs.onChange"
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
