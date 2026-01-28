<template>
  <dt-recipe-group-row
    :names="$attrs.names"
    :unread-count="$attrs.unreadCount"
    :has-unreads="$attrs.hasUnreads"
    :unread-mention-count="$attrs.unreadMentionCount"
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
