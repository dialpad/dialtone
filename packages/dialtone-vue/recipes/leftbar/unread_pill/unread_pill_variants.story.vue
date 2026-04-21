<template>
  <dt-stack gap="200">
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
  </dt-stack>
</template>

<script>
import DtRecipeUnreadPill from './unread_pill.vue';
import { DtStack } from '@/components/stack';

export default {
  name: 'DtRecipeUnreadPillVariants',
  components: { DtRecipeUnreadPill, DtStack },
};
</script>
