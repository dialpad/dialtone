<template>
  <dt-segmented-control
    v-model="selectedValue"
    :options="options"
    :orientation="$attrs.orientation"
    :size="$attrs.size"
    :activation-mode="$attrs.activationMode"
    :disabled="$attrs.disabled"
    :gap="$attrs.gap"
    :label-class="$attrs.labelClass"
    aria-label="View filter"
  />
</template>

<script>
import DtSegmentedControl from './segmented_control.vue';

export default {
  name: 'DtSegmentedControlDefault',
  components: { DtSegmentedControl },

  data () {
    return {
      selectedValue: 'all',
      options: [
        { value: 'all', label: 'All', selected: true },
        { value: 'favorites', label: 'Favorites' },
        { value: 'recent', label: 'Recent' },
        { value: 'groups', label: 'Groups' },
      ],
    };
  },
};
</script>
