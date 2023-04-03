<template>
  <div class="d-stack16">
    <dt-recipe-unread-chip
      direction="up"
      kind="mentions"
    >
      Unread mentions
    </dt-recipe-unread-chip>
    <dt-recipe-unread-chip
      direction="down"
      kind="mentions"
    >
      Unread mentions
    </dt-recipe-unread-chip>
    <dt-recipe-unread-chip
      direction="up"
      kind="messages"
    >
      Unread messages
    </dt-recipe-unread-chip>
    <dt-recipe-unread-chip
      direction="down"
      kind="messages"
    >
      Unread messages
    </dt-recipe-unread-chip>
  </div>
</template>

<script>
import DtRecipeUnreadChip from './unread_chip.vue';

export default {
  name: 'DtRecipeUnreadChipVariants',
  components: { DtRecipeUnreadChip },
};
</script>
