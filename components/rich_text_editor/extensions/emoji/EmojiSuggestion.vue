<template>
  <dt-stack
    direction="row"
    gap="400"
  >
    <dt-emoji
      size="200"
      :code="item"
    />
    {{ item }}
  </dt-stack>
</template>

<script>
import { DtEmoji } from '@/emoji';
import { DtStack } from '@/components/stack';

export default {
  name: 'EmojiSuggestion',
  components: {
    DtEmoji,
    DtStack,
  },

  props: {
    item: {
      type: String,
      required: true,
    },
  },
};
</script>
