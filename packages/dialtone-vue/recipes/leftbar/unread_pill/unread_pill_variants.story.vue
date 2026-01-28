<template>
  <div class="d-stack16">
    <dt-recipe-unread-pill
      direction="up"
      kind="mentions"
    />
    <dt-recipe-unread-pill
      direction="down"
      kind="mentions"
    />
    <dt-recipe-unread-pill
      direction="up"
      kind="messages"
    />
    <dt-recipe-unread-pill
      direction="down"
      kind="messages"
    />
  </div>
</template>

<script>
import DtRecipeUnreadPill from './unread_pill.vue';

export default {
  name: 'DtRecipeUnreadPillVariants',
  components: { DtRecipeUnreadPill },
};
</script>
