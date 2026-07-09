<template>
  <dt-text-list
    :type="$attrs.type"
    :marker="$attrs.marker"
    :marker-tone="$attrs.markerTone"
    :gap="$attrs.gap"
    :start="$attrs.start"
    :reversed="$attrs.reversed"
  >
    <dt-text-list-item
      v-for="(item, index) in items"
      :key="index"
      :value="itemValues[index]"
    >
      {{ item }}
    </dt-text-list-item>
  </dt-text-list>
</template>

<script>
import { DtTextList, DtTextListItem } from './index';

export default {
  name: 'DtTextListDefault',
  components: { DtTextList, DtTextListItem },
  inheritAttrs: false,

  computed: {
    items () {
      // Storybook always supplies items via argsData — no fallback copy here.
      return this.$attrs.items || [];
    },

    itemValues () {
      return this.$attrs.itemValues || [];
    },

  },
};
</script>
