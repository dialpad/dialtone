<template>
  <dt-recipe-group-row
    :group-count-text="groupCountText"
    :names="names"
    :unread-count="unreadCount"
    :unread-count-tooltip="unreadCountTooltip"
    :has-unreads="hasUnreads"
    :selected="selected"
    :is-typing="isTyping"
    @click="onClick"
  />
</template>

<script>
import DtRecipeGroupRow from './group_row';

export default {
  name: 'DtRecipeGroupRowDefault',
  components: { DtRecipeGroupRow },
};
</script>
