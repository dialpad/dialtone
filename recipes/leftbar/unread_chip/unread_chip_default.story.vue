<template>
  <dt-recipe-unread-chip
    :direction="direction"
    :kind="kind"
    @click="onClick"
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
