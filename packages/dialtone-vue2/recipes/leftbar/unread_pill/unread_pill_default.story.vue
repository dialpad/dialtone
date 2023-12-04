<template>
  <dt-recipe-unread-pill
    :direction="$attrs.direction"
    :kind="$attrs.kind"
    @click="$attrs.onClick"
  >
    <template v-if="$attrs.default">
      <span v-html="$attrs.default" />
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
