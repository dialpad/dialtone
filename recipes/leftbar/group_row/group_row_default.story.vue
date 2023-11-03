<template>
  <dt-recipe-group-row
    :group-count-text="$attrs.groupCountText"
    :names="$attrs.names"
    :unread-count="$attrs.unreadCount"
    :unread-count-tooltip="$attrs.unreadCountTooltip"
    :has-unreads="$attrs.hasUnreads"
    :selected="$attrs.selected"
    :is-typing="$attrs.isTyping"
    @click="$attrs.onClick"
  />
</template>

<script>
import DtRecipeGroupRow from './group_row.vue';

export default {
  name: 'DtRecipeGroupRowDefault',
  components: { DtRecipeGroupRow },
};
</script>
