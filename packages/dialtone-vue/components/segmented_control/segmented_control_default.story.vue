<template>
  <dt-segmented-control
    v-model="selectedValue"
    :orientation="$attrs.orientation"
    :size="$attrs.size"
    :activation-mode="$attrs.activationMode"
    :disabled="$attrs.disabled"
    :spread="$attrs.spread"
    :label-class="$attrs.labelClass"
    aria-label="View filter"
  >
    <dt-segmented-control-item value="all">
      All
    </dt-segmented-control-item>
    <dt-segmented-control-item value="favorites">
      Favorites
    </dt-segmented-control-item>
    <dt-segmented-control-item value="recent">
      Recent
    </dt-segmented-control-item>
    <dt-segmented-control-item value="groups">
      Groups
    </dt-segmented-control-item>
  </dt-segmented-control>
</template>

<script>
import DtSegmentedControl from './segmented_control.vue';
import DtSegmentedControlItem from './segmented_control_item.vue';

export default {
  name: 'DtSegmentedControlDefault',
  components: { DtSegmentedControl, DtSegmentedControlItem },

  data () {
    return {
      selectedValue: 'all',
    };
  },
};
</script>
