<template>
  <dt-recipe-emoji-row
    :reactions="reactions"
    @emoji-clicked="onEmojiClicked"
    @emoji-hovered="onEmojiHovered"
  />
</template>

<script>
import DtRecipeEmojiRow from './emoji_row.vue';

export default {
  name: 'DtRecipeEmojiRowDefault',
  components: { DtRecipeEmojiRow },
};
</script>
