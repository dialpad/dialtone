<template>
  <dt-recipe-unread-pill
    :direction="direction"
    :kind="kind"
    @click="onClick"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
  </dt-recipe-unread-pill>
</template>

<script>
import DtRecipeUnreadPill from './unread_pill.vue';

export default {
  name: 'DtRecipeUnreadPillDefault',
  components: { DtRecipeUnreadPill },
};
</script>
