<template>
  <dt-recipe-emoji-row
    :reactions="$attrs.reactions"
    @emoji-clicked="$attrs.onEmojiClicked"
    @emoji-hovered="$attrs.onEmojiHovered"
  />
</template>

<script>
import DtRecipeEmojiRow from './emoji_row.vue';

export default {
  name: 'DtRecipeEmojiRowDefault',
  components: { DtRecipeEmojiRow },
};
</script>
