<template>
  <div class="d-stack16">
    <dt-recipe-unread-pill
      direction="up"
      kind="mentions"
    >
      Unread mentions
    </dt-recipe-unread-pill>
    <dt-recipe-unread-pill
      direction="down"
      kind="mentions"
    >
      Unread mentions
    </dt-recipe-unread-pill>
    <dt-recipe-unread-pill
      direction="up"
      kind="messages"
    >
      Unread messages
    </dt-recipe-unread-pill>
    <dt-recipe-unread-pill
      direction="down"
      kind="messages"
    >
      Unread messages
    </dt-recipe-unread-pill>
  </div>
</template>

<script>
import DtRecipeUnreadPill from './unread_pill.vue';

export default {
  name: 'DtRecipeUnreadPillVariants',
  components: { DtRecipeUnreadPill },
};
</script>
