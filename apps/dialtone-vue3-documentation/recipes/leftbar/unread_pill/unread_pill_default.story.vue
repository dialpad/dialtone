<template>
  <dt-recipe-unread-pill
    :direction="$attrs.direction"
    :kind="$attrs.kind"
    @click="$attrs.onClick"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
  </dt-recipe-unread-pill>
</template>

<script>
import { DtRecipeUnreadPill } from '@dialpad/dialtone-vue';

export default {
  name: 'DtRecipeUnreadPillDefault',
  components: { DtRecipeUnreadPill },
};
</script>
