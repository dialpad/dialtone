<template>
  <dt-recipe-unread-chip
    :direction="$attrs.direction"
    :kind="$attrs.kind"
    @click="$attrs.onClick"
  >
    <template v-if="defaultSlot">
      <span v-html="defaultSlot" />
    </template>
  </dt-recipe-unread-chip>
</template>

<script>
import DtRecipeUnreadChip from './unread_chip.vue';

export default {
  name: 'DtRecipeUnreadChipDefault',
  components: { DtRecipeUnreadChip },
};
</script>
