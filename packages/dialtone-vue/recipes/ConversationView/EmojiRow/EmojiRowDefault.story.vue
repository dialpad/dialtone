<template>
  <dt-recipe-emoji-row
    :reactions="emojiReactionsData"
    @emoji-clicked="$attrs.onEmojiClicked"
    @emoji-hovered="$attrs.onEmojiHovered"
  />
</template>

<script setup>
import DtRecipeEmojiRow from './EmojiRow.vue';
import { useMockReactions } from '@/recipes/ConversationView/EmojiRow/Composables/UseMockReactions.js';

const { mockReactions: emojiReactionsData } = useMockReactions();
</script>
